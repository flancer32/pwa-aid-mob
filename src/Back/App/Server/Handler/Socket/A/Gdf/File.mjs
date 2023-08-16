/**
 * Socket plug (terminator) to handle input and output data streams for audio file transcription.
 */
// MODULE'S IMPORT
import dialogflow from '@google-cloud/dialogflow';
import fs from 'node:fs';
import util from 'node:util';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
import {struct} from 'pb-util';
import {pipeline, Transform} from 'node:stream';

// MODULE'S VARS
const GOOGLE_PRJ_ID = 'ai-demo-64';
const pump = util.promisify(pipeline);

// MODULE'S CLASSES
export default class Aid_Mob_Back_App_Server_Handler_Socket_A_Gdf_File {
    /**
     * @param {TeqFw_Core_Back_Config} config
     */
    constructor(
        {
            TeqFw_Core_Back_Config$: config,
        }) {
        // INSTANCE METHODS

        /**
         * @param {WebSocket} ws
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req
         */
        this.process = async (ws, req) => {
            const sessionClient = new dialogflow.SessionsClient();
            const root = config.getPathToRoot();
            // const filename = join(root, 'tmp/google1.wav');
            const filename = join(root, 'tmp/google.ogg');

            // enum AudioEncoding {
            //     AUDIO_ENCODING_UNSPECIFIED = 0,
            //     AUDIO_ENCODING_LINEAR_16 = 1,
            //     AUDIO_ENCODING_FLAC = 2,
            //     AUDIO_ENCODING_MULAW = 3,
            //     AUDIO_ENCODING_AMR = 4,
            //     AUDIO_ENCODING_AMR_WB = 5,
            //     AUDIO_ENCODING_OGG_OPUS = 6,
            //     AUDIO_ENCODING_SPEEX_WITH_HEADER_BYTE = 7
            // }

            // const encoding = 'AUDIO_ENCODING_OGG_OPUS';
            const encoding = 'AUDIO_ENCODING_UNSPECIFIED';
            // const sampleRateHertz = 16000;
            // const languageCode = 'en-US';
            const languageCode = 'en-US';
            const projectId = GOOGLE_PRJ_ID;
            const sessionId = randomUUID();
            const sessionPath = sessionClient.projectAgentSessionPath(
                projectId,
                sessionId
            );

            const initialStreamRequest = {
                session: sessionPath,
                queryInput: {
                    audioConfig: {
                        audioEncoding: encoding,
                        // sampleRateHertz: sampleRateHertz,
                        languageCode: languageCode,
                    },
                },
            };
            debugger;


            // Create a stream for the streaming request.
            const detectStream = sessionClient
                .streamingDetectIntent()
                .on('error', console.error)
                .on('data', data => {
                    if (data.recognitionResult) {
                        console.log(
                            `Intermediate transcript: ${data.recognitionResult.transcript}`
                        );
                    } else {
                        console.log('Detected intent:');

                        const result = data.queryResult;
                        // Instantiates a context client
                        const contextClient = new dialogflow.ContextsClient();

                        console.log(`  Query: ${result.queryText}`);
                        console.log(`  Response: ${result.fulfillmentText}`);
                        if (result.intent) {
                            console.log(`  Intent: ${result.intent.displayName}`);
                        } else {
                            console.log('  No intent matched.');
                        }
                        const parameters = JSON.stringify(struct.decode(result.parameters));
                        console.log(`  Parameters: ${parameters}`);
                        if (result.outputContexts && result.outputContexts.length) {
                            console.log('  Output contexts:');
                            result.outputContexts.forEach(context => {
                                const contextId =
                                    contextClient.matchContextFromProjectAgentSessionContextName(
                                        context.name
                                    );
                                const contextParameters = JSON.stringify(
                                    struct.decode(context.parameters)
                                );
                                console.log(`    ${contextId}`);
                                console.log(`      lifespan: ${context.lifespanCount}`);
                                console.log(`      parameters: ${contextParameters}`);
                            });
                        }
                    }
                });

            // Write the initial stream request to config for audio input.
            detectStream.write(initialStreamRequest);

            // Stream an audio file from disk to the Conversation API, e.g.
            // "./resources/audio.raw"
            await pump(
                fs.createReadStream(filename),
                // Format the audio stream into the request format.
                new Transform({
                    objectMode: true,
                    transform: (obj, _, next) => {
                        next(null, {inputAudio: obj});
                    },
                }),
                detectStream
            );
        }

    }
}

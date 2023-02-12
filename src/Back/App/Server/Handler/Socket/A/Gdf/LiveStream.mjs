/**
 * Socket plug (terminator) to handle input and output data streams for Dialogflow Demo.
 */
// MODULE'S IMPORT
import dialogflow from '@google-cloud/dialogflow';
import {randomUUID} from 'node:crypto';

// MODULE'S CLASSES
export default class Aid_Mob_Back_App_Server_Handler_Socket_A_Gdf_LiveStream {
    constructor() {
        // INSTANCE METHODS

        /**
         * @param {WebSocket} ws
         */
        this.process = async (ws) => {
            // FUNCS

            /**
             *
             * @param sessionClient
             * @param {Aid_Mob_Shared_Dto_Start_Dialogflow.Dto} dto
             */
            function getInitRequest(sessionClient, dto) {
                const sessionId = randomUUID();
                const audioEncoding = 'AUDIO_ENCODING_UNSPECIFIED';
                const languageCode = dto.lang;
                const session = sessionClient.projectAgentSessionPath(
                    dto.projectId,
                    sessionId
                );
                console.log(`New session ID is generated: ${sessionId}.`);
                return {
                    session,
                    queryInput: {
                        audioConfig: {
                            audioEncoding,
                            languageCode,
                        },
                    },
                };
            }

            // MAIN
            let isStarted = false;
            /** @type {SessionsClient} */
            const sessionClient = new dialogflow.SessionsClient();
            /** @type {Stream} */
            let stream;

            ws.on('message', async (data) => {
                try {
                    if (!isStarted) {
                        // this is the first message with connection params
                        /** @type {Aid_Mob_Shared_Dto_Start_Dialogflow.Dto} */
                        const dtoStart = JSON.parse(data.toString());
                        isStarted = true;
                        // create a stream for the streaming request
                        // noinspection JSValidateTypes
                        stream = sessionClient.streamingDetectIntent();
                        stream.on('finish', () => {
                            console.log(`Dialogflow web socket is closed.`);
                        });
                        stream.on('end', () => {
                            console.log('Stream end');
                        });
                        stream.on('data', (data) => {
                            console.log(data);
                        });
                        // initialize stream to Google
                        const initialStreamRequest = getInitRequest(sessionClient, dtoStart);
                        stream.write(initialStreamRequest);
                    } else {
                        // just a binary data with audio
                        // console.log(data);
                        stream.write({
                            inputAudio: data,
                        });
                    }
                } catch (e) {
                    console.error(`Client WS error (GDF): `, e);
                }
            });
            ws.on('close', () => {
                console.log(`Client web socket is closed.`);
                stream?.end();
            });
        }

    }
}

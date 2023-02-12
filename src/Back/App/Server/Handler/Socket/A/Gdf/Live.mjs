/**
 * Socket plug (terminator) to handle input and output data streams for Dialogflow Demo.
 */
// MODULE'S IMPORT
import dialogflow from '@google-cloud/dialogflow';
import {randomUUID} from 'node:crypto';

// MODULE'S CLASSES
export default class Aid_Mob_Back_App_Server_Handler_Socket_A_Gdf_Live {
    constructor() {
        // INSTANCE METHODS

        /**
         * @param {WebSocket} ws
         */
        this.process = async (ws) => {
            // FUNCS

            /**
             * @param sessionClient
             * @param session
             * @param {string} lang
             */
            function getRequestBase(sessionClient, session, lang) {
                const audioEncoding = 'AUDIO_ENCODING_UNSPECIFIED';
                const languageCode = lang;
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

            /**
             * The path to identify the agent that owns the created intent.
             *
             * @param sessionClient
             * @param {string} projectId
             * @param {string} sessionId
             * @returns {*}
             */
            function getSessionPath(sessionClient, projectId, sessionId) {
                return sessionClient.projectAgentSessionPath(
                    projectId,
                    sessionId
                );
            }

            // MAIN
            let isStarted = false, sessionPath, lang;
            const sessionId = randomUUID();
            /** @type {SessionsClient} */
            const sessionClient = new dialogflow.SessionsClient();
            /** @type {Stream} */
            let stream;

            ws.on('message', async (data) => {
                try {
                    if (data?.length < 1000) {
                        // perhaps JSON
                        if (!isStarted) {
                            // this is the first message with connection params
                            isStarted = true;
                            /** @type {Aid_Mob_Shared_Dto_Start_Dialogflow.Dto} */
                            const dtoStart = JSON.parse(data.toString());
                            lang = dtoStart.lang;
                            sessionPath = getSessionPath(sessionClient, dtoStart.projectId, sessionId)
                        } else {
                            console.log(data.toString());
                        }
                    } else {
                        // perhaps binary data, send data to Dialogflow
                        const request = getRequestBase(sessionClient, sessionPath, lang);
                        request.inputAudio = data;
                        const [response] = await sessionClient.detectIntent(request);
                        console.log('Detected intent:');
                        const result = response.queryResult;
                        console.log(`  Query: ${result.queryText}`);
                        console.log(`  Response: ${result.fulfillmentText}`);
                        if (result.intent) {
                            console.log(`  Intent: ${result.intent.displayName}`);
                        } else {
                            console.log('  No intent matched.');
                        }
                        const toClient = {
                            user: result.queryText,
                            bot: result.fulfillmentText,
                        };
                        ws.send(JSON.stringify(toClient));
                    }
                    // if (!isStarted) {
                    //     // this is the first message with connection params
                    //     /** @type {Aid_Mob_Shared_Dto_Start_Dialogflow.Dto} */
                    //     const dtoStart = JSON.parse(data.toString());
                    //     isStarted = true;
                    //     // create a stream for the streaming request
                    //     // noinspection JSValidateTypes
                    //     stream = sessionClient.streamingDetectIntent();
                    //     stream.on('finish', () => {
                    //         console.log(`Dialogflow web socket is closed.`);
                    //     });
                    //     stream.on('end', () => {
                    //         console.log('Stream end');
                    //     });
                    //     stream.on('data', (data) => {
                    //         console.log(data);
                    //     });
                    //     // initialize stream to Google
                    //     const sessionId = randomUUID();
                    //     const initialStreamRequest = getRequestBase(sessionClient, sessionId, dtoStart);
                    //     stream.write(initialStreamRequest);
                    //     ws.send(JSON.stringify(`Google Dialogflow session '${sessionId}' is opened.`));
                    // } else if (false) {
                    //
                    // } else {
                    //
                    //     // just a binary data with audio
                    //     // console.log(data);
                    //     stream.write({
                    //         inputAudio: data,
                    //     });
                    // }
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

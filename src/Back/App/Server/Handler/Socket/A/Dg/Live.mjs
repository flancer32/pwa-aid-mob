/**
 * Socket plug (terminator) to handle input and output data streams for live audion transcription.
 * This plug redirects audio data from browser to Deepgram API then redirects Deepgram result back to browser.
 */
// MODULE'S IMPORT
import SDK from '@deepgram/sdk';

// MODULE'S CLASSES
export default class Aid_Mob_Back_App_Server_Handler_Socket_A_Dg_Live {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance

        // VARS
        logger.setNamespace(this.constructor.name);

        // INSTANCE METHODS

        /**
         * Add listeners for every web socket.
         * @param {WebSocket} wsBrowser
         */
        this.process = (wsBrowser) => {
            // VARS
            const chunks = []; // to store received audio data until DG socket will be ready
            let isCfgReceived = false; // the first message from client with DG API settings is received
            let isDgOpened = false; // DG websocket is opened, we can send audio data into the socket
            /**
             * Websocket connection to Deepgram to transcribe audio stream being got from a browser.
             * @see @deepgram/sdk/dist/transcription/liveTranscription.d.ts
             */
            let wsDeepgram;

            // FUNCS

            /**
             * Close Deepgram websocket when browser websocket is closed.
             */
            function onClose() {
                if (typeof wsDeepgram?.finish === 'function') {
                    logger.info(`Web client socket is closed. Close Deepgram socket too.`);
                    wsDeepgram.finish();
                }
            }

            /**
             * Handle binary `data` being got from a browser (web app):
             *  - get Deepgram API configuration options
             *  - open websocket to Deepgram API
             *  - re-send audio data from browser to Deepgram
             *  - re-send transcription results from Deepgram to browser
             *
             * @param {Buffer} data
             */
            function onMessage(data) {
                // VARS
                /**
                 * Timestamp to trace time intervals in intercommunication.
                 * @type {Date}
                 */
                let timeStart;

                // FUNCS

                function onError(evt) {
                    logger.error(`Data message from browser cannot be processed. `
                        + `Error: ${evt?.message || evt}`);
                }

                function onClose() {
                    logger.info('Deepgram web socket is closed.');
                    if (wsBrowser.readyState < 2) // 0: CONNECTING, 1: OPEN, 2: CLOSING, 3: CLOSED.
                        wsBrowser.close(1000, 'Deepgram web socket was closed.');
                }

                function onOpen() {
                    isDgOpened = true;
                    const timeDelta = (new Date()).getTime() - timeStart.getTime();
                    logger.info(`Deepgram web socket is opened in ${timeDelta} ms.`);
                    const buffered = Buffer.concat(chunks);
                    if (buffered.length) {
                        logger.info(`Send buffered audio data to Deepgram. Buffer length: ${buffered.length}.`);
                        wsDeepgram.send(buffered);
                        chunks.length = 0;
                    }
                }

                function onTranscriptReceived(message) {
                    logger.info(`Transcript is received: ${message}`);
                    // Write only the transcription to the browser socket
                    // const message = data?.channel?.alternatives[0]?.transcript;
                    //console.dir(res, {depth: null});
                    if (message && (typeof message === 'string') && message.length) {
                        const data = JSON.parse(message);
                        wsBrowser.send(JSON.stringify(data));
                    }
                }

                // MAIN
                try {
                    if (!isCfgReceived) {
                        // the first message from web should be a config options with API key
                        /** @type {Aid_Mob_Shared_Dto_Deepgram_Cfg.Dto} */
                        const dtoStart = JSON.parse(data.toString());
                        isCfgReceived = true;
                        if (dtoStart?.apiKey?.length === 40) {
                            // open DG web socket and setup listeners for the events
                            timeStart = new Date();
                            const deepgram = new SDK.Deepgram(dtoStart.apiKey);
                            wsDeepgram = deepgram.transcription.live({
                                encoding: 'ogg-opus',
                                interim_results: true,
                                language: dtoStart?.lang ?? 'en-US',
                                punctuate: true,
                                sample_rate: 16000,
                            });
                            // add listeners to Deepgram websocket
                            wsDeepgram.addListener('open', onOpen);
                            wsDeepgram.addListener('error', onError);
                            wsDeepgram.addListener('close', onClose);
                            wsDeepgram.addListener('transcriptReceived', onTranscriptReceived);
                        } else {
                            logger.error(`Wrong length (!=40) for Deepgram API Key: ${dtoStart?.apiKey}.`);
                            wsBrowser.close(1000, 'Normal Closure');
                        }
                    } else {
                        // other messages from browser should be an audio BLOBs
                        if (isDgOpened && (wsDeepgram.getReadyState() === 1)) {
                            // DG socket is opened: redirect audio data to Deepgram
                            wsDeepgram.send(Buffer.from(data));
                        } else {
                            // DG socket is not opened: save audio data into internal buffer
                            chunks.push(Buffer.from(data));
                        }
                    }
                } catch (e) {
                    logger.error(`Data message from browser cannot be processed. `
                        + `Error: ${e?.message || e}`);
                }
            }

            // MAIN
            wsBrowser.on('close', onClose);
            wsBrowser.on('message', onMessage);
            logger.info(`Web client socket is opened, listeners are added to the socket.`);
        }

    }
}

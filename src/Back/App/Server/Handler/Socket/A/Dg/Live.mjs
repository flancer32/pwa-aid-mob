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
        /** @type {typeof Aid_Mob_Shared_Dto_Deepgram_Command.Name} */
        const COMMAND = spec['Aid_Mob_Shared_Dto_Deepgram_Command.Name$'];

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
            /**
             * Websocket connection to Deepgram to transcribe audio stream being got from a browser.
             * @see @deepgram/sdk/dist/transcription/liveTranscription.d.ts
             */
            let wsDeepgram;

            // FUNCS

            /**
             * Close Deepgram websocket.
             */
            function closeDgSocket() {
                // https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
                if (
                    (wsDeepgram?.getReadyState() === 0) ||
                    (wsDeepgram?.getReadyState() === 1)
                ) {
                    logger.info(`Send 'finish' command to Deepgram.`);
                    wsDeepgram.finish();
                }
            }

            /**
             * Close Deepgram websocket when browser websocket is closed.
             */
            function onClose() {
                logger.info(`Web client socket is closed.`);
                closeDgSocket();
            }

            /**
             * Handle binary `data` being got from a browser (web app):
             *  - get Deepgram API configuration options
             *  - open websocket to Deepgram API
             *  - re-send audio data from browser to Deepgram
             *  - re-send transcription results from Deepgram to browser
             *  - close Deepgram websocket if `close` message is received from browser
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

                /**
                 * Open websocket to Deepgram.
                 * @param {Aid_Mob_Shared_Dto_Deepgram_Cfg.Dto} input
                 * @param {WebSocket} wsBrowser
                 */
                function openDgWebsocket(input, wsBrowser) {
                    // FUNCS

                    function onError(evt) {
                        logger.error(`Data message from browser cannot be processed. `
                            + `Error: ${evt?.message || evt}`);
                    }

                    function onClose() {
                        logger.info('Deepgram web socket is closed. Close client websocket.');
                        if (wsBrowser.readyState < 2) // 0: CONNECTING, 1: OPEN, 2: CLOSING, 3: CLOSED.
                            wsBrowser.close(1000, 'Deepgram web socket was closed.');
                    }

                    function onOpen() {
                        const timeDelta = (new Date()).getTime() - timeStart.getTime();
                        logger.info(`Deepgram web socket is opened in ${timeDelta} ms.`);
                        const buffered = Buffer.concat(chunks);
                        if (buffered.length) {
                            logger.info(`Send buffered audio data to Deepgram. Buffer length: ${buffered.length}.`);
                            wsDeepgram.send(buffered);
                            chunks.length = 0;
                        }
                    }

                    function onTranscriptReceived(msg) {
                        if (msg?.length) {
                            // we need to convert data to object then to string
                            const data = JSON.parse(msg);
                            logger.info(`Deepgram transcription is received (length: ${msg?.length}).`, data);
                            wsBrowser.send(JSON.stringify(data));
                        }
                    }

                    // MAIN
                    let res;
                    // the first message from web should be a config options with API key
                    if (input?.apiKey?.length === 40) {
                        // open DG web socket and setup listeners for the events
                        timeStart = new Date();
                        const deepgram = new SDK.Deepgram(input.apiKey);
                        res = deepgram.transcription.live({
                            encoding: 'ogg-opus',
                            interim_results: true,
                            language: input?.lang ?? 'en-US',
                            punctuate: true,
                            sample_rate: 16000,
                        });
                        // add listeners to Deepgram websocket
                        res.addListener('open', onOpen);
                        res.addListener('error', onError);
                        res.addListener('close', onClose);
                        res.addListener('transcriptReceived', onTranscriptReceived);
                    } else {
                        logger.error(`Wrong length (!=40) for Deepgram API Key: ${input?.apiKey}.`);
                        wsBrowser.close(1000, 'Normal Closure');
                    }
                    return res;
                }

                // MAIN
                try {
                    // JSON data received from browser should be less than 512 bytes (other data is audio)
                    if (data?.length < 512) {
                        // most likely string (JSON) data
                        const input = JSON.parse(data.toString());
                        if (input?.apiKey && input?.lang) {
                            // start Deepgram websocket opening
                            wsDeepgram = openDgWebsocket(input, wsBrowser);
                        } else if (input?.name === COMMAND.STOP) {
                            logger.info(`STOP command is received from front-end. Close Deepgram websocket.`);
                            closeDgSocket();

                        }
                    } else {
                        // most likely binary data (audio BLOBs)
                        if (wsDeepgram.getReadyState() === 1) {
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

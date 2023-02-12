/**
 * Socket plug (terminator) to handle input and output data streams for audio file transcription.
 */
// MODULE'S IMPORT
import SDK from '@deepgram/sdk';
import fs from 'node:fs';
import {join} from 'node:path';

// MODULE'S CLASSES
export default class Aid_Mob_Back_App_Server_Handler_Socket_A_Dg_File {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Back_Config} */
        const config = spec['TeqFw_Core_Back_Config$'];

        // INSTANCE METHODS

        /**
         * @param {WebSocket} ws
         */
        this.process = (ws) => {
            let apiKey, deepgram, deepgramLive;
            console.log(`Socket is opened for Datagram File Transcription.`);

            ws.on('message', (data) => {
                try {
                    if (!apiKey) {
                        // the first message from web, should be API key
                        apiKey = data.toString();
                        if (apiKey.length === 40) {
                            const timeStart = new Date();
                            // open DG web socket and setup listeners for the events
                            deepgram = new SDK.Deepgram(apiKey);
                            deepgramLive = deepgram.transcription.live({
                                encoding: 'ogg-opus',
                                interim_results: true,
                                language: 'ru',
                                punctuate: true,
                                sample_rate: 16000,
                            });

                            deepgramLive.addListener('open', () => {
                                const timeDelta = (new Date()).getTime() - timeStart.getTime();
                                console.log(`DG web socket is opened in ${timeDelta} ms.`);
                                try {
                                    // Grab an audio file.
                                    const root = config.getPathToRoot();
                                    const filepath = join(root, 'tmp/ru.ogg');
                                    const contents = fs.readFileSync(filepath);
                                    if (deepgramLive.getReadyState() === 1) {
                                        deepgramLive.send(contents);
                                    } else {
                                        console.log(`Deepgram is not ready yet.`);
                                    }
                                } catch (e) {
                                    console.error(`Error in file handling: `, e);
                                }
                                deepgramLive.finish();
                            });

                            deepgramLive.addListener('error', (evt) => {
                                console.error('DG web socket error.', evt);
                            });

                            deepgramLive.addListener('close', () => {
                                console.log('DG web socket is closed.');
                                ws.close(1000, 'The work is done.');
                            });

                            deepgramLive.addListener('transcriptReceived', (message) => {
                                // console.log(`transcript is received:.`, message);
                                const data = JSON.parse(message);

                                // Write the entire response to the console
                                console.dir(data, {depth: null});

                                // Write only the transcription to the console
                                const res = data?.channel?.alternatives[0]?.transcript;
                                //console.dir(res, {depth: null});
                                if (res && (typeof res === 'string') && res.length) {
                                    ws.send(JSON.stringify(res));
                                }
                            });

                        } else {
                            console.error(`Wrong length (!=40) for Deepgram API Key: ${apiKey}.`);
                        }

                    } else {
                        // just skip other incoming messages
                    }
                } catch (e) {
                    console.log(`Error in Deepgram File Transcription: `, e);
                }
            });

            ws.on('close', () => {
                console.log(`Socket is closed for Datagram File Transcription.`);
            });
        }

    }
}

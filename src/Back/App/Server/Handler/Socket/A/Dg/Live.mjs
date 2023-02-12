/**
 * Socket plug (terminator) to handle input and output data streams for live audion transcription.
 */
// MODULE'S IMPORT
import SDK from '@deepgram/sdk';

// MODULE'S CLASSES
export default class Aid_Mob_Back_App_Server_Handler_Socket_A_Dg_Live {
    constructor() {
        // INSTANCE METHODS

        /**
         * @param {WebSocket} ws
         */
        this.process = (ws) => {
            let isStarted = false, isReadyToWork = false, deepgram, deepgramLive;
            console.log(`Socket is opened for Datagram Live Transcription.`);
            const chunks = []; // to store data until DG socket will be ready

            ws.on('message', function message(data) {
                try {
                    if (!isStarted) {
                        // this is the first message from web, should be API key
                        /** @type {Aid_Mob_Shared_Dto_Start_Deepgram.Dto} */
                        const dtoStart = JSON.parse(data.toString());
                        isStarted = true;
                        if (dtoStart?.apiKey?.length === 40) {
                            const timeStart = new Date();
                            // open DG web socket and setup listeners for the events
                            deepgram = new SDK.Deepgram(dtoStart.apiKey);
                            deepgramLive = deepgram.transcription.live({
                                encoding: 'ogg-opus',
                                interim_results: true,
                                language: dtoStart?.lang ?? 'en-US',
                                punctuate: true,
                                sample_rate: 16000,
                            });

                            deepgramLive.addListener('open', () => {
                                const timeDelta = (new Date()).getTime() - timeStart.getTime();
                                console.log(`DG web socket is opened in ${timeDelta} ms.`);
                                const buf = Buffer.concat(chunks);
                                if (buf.length) {
                                    console.log(`Send data from buffer to DG. Data length: ${buf.length}.`);
                                    deepgramLive.send(buf);
                                    chunks.length = 0;
                                }
                                isReadyToWork = true;
                                console.log(`Live streaming is started.`);
                            });

                            deepgramLive.addListener('error', (evt) => {
                                console.error('DG web socket error.', evt);
                            });

                            deepgramLive.addListener('close', () => {
                                console.log('DG web socket is closed. Close client web socket too.');
                                ws.close(1006, 'Abnormal Closure');
                            });

                            deepgramLive.addListener('transcriptReceived', (message) => {
                                console.log(`transcript is received:.`, message);
                                const data = JSON.parse(message);
                                // Write only the transcription to the console
                                const res = data?.channel?.alternatives[0]?.transcript;
                                //console.dir(res, {depth: null});
                                if (res && (typeof res === 'string') && res.length) {
                                    ws.send(JSON.stringify(res));
                                }
                            });

                        } else {
                            console.error(`Wrong length (!=40) for Deepgram API Key: ${dtoStart?.apiKey}.`);
                            ws.close(1000, 'Normal Closure');
                        }

                    } else {
                        // other messages should be BLOBs
                        console.log(data);
                        if (isReadyToWork && (deepgramLive.getReadyState() === 1)) {
                            deepgramLive.send(Buffer.from(data));
                            console.log(`Data is sent to DG.`, data);
                            // waitBuffer.push(...data);
                        } else {
                            chunks.push(Buffer.from(data));
                        }
                    }
                } catch (e) {
                    console.log(`Yep: `, e);
                }
            });
            // ws.send(JSON.stringify('AID is connected'));

            ws.on('close', () => {
                deepgramLive.finish();
            });
        }


    }
}

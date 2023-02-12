/**
 * Socket plug (terminator) to handle input and output data streams for live audion transcription.
 */
// MODULE'S IMPORT
import SDK from '@deepgram/sdk';
import fs from 'node:fs';

// MODULE'S VARS

// MODULE'S CLASSES

export default class Aid_Mob_Back_App_Server_Handler_Socket_A_Dg_Live {
    constructor() {
        // INSTANCE METHODS

        /**
         * @param {WebSocket} ws
         */
        this.process = function (ws) {
            let apiKey, deepgram, deepgramLive;
            console.log(`Client connection is opened.`);
            let waitBuffer = []; // to store data until DG socket will be ready

            ws.on('message', function message(data) {
                try {
                    if (!apiKey) {
                        // this is the first message from web, should be API key
                        apiKey = data.toString();
                        if (apiKey !== deepgramApiKey) {
                            console.error(`Wrong API: ${apiKey}.`);
                        } else {
                            console.log(`API key is received.`);
                        }
                        ws.binaryType = 'fragments';
                        // open deepgram connection
                        deepgram = new SDK.Deepgram(apiKey);
                        deepgramLive = deepgram.transcription.live({
                            encoding: 'ogg-opus',
                            interim_results: true,
                            language: 'ru',
                            sample_rate: 16000,
                        });

                        deepgramLive.addListener('open', () => {
                            console.log('DG connection is opened.');
                            // deepgramLive.send(Buffer.concat(waitBuffer));
                        });

                        deepgramLive.addListener('error', (evt) => {
                            console.log('DG connection error.', evt);
                        });

                        deepgramLive.addListener('close', () => {
                            console.log('DG connection is closed.');
                        });

                        deepgramLive.addListener('transcriptReceived', (message) => {
                            console.log(`transcript is received:.`, message);
                            const data = JSON.parse(message);

                            // Write the entire response to the console
                            // console.dir(data.channel, {depth: null});

                            // Write only the transcript to the console
                            console.dir(data?.channel?.alternatives[0]?.transcript, {depth: null});
                        });

                    } else {
                        // other messages should be BLOBs
                        // console.log(data);
                        if (deepgramLive.getReadyState() === 1) {
                            // deepgramLive.send(data[0]);
                            // console.log(`Data is sent to DG.`, data);
                            waitBuffer.push(...data);
                        } else {
                            waitBuffer.push(...data);
                        }
                    }
                } catch (e) {
                    console.log(`Yep: `, e);
                }
            });
            // ws.send(JSON.stringify('AID is connected'));

            ws.on('close', () => {
                const out = Buffer.concat(waitBuffer);
                if (deepgramLive.getReadyState() === 1) {
                    deepgramLive.send(out);
                    //deepgramLive.finish();
                }
                console.log(`Buffer length to save n file: ${out.length}`);
                fs.writeFileSync('/home/alex/work/pwa-aid-mob/tmp/tmp.ogg', out);
            });
        }


    }
}

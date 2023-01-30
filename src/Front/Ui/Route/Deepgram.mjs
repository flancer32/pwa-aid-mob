/**
 * Screen to test Deepgram Speech-To-Text.
 *
 * @namespace Aid_Mob_Front_Ui_Route_Deepgram
 */
// MODULE'S VARS
const NS = 'Aid_Mob_Front_Ui_Route_Deepgram';
const REF_CONFIG = 'config';
const API_LISTEN = 'https://api.deepgram.com/v1/listen';
const WS_LISTEN = 'wss://api.deepgram.com/v1/listen';
const FILE = 'https://aid.dev.wiredgeese.com/download/test.ogg';
const Q_PARAMS = 'encoding=ogg-opus&sample_rate=48000&interim_results=true&punctuate=true&model=general&language=ru&tier=base';
// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Aid_Mob_Front_Ui_Route_Deepgram.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Aid_Mob_Front_Defaults} */
    const DEF = spec['Aid_Mob_Front_Defaults$'];
    /** @type {Aid_Mob_Front_Mod_Api_Deepgram} */
    const modDg = spec['Aid_Mob_Front_Mod_Api_Deepgram$'];
    /** @type {Aid_Mob_Front_Ui_Route_Deepgram_A_Config.vueCompTmpl} */
    const uiConfig = spec['Aid_Mob_Front_Ui_Route_Deepgram_A_Config$'];

    // VARS
    const template = `
<layout-main>
    <ui-config ref="${REF_CONFIG}" @onOk="doConfigOk"/>

    <template v-if="!ifAudio">
        <q-card-section style="text-align: center;">
            <div>Media is not supported here.</div>
        </q-card-section>
    </template>

    <template v-if="ifAudio">
        <q-card-actions align="center">
            <q-btn label="Rec" v-on:click="onRec" :disable="ifActive" color="primary" icon="mic"/>
            <q-btn label="Stop" v-on:click="onStop" :disable="!ifActive" color="primary" icon="mic_off"/>
            <q-btn label="Config" v-on:click="onCfg" color="primary" icon="settings"/>
        </q-card-actions>
        
        <q-card-section style="text-align: center;">
            <div>{{text}}</div>
        </q-card-section>
        
    </template>
</layout-main>
`;

    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Aid_Mob_Front_Ui_Route_Deepgram
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {uiConfig},
        data() {
            return {
                ifActive: false,
                ifAudio: true, // 'true' if Media is supported in the browser
                mediaRecorder: MediaRecorder,
                text: null,
            };
        },
        methods: {
            async doConfigOk(key) {
                await modDg.setApiKey(key);
            },
            async onAuth() {
                const token = modDg.getApiKey();
                const data = {url: FILE};
                const url = `${API_LISTEN}?${Q_PARAMS}`
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`,
                    },
                    body: JSON.stringify(data)
                });
                const res = await response.json();
                console.log(JSON.stringify(res));
                return res;
            },
            async onCfg() {
                const key = modDg.getApiKey();
                /** @type {Aid_Mob_Front_Ui_Route_Deepgram_A_Config.IUi} */
                const ui = this.$refs[REF_CONFIG];
                ui.show(key);
            },
            async onRec() {
                // VARS
                /** @type {WebSocket} */
                let socket;

                // FUNCS
                function openSocket() {
                    try {
                        // const url = `${WS_LISTEN}?${Q_PARAMS}`;
                        const url = `${WS_LISTEN}`;
                        socket = new WebSocket(url, [], {
                            headers: {
                                Authorization: `'Token ${modDg.getApiKey()}`,
                            }
                        });
                        socket.addEventListener('open', (event) => {
                            console.log('Socket opened!');
                            // const auth = {
                            //     headers: {
                            //         Authorization: `'Token ${modDg.getApiKey()}`,
                            //     }
                            // };
                            // socket.send(JSON.stringify(auth));
                            setTimeout(() => {
                                socket.send(JSON.stringify({
                                    "type": "CloseStream"
                                }));
                            }, 500);

                        });

                        socket.addEventListener('error', (event) => {
                            console.log('WebSocket error: ', event);
                        });
                        socket.addEventListener('close', (event) => {
                            console.log('Socket closed.');
                        });

                        socket.addEventListener('message', (event) => {
                            const m = JSON.parse(event.data)
                            // Log the received message.
                            console.log(m)

                            // Log just the words from the received message.
                            if (m.hasOwnProperty('channel')) {
                                let words = m.channel.alternatives[0].words
                                console.log(words)
                            }
                        });
                    } catch (e) {
                        console.log(e);
                    }
                }

                function test() {
                    debugger
                    try {
                        const socket = self.io(WS_LISTEN, {
                            extraHeaders: {
                                'Authorization': 'Token e80369b4981b817ee24b16eb46a9007f6661658b'
                            }
                        });

                        socket.on("connect", () => {
                            debugger

                            setTimeout(() => {
                                socket.disconnect();
                            }, 500);
                        });
                        socket.on("data", () => {
                            debugger
                        });

                        debugger
                    } catch (e) {
                        debugger
                    }
                }

                // MAIN
                try {
                    // open audio stream and init recorder
                    const constraints = {audio: true};
                    /** @type {MediaStream} */
                    const stream = await navigator.mediaDevices.getUserMedia(constraints);
                    this.ifActive = true;
                    const recorder = new MediaRecorder(stream);
                    const chunks = [];

                    // collect audio data
                    recorder.addEventListener('dataavailable', (e) => {
                        chunks.push(e.data);
                        console.log(`Data added!!`);
                    });


                    recorder.addEventListener('stop', (e) => {
                        // convert chunks to one Blob and get URL for this Blob
                        // const blob = new Blob(chunks, {type: "audio/ogg; codecs=opus"});
                        // this.audioUrl = URL.createObjectURL(blob);
                    });

                    // save recorder to UiComponent and start recording
                    const timeSlice = 250; // milliseconds
                    this.mediaRecorder = recorder;
                    this.mediaRecorder.start(timeSlice);
                    // openSocket();
                    test();
                } catch (e) {
                    console.error(`The following error occurred: ${e}`);
                }
            },
            onStop() {
                this.ifActive = false;
                if (typeof this.mediaRecorder?.stop === 'function') this.mediaRecorder.stop();
                // close audio stream
                const tracks = this.mediaRecorder?.stream.getTracks() ?? [];
                tracks.forEach((track) => track.stop());
            },
        },
        async created() {
            this.ifAudio = !!navigator.mediaDevices;
            await modDg.loadConfig();
        },
    };
}

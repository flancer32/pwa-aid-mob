/**
 * Screen to test Google Dialogflow.
 *
 * @namespace Aid_Mob_Front_Ui_Route_Dialogflow
 */
// MODULE'S VARS
const NS = 'Aid_Mob_Front_Ui_Route_Dialogflow';
const ATTR_RECORDER = 'recorder'; // media recorder
const ATTR_SOCKET = 'socket'; // web socket to backend
const ATTRS = '_ATTRS'; // custom attributes container for an instance
const CSS_OUTPUT = 'resultOutput';
const REF_CONFIG = 'config';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Aid_Mob_Front_Ui_Route_Dialogflow.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Aid_Mob_Front_Defaults} */
    const DEF = spec['Aid_Mob_Front_Defaults$'];
    /** @type {Aid_Mob_Front_Mod_Api_Dialogflow} */
    const modGdf = spec['Aid_Mob_Front_Mod_Api_Dialogflow$'];
    /** @type {Aid_Mob_Shared_Dto_Start_Dialogflow} */
    const dtoStart = spec['Aid_Mob_Shared_Dto_Start_Dialogflow$'];
    /** @type {Aid_Mob_Front_Ui_Route_Dialogflow_A_Config.vueCompTmpl} */
    const uiConfig = spec['Aid_Mob_Front_Ui_Route_Dialogflow_A_Config$'];

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

        <q-card-section style="text-align: center;">
            <div>Press "Start Session" to begin <a href="https://cloud.google.com/dialogflow/es/docs/how/detect-intent-stream">room
                booking</a> dialog. English is the only language available for this demo.</div>
        </q-card-section>

        <q-card-actions align="center">
            <q-btn label="Start Session" v-on:click="onStart" v-if="!ifActive" color="primary"/>
            <q-btn label="Stop Session" v-on:click="onStop" v-if="ifActive" color="primary"/>
        </q-card-actions>

        <template v-if="ifActive">

            <q-card-section style="text-align: center;">
                <div>Press 'Record' button to start recording. Press 'Send' button to stop recording and to send audio data
                 to Dialogflow.
                </div>
            </q-card-section>

            <q-card-actions align="center">
                <q-btn label="Record Audio" v-on:click="onRec" v-if="!ifRecordOn" color="primary"/>
                <q-btn label="Send Audio" v-on:click="onSend" v-if="ifRecordOn" color="primary"/>
            </q-card-actions>
            
            <q-inner-loading :showing="ifLoading">
                <q-spinner-gears size="50px" color="${DEF.COLOR_Q_PRIMARY}"/>
            </q-inner-loading>             
        </template>

        <q-card-section style="text-align: center;">
            <div id="${CSS_OUTPUT}"></div>
        </q-card-section>

    </template>
</layout-main>
`;

    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Aid_Mob_Front_Ui_Route_Dialogflow
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
                ifLoading: false,
                ifRecordOn: false,
                text: null,
            };
        },
        methods: {
            async doConfigOk(key) {
                await modGdf.set(key);
            },
            async onCfg() {
                const key = modGdf.getApiKey();
                /** @type {Aid_Mob_Front_Ui_Route_Dialogflow_A_Config.IUi} */
                const ui = this.$refs[REF_CONFIG];
                ui.show(key);
            },
            async onRec() {
                try {
                    // open audio stream and init recorder
                    const constraints = {audio: true};
                    /** @type {MediaStream} */
                    const stream = await navigator.mediaDevices.getUserMedia(constraints);
                    this.ifRecordOn = true;
                    const recorder = new MediaRecorder(stream);
                    const uiInst = this;

                    // collect audio data
                    recorder.addEventListener('dataavailable', (e) => {
                        console.log(`Audio data is available.`);
                        /** @type {WebSocket} */
                        const socket = uiInst[ATTRS][ATTR_SOCKET];
                        if (socket?.readyState && (socket?.readyState === socket?.OPEN)) socket.send(e.data);
                    });

                    recorder.addEventListener('stop', () => {
                        console.log(`Audio is stopped.`);
                    });

                    // save recorder to UiComponent and start recording
                    this[ATTRS][ATTR_RECORDER] = recorder;
                    // const timeSlice = 250; // milliseconds
                    recorder.start();
                } catch (e) {
                    console.error(`The following error is occurred:`, e);
                }
            },
            async onSend() {
                await this.stopRecording();
                /** @type {WebSocket} */
                const socket = this[ATTRS][ATTR_SOCKET];
                if (socket?.readyState && (socket?.readyState === socket?.OPEN)) {
                    // socket?.send(binary);
                    socket?.send(JSON.stringify({state: 'stop'}));
                    console.log(`Audio is sent to the back.`);
                    this.ifLoading = true;
                } else console.error(`Backend web socket is not ready. Cannot send audio to backend.`);
            },
            async onStart() {
                // VARS
                /** @type {WebSocket} */
                let socket;
                const uiInst = this;

                // FUNCS
                /**
                 * Open socket to backend.
                 * @returns {Promise<WebSocket>}
                 */
                async function openSocket() {
                    return new Promise((resolve, reject) => {
                        try {
                            const hostname = location.hostname;
                            const space = DEF.SHARED.SPACE_WS;
                            const route = DEF.SHARED.WS_GDF_LIVE;
                            const url = `wss://${hostname}/${space}/${route}`;
                            const sock = new WebSocket(url);
                            sock.addEventListener('open', () => {
                                console.log(`WebSocket is opened: ${url}`);
                                resolve(sock);
                            });
                            sock.addEventListener('error', (event) => {
                                console.log('WebSocket error: ', event);
                            });
                            sock.addEventListener('close', () => {
                                console.log('WebSocket is closed.');
                                uiInst.onStop();
                            });
                            sock.addEventListener('message', (event) => {
                                const m = JSON.parse(event.data)
                                console.log('WebSocket has a message:', m);
                                if (m) {
                                    const elDisplay = document.querySelector(`#${CSS_OUTPUT}`);
                                    const elUser = document.createElement('div');
                                    elUser.innerText = `${m?.user}`;
                                    elUser.className = 'dialogUser';
                                    elDisplay.appendChild(elUser);
                                    const elBot = document.createElement('div');
                                    elBot.innerText = `${m?.bot}`;
                                    elBot.className = 'dialogBot';
                                    elDisplay.appendChild(elBot);
                                }
                                uiInst.ifLoading = false;
                            });
                        } catch (e) {
                            console.log(`Error in web socket.`.e);
                            reject();
                        }
                    });
                }

                // MAIN
                try {
                    this.resetUi();
                    // open web socket and send data to open session
                    this.ifActive = true;
                    socket = await openSocket();
                    this[ATTRS][ATTR_SOCKET] = socket;
                    if (socket?.readyState === socket.OPEN) {
                        const dto = dtoStart.createDto();
                        dto.lang = 'en-US';
                        dto.projectId = DEF.DATA_GDF_PRJ_ID;
                        socket.send(JSON.stringify(dto));
                    }
                } catch (e) {
                    console.error(`The following error is occurred:`, e);
                }
            },
            async onStop() {
                this.ifActive = false;
                await this.stopRecording();
                /** @type {WebSocket} */
                const socket = this[ATTRS][ATTR_SOCKET];
                socket?.close();
                this.resetUi();
            },
            resetUi() {
                const elDisplay = document.querySelector(`#${CSS_OUTPUT}`);
                elDisplay.innerHTML = '';
            },
            async stopRecording() {
                this.ifRecordOn = false;
                return new Promise((resolve) => {
                    /** @type {MediaRecorder} */
                    const recorder = this[ATTRS][ATTR_RECORDER];
                    // close audio stream
                    const tracks = recorder?.stream?.getTracks() ?? [];
                    tracks.forEach((track) => track.stop());
                    if (
                        (typeof recorder?.stop === 'function') &&
                        (recorder?.state !== 'inactive')
                    ) {
                        recorder.addEventListener('stop', resolve);
                        recorder.stop();
                    } else resolve();

                });
            },
        },
        async created() {
            this.ifAudio = !!navigator.mediaDevices;
            await modGdf.loadConfig();
            // add not reactive attributes to this instance
            this[ATTRS] = {};
            this[ATTRS][ATTR_RECORDER] = null;
            this[ATTRS][ATTR_SOCKET] = null;
        },
    };
}

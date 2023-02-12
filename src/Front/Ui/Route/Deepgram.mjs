/**
 * Screen to test Deepgram Speech-To-Text.
 *
 * @namespace Aid_Mob_Front_Ui_Route_Deepgram
 */
// MODULE'S VARS
const NS = 'Aid_Mob_Front_Ui_Route_Deepgram';
const REF_CONFIG = 'config';

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
    /** @type {Aid_Mob_Shared_Dto_Start_Deepgram} */
    const dtoStart = spec['Aid_Mob_Shared_Dto_Start_Deepgram$'];
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
        <q-card-section style="text-align: center;">
            <div><a href="https://deepgram.com/">Deepgram Demo</a></div>
            <div v-if="!ifConfigured">Please, set Deepgram API key in config.</div>
        </q-card-section>
    
        <q-card-actions align="center">
            <q-btn label="Rec" v-on:click="onRec" :disable="ifDisableRec" color="primary" icon="mic"/>
            <q-btn label="Stop" v-on:click="onStop" :disable="!ifRecordOn" color="primary" icon="mic_off"/>
            <q-btn label="Config" v-on:click="onCfg" color="primary" icon="settings"/>
        </q-card-actions>
        
        <q-card-section style="text-align: center;">
            <pre>{{text}}</pre>
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
                ifAudio: true, // 'true' if Media is supported in the browser
                ifConfigured: false,
                ifRecordOn: false,
                mediaRecorder: MediaRecorder,
                text: null,
            };
        },
        computed: {
            ifDisableRec() {
                return !this.ifConfigured || this.ifRecordOn;
            },
            ifDisableStop() {},
        },
        methods: {
            async doConfigOk(key, lang) {
                await modDg.set(key, lang);
                this.ifConfigured = (modDg.getApiKey().length > 0);
            },
            async onCfg() {
                const key = modDg.getApiKey();
                const lang = modDg.getLang();
                /** @type {Aid_Mob_Front_Ui_Route_Deepgram_A_Config.IUi} */
                const ui = this.$refs[REF_CONFIG];
                ui.show(key, lang);
            },
            async onRec() {
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
                            const route = DEF.SHARED.WS_DG_LIVE;
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
                                if (m) uiInst.text += `${m}\n`;
                            });
                        } catch (e) {
                            console.log(`Error in web socket.`.e);
                            reject();
                        }
                    });
                }

                // MAIN
                try {

                    uiInst.text = '';
                    // open web socket
                    socket = await openSocket();
                    if (socket.readyState === socket.OPEN) {
                        const dto = dtoStart.createDto();
                        dto.apiKey = modDg.getApiKey();
                        dto.lang = modDg.getLang() ?? DEF.DATA_LANG;
                        socket.send(JSON.stringify(dto));
                    }

                    // open audio stream and init recorder
                    const constraints = {audio: true};
                    /** @type {MediaStream} */
                    const stream = await navigator.mediaDevices.getUserMedia(constraints);
                    this.ifRecordOn = true;
                    const recorder = new MediaRecorder(stream);

                    // collect audio data
                    recorder.addEventListener('dataavailable', (e) => {
                        console.log(`Media data available.`);
                        //chunks.push(e.data);
                        if (socket.readyState === socket.OPEN) socket.send(e.data);
                    });


                    recorder.addEventListener('stop', () => {
                        // convert chunks to one Blob and get URL for this Blob
                        // const blob = new Blob(chunks, {type: "audio/ogg; codecs=opus"});
                        // this.audioUrl = URL.createObjectURL(blob);
                        console.log(`Audio is stopped.`);
                        socket.close();
                    });

                    // save recorder to UiComponent and start recording
                    const timeSlice = 250; // milliseconds
                    this.mediaRecorder = recorder;
                    this.mediaRecorder.start(timeSlice);
                } catch (e) {
                    console.error(`The following error occurred: ${e}`);
                }
            },
            onStop() {
                this.ifRecordOn = false;
                if (
                    (typeof this.mediaRecorder?.stop === 'function') &&
                    (this.mediaRecorder?.state !== 'inactive')
                ) this.mediaRecorder.stop();
                // close audio stream
                const tracks = this.mediaRecorder?.stream?.getTracks() ?? [];
                tracks.forEach((track) => track.stop());
            },
            resetUi() {
                this.text = '';
            },
        },
        async created() {
            this.ifAudio = !!navigator.mediaDevices;
            await modDg.loadConfig();
            this.ifConfigured = (modDg.getApiKey().length > 0);
        },
    };
}

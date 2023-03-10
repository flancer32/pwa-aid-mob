/**
 * Screen to test Deepgram Speech-To-Text.
 *
 * @namespace Aid_Mob_Front_Ui_Route_Deepgram
 */
// MODULE'S VARS
const NS = 'Aid_Mob_Front_Ui_Route_Deepgram';
const REF_CONFIG = 'config';
const REF_RESP = 'resp';
const TIME_SLICE_MS = 250;

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Aid_Mob_Front_Ui_Route_Deepgram.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Aid_Mob_Front_Defaults} */
    const DEF = spec['Aid_Mob_Front_Defaults$'];
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
    /** @type {Aid_Mob_Front_Mod_Api_Deepgram} */
    const modDg = spec['Aid_Mob_Front_Mod_Api_Deepgram$'];
    /** @type {Aid_Mob_Shared_Dto_Deepgram_Cfg} */
    const dtoStart = spec['Aid_Mob_Shared_Dto_Deepgram_Cfg$'];
    /** @type {Aid_Mob_Shared_Dto_Deepgram_Command} */
    const dtoCmd = spec['Aid_Mob_Shared_Dto_Deepgram_Command$'];
    /** @type {Aid_Mob_Front_Ui_Route_Deepgram_A_Config.vueCompTmpl} */
    const uiConfig = spec['Aid_Mob_Front_Ui_Route_Deepgram_A_Config$'];
    /** @type {Aid_Mob_Front_Ui_Route_Deepgram_A_DgResp.vueCompTmpl} */
    const uiResp = spec['Aid_Mob_Front_Ui_Route_Deepgram_A_DgResp$'];
    /** @type {Aid_Mob_Front_Ui_Route_Deepgram_A_Line.vueCompTmpl} */
    const uiLine = spec['Aid_Mob_Front_Ui_Route_Deepgram_A_Line$'];
    /** @type {typeof Aid_Mob_Shared_Dto_Deepgram_Command.Name} */
    const COMMAND = spec['Aid_Mob_Shared_Dto_Deepgram_Command.Name$'];

    // VARS
    logger.setNamespace(NS);
    const template = `
<layout-main>
    <ui-config ref="${REF_CONFIG}" @onOk="doConfigOk"/>
    <ui-resp ref="${REF_RESP}" />

    <template v-if="!ifAudio">
        <q-card-section style="text-align: center;">
            <div>Media is not supported here.</div>
        </q-card-section>
    </template>

    <template v-if="ifAudio">
        <q-card-section style="text-align: center;">
            <div><a href="https://deepgram.com/">Deepgram Live Demo</a></div>
            <div v-if="!ifConfigured">Please, set Deepgram API key in config.</div>
            <div>current language: {{lang}}</div>
        </q-card-section>
    
        <q-card-actions align="center">
            <q-btn label="Rec" v-on:click="onRec" :disable="ifDisableRec" :color="colorRec" icon="mic"/>
            <q-btn label="Stop" v-on:click="onStop" :disable="!ifRecordOn" :color="colorStop" icon="mic_off"/>
            <q-btn label="Config" v-on:click="onCfg" color="primary" icon="settings"/>
        </q-card-actions>
        
        <q-card-section style="text-align: center;">
            <ui-line v-for="item in items" :item="item" @onDisplayLine="doDisplayLine"></ui-line>
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
        components: {uiConfig, uiLine, uiResp},
        data() {
            return {
                ifAudio: true, // 'true' if Media is supported in the browser
                ifConfigured: false,
                ifRecordOn: false,
                items: [],
                lang: null,
                /** @type {MediaRecorder} */
                mediaRecorder: null,
            };
        },
        computed: {
            colorRec() {
                // TODO: use it or remove it
                return (this.ifRecordOn) ? 'primary' : 'primary';
            },
            colorStop() {
                // TODO: use it or remove it
                return (this.ifRecordOn) ? 'primary' : 'primary';
            },
            ifDisableRec() {
                return !this.ifConfigured || this.ifRecordOn;
            },
        },
        methods: {
            async doConfigOk(key, lang) {
                await modDg.set(key, lang);
                this.lang = modDg.getLang();
                this.ifConfigured = (modDg.getApiKey().length > 0);
            },
            doDisplayLine(proxy) {
                /** @type {Aid_Mob_Front_Ui_Route_Deepgram_A_DgResp.IUi} */
                const ui = this.$refs[REF_RESP];
                ui.show(proxy);
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
                 * Re-send media data (BLOB) to back-end.
                 * @param {BlobEvent} e
                 */
                function onMediaData(e) {
                    if (socket.readyState === socket.OPEN) socket.send(e.data);
                }

                function onMediaStop() {
                    logger.info(`Media is stopped. Send 'STOP' command to back-end.`);
                    // send close command to back-end.
                    const dto = dtoCmd.createDto();
                    dto.name = COMMAND.STOP;
                    socket.send(JSON.stringify(dto));
                }

                /**
                 * Open socket to backend.
                 * @returns {Promise<WebSocket>}
                 */
                async function openSocket() {
                    return new Promise((resolve, reject) => {
                        // VARS
                        const url = composeUrl();
                        /** @type {WebSocket} */
                        let sock;

                        // FUNCS

                        function composeUrl() {
                            const hostname = location.hostname;
                            const space = DEF.SHARED.SPACE_WS;
                            const route = DEF.SHARED.WS_DG_LIVE;
                            const port = ((location.port === '443') || (location.port === ''))
                                ? '' : `:${location.port}`;
                            return `wss://${hostname}${port}/${space}/${route}`;
                        }

                        function onClose() {
                            logger.info('Back-end websocket is closed.');
                            uiInst.onStop();
                        }

                        function onError(evt) {
                            logger.error(`Back-end websocket error:  ${evt}`);
                        }

                        /**
                         * @param {MessageEvent} evt
                         */
                        function onMessage(evt) {
                            const m = JSON.parse(evt.data)
                            logger.info(`DG message from back-end (size: ${evt?.data?.length}).`, m);
                            if (m) uiInst.items.unshift(m);
                        }

                        function onOpen() {
                            logger.info(`Back-end webSocket is opened: ${url}`);
                            const dto = dtoStart.createDto();
                            dto.apiKey = modDg.getApiKey();
                            dto.lang = modDg.getLang() ?? DEF.DATA_LANG;
                            sock.send(JSON.stringify(dto));
                            logger.info(`Deepgram configuration options are sent to back. Lang: ${dto.lang}.`);
                            resolve(sock);
                        }

                        // MAIN
                        try {
                            sock = new WebSocket(url);
                            sock.addEventListener('open', onOpen);
                            sock.addEventListener('error', onError);
                            sock.addEventListener('close', onClose);
                            sock.addEventListener('message', onMessage);
                        } catch (e) {
                            logger.error(`Error in back-end websocket opening: ${e?.message ?? e}`);
                            reject();
                        }
                    });
                }

                // MAIN
                try {
                    uiInst.items.length = 0;
                    // open web socket
                    socket = await openSocket();
                    // ... then open audio stream
                    const constraints = {audio: true};
                    /** @type {MediaStream} */
                    const stream = await navigator.mediaDevices.getUserMedia(constraints);
                    // ... then init recorder
                    this.ifRecordOn = true;
                    const recorder = new MediaRecorder(stream);
                    recorder.addEventListener('dataavailable', onMediaData);
                    recorder.addEventListener('stop', onMediaStop);
                    recorder.start(TIME_SLICE_MS);
                    // save recorder to UiComponent and start recording
                    this.mediaRecorder = recorder;
                    logger.info(`Media recorder is started. Time slice: ${TIME_SLICE_MS} ms.`);
                } catch (e) {
                    logger.error(`Cannot start recording. Error: ${e?.message ?? e}`);
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
        },
        async created() {
            this.ifAudio = !!navigator.mediaDevices;
            await modDg.loadConfig();
            this.lang = modDg.getLang();
            this.ifConfigured = (modDg.getApiKey()?.length > 0);
            if (!this.ifConfigured)
                logger.info(`Deepgram API key is not set yet.`);
        },
        mounted() {
            document.title = 'Deepgram';
        },
    };
}

/**
 * Screen to transcript audio/video files with Deepgram.
 *
 * @namespace Aid_Mob_Front_Ui_Route_Deepgram_File
 */
// MODULE'S VARS
const NS = 'Aid_Mob_Front_Ui_Route_Deepgram_File';
const ID_UPLOAD = 'uploadFile';
const REF_CONFIG = 'config';

// MODULE'S FUNCTIONS
/**
 * Format times in Deepgram data.
 * @param {string} start
 * @param {string} end
 * @return {string}
 */
function formatTime(start, end) {
    // FUNCS
    function formatOne(i, d) {
        const h = `${Math.floor(i / 3600)}`.padStart(2, '0');
        const m = `${Math.floor((i - (h * 3600)) / 60)}`.padStart(2, '0');
        const s = `${(i - (h * 3600) - (m * 60))}`.padStart(2, '0');
        return `${h}:${m}:${s}.${d}`;
    }

    // MAIN
    const [sInt, sDec] = `${start}`.split('.');
    const s = formatOne(sInt, sDec);
    const [eInt, eDec] = `${end}`.split('.');
    const e = formatOne(eInt, eDec);
    return `${s} - ${e}`;
}

/**
 * Merge paragraphs into one text: #\n interval\n text\n\n.
 * @param {Array} paragraphs
 * @return {string}
 */
function formatText(paragraphs) {
    let fragment = 1, res = '';
    for (const pr of paragraphs) {
        const speakerId = pr.speaker;
        const start = pr.start;
        const end = pr.end;
        let bunch = `${fragment++}\n`;
        bunch += `${formatTime(start, end)}\n`;
        bunch += `SPEAKER_${speakerId}:`;
        for (const st of pr?.sentences) {
            bunch += ` ${st?.text}`;
        }
        //
        res += `${bunch}\n\n`;
    }
    return res;
}

/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @param {Aid_Mob_Front_Defaults} DEF
 * @param {Aid_Mob_Front_Mod_Config_Deepgram} modCfg
 * @param {Aid_Mob_Front_Ui_Lib_Config_Deepgram.vueCompTmpl} uiConfig
 * @param {TeqFw_Web_Api_Front_Web_Connect} connApi
 * @param {Aid_Mob_Shared_Web_Api_Deepgram_File} apiFile
 * @returns {Aid_Mob_Front_Ui_Route_Deepgram_File.vueCompTmpl}
 */
export default function (
    {
        ['Aid_Mob_Front_Defaults$']: DEF,
        ['Aid_Mob_Front_Mod_Config_Deepgram$']: modCfg,
        ['Aid_Mob_Front_Ui_Lib_Config_Deepgram$']: uiConfig,
        ['TeqFw_Web_Api_Front_Web_Connect$']: connApi,
        ['Aid_Mob_Shared_Web_Api_Deepgram_File$']: apiFile,
    }
) {
    // VARS
    const template = `
<layout-main>
    <ui-config ref="${REF_CONFIG}" @onOk="doConfigOk"/>
    
    <q-card-section>
        <input id="${ID_UPLOAD}" type="file" tabindex="-1" hidden v-on:change="onFileSelected">
        <div class="row q-gutter-xs">
            <q-input v-model="fldFile"
                     placeholder="Select a file to transcribe..."
                     dense
                     outlined
            />
            <q-btn label="..." color="${DEF.COLOR_Q_PRIMARY}" v-on:click="onFileSelect"/>
        </div>
        <div>{{formatted}}</div>
    </q-card-section>

    <q-card-actions align="center">
        <q-btn label="Transcribe" v-on:click="onTranscribe" color="${DEF.COLOR_Q_PRIMARY}" :disable="!ifCanUpload"/>
        <q-btn label="Config" v-on:click="onConfig" color="${DEF.COLOR_Q_PRIMARY}"/>
    </q-card-actions>
    
    <ui-spinner :loading="ifLoading"/>
</layout-main>
`;
    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Aid_Mob_Front_Ui_Route_Deepgram_File
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {uiConfig},
        data() {
            return {
                bufferB64: null,
                fldFile: null,
                formatted: null,
                ifLoading: false,
            };
        },
        computed: {
            ifCanUpload() {
                return this.bufferB64 !== null;
            },
        },
        methods: {
            onConfig() {
                /** @type {Aid_Mob_Front_Ui_Lib_Config_Deepgram.IUi} */
                const ui = this.$refs[REF_CONFIG];
                ui.show();
            },
            onFileSelect() {
                this.bufferB64 = null;
                this.fldFile = null;
                const elUpload = document.getElementById(ID_UPLOAD);
                elUpload?.click();
            },
            /**
             * Read file contents as Base64.
             * @param {Event} evt
             */
            onFileSelected(evt) {
                /** @type {File} */
                const file = evt.target.files[0];
                this.fldFile = file.name;
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = (evt) => {
                    this.bufferB64 = evt.target.result;
                };
            },
            async onTranscribe() {
                const req = apiFile.createReq();
                req.apiKey = modCfg.getApiKey();
                req.base64 = this.bufferB64;
                req.lang = modCfg.getLang();
                this.ifLoading = true;
                // noinspection JSValidateTypes
                /** @type {Aid_Mob_Shared_Web_Api_Deepgram_File.Response} */
                const res = await connApi.send(req, apiFile);
                const trans = res.transcription;
                const paragraphs = trans?.results?.channels[0]?.alternatives[0]?.paragraphs?.paragraphs ?? [];
                const text = formatText(paragraphs);
                //
                const blob = new Blob([text], {type: 'text/plain'});
                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.download = `${this.fldFile}.txt`;
                downloadLink.click();
                setTimeout(() => {
                    URL.revokeObjectURL(downloadLink.href);
                }, 5000);
                this.ifLoading = false;
            },
        },
        mounted() {
            document.title = 'Deepgram File';
        },
    };
}

/**
 * Screen to transcript audio/video files with Deepgram.
 *
 * @namespace Aid_Mob_Front_Ui_Route_Deepgram_File
 */
// MODULE'S IMPORT
// front version: use absolute path with mapping defined in '/teqfw.json'
import {Deepgram} from "/src/@deepgram/index.js"; // node version: ... from "@deepgram/sdk/browser";

// MODULE'S VARS
const NS = 'Aid_Mob_Front_Ui_Route_Deepgram_File';
const ID_UPLOAD = 'uploadFile';
const REF_CONFIG = 'config';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Aid_Mob_Front_Ui_Route_Deepgram_File.vueCompTmpl}
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
    </q-card-section>

    <q-card-actions align="center">
        <q-btn label="Transcribe" v-on:click="onTranscribe" color="${DEF.COLOR_Q_PRIMARY}" :disable="!ifCanUpload"/>
        <q-btn label="Config" v-on:click="onConfig" color="${DEF.COLOR_Q_PRIMARY}"/>
    </q-card-actions>
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
            };
        },
        computed: {
            ifCanUpload() {
                return this.bufferB64 !== null;
            },
        },
        methods: {
            onConfig() {
                const key = modDg.getApiKey();
                const lang = modDg.getLang();
                /** @type {Aid_Mob_Front_Ui_Route_Deepgram_A_Config.IUi} */
                const ui = this.$refs[REF_CONFIG];
                ui.show(key, lang);
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
                reader.onload = (evt) => {
                    this.bufferB64 = evt.target.result;
                }
            },
            onTranscribe() {
                const apiKey = modDg.getApiKey();
                const deepgram = new Deepgram(apiKey);
                debugger
            },
        },
        async created() {
            await modDg.loadConfig();
        },
        mounted() {
            document.title = 'Deepgram File';
        },
    };
}

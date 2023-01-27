/**
 * Screen to test Deepgram Speech-To-Text.
 *
 * @namespace Aid_Mob_Front_Ui_Route_Deepgram
 */
// MODULE'S VARS
const NS = 'Aid_Mob_Front_Ui_Route_Deepgram';
const REF_CONFIG = 'config';
const API_LISTEN = 'https://api.deepgram.com/v1/listen';
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
    <ui-config ref="${REF_CONFIG}" @onOk="doConfigOk" />
    <q-card>
        <q-card-actions align="center">
            <q-btn label="Cfg" v-on:click="onCfg" />
            <q-btn label="Auth" v-on:click="onAuth" />
        </q-card-actions> 
    </q-card>        
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
            return {};
        },
        methods: {
            async doConfigOk(key) {
                await modDg.setApiKey(key);
            },
            async onAuth() {
                const token = modDg.getApiKey();
                const data = {url: FILE};
                const URL = `${API_LISTEN}?${Q_PARAMS}`
                const response = await fetch(URL, {
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
        },
        async created() {
            await modDg.loadConfig();
        },
    };
}

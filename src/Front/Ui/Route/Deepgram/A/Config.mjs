/**
 * Dialog to configure Deepgram demo.
 *
 * @namespace Aid_Mob_Front_Ui_Route_Deepgram_A_Config
 */
// MODULE'S VARS
const NS = 'Aid_Mob_Front_Ui_Route_Deepgram_A_Config';
const EVT_OK = 'onOk';
const REF_SELF = 'self';

// MODULE'S INTERFACES

// noinspection JSUnusedLocalSymbols
/**
 * @interface
 * @mixin
 * @memberOf Aid_Mob_Front_Ui_Route_Deepgram_A_Config
 */
class IUi {
    /**
     * Hide dialog.
     */
    hide() { }

    /**
     * Set API key.
     * @param {string} key
     * @param {string} lang
     */
    show(key, lang) { }
}


// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Aid_Mob_Front_Ui_Route_Deepgram_A_Config.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Aid_Mob_Front_Defaults} */
    const DEF = spec['Aid_Mob_Front_Defaults$'];

    // VARS
    const template = `
<q-dialog ref="${REF_SELF}">
    <q-card>
        <q-card-section class="column q-col-gutter-md">
            <q-input v-model="fldKey"  
                autofocus
                label="API Key" 
                outlined 
            />
            <q-select v-model="fldLang"
                :options="optsLang"
                emit-value
                label="Language"
                map-options
                outlined
            />            
        </q-card-section>

        <q-card-actions align="center">
            <q-btn label="OK"
                   color="${DEF.COLOR_Q_PRIMARY}"
                   v-on:click="onOk"
            />
        </q-card-actions>
    </q-card>
</q-dialog>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Aid_Mob_Front_Ui_Route_Deepgram_A_Config
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        data() {
            return {
                fldKey: null,
                fldLang: DEF.DATA_LANG,
            };
        },
        computed: {
            optsLang() {
                return [
                    {label: 'en', value: 'en-US'},
                    {label: 'es', value: 'es'},
                    {label: 'ru', value: 'ru'},
                ];
            },
        },
        /**
         * @mixes Aid_Mob_Front_Ui_Route_Deepgram_A_Config.IUi
         */
        methods: {
            hide() {
                const ui = this.$refs[REF_SELF];
                ui.hide();
            },
            onOk() {
                this.hide();
                this.$emit(EVT_OK, this.fldKey, this.fldLang);
            },
            show(key, lang) {
                this.fldKey = key;
                this.fldLang = lang ?? DEF.DATA_LANG;
                const ui = this.$refs[REF_SELF];
                ui.show();
            },
        },
        emits: [EVT_OK],
    };
}

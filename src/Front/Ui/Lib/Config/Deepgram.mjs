/**
 * Dialog to configure Deepgram demo.
 *
 * @namespace Aid_Mob_Front_Ui_Lib_Config_Deepgram
 */
// MODULE'S VARS
const NS = 'Aid_Mob_Front_Ui_Lib_Config_Deepgram';
const EVT_OK = 'onOk';
const REF_SELF = 'self';

// MODULE'S INTERFACES

// noinspection JSUnusedLocalSymbols
/**
 * @interface
 * @mixin
 * @memberOf Aid_Mob_Front_Ui_Lib_Config_Deepgram
 */
class IUi {
    hide() { }

    show() { }
}


// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @param {Aid_Mob_Front_Defaults} DEF
 * @param {Aid_Mob_Front_Mod_Config_Deepgram} modCfg
 * @returns {Aid_Mob_Front_Ui_Lib_Config_Deepgram.vueCompTmpl}
 */
export default function (
    {
        ['Aid_Mob_Front_Defaults$']: DEF,
        ['Aid_Mob_Front_Mod_Config_Deepgram$']: modCfg,
    }
) {
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
     * @memberOf Aid_Mob_Front_Ui_Lib_Config_Deepgram
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
         * @mixes Aid_Mob_Front_Ui_Lib_Config_Deepgram.IUi
         */
        methods: {
            hide() {
                const ui = this.$refs[REF_SELF];
                ui.hide();
            },
            onOk() {
                this.hide();
                modCfg.set(this.fldKey, this.fldLang);
                this.$emit(EVT_OK);
            },
            show() {
                this.fldKey = modCfg.getApiKey();
                this.fldLang = modCfg.getLang();
                const ui = this.$refs[REF_SELF];
                ui.show();
            },
        },
        emits: [EVT_OK],
    };
}

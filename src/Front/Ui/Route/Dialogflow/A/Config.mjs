/**
 * Dialog to configure Dialogflow demo.
 *
 * @namespace Aid_Mob_Front_Ui_Route_Dialogflow_A_Config
 */
// MODULE'S VARS
const NS = 'Aid_Mob_Front_Ui_Route_Dialogflow_A_Config';
const EVT_OK = 'onOk';
const REF_SELF = 'self';

// MODULE'S INTERFACES

// noinspection JSUnusedLocalSymbols
/**
 * @interface
 * @memberOf Aid_Mob_Front_Ui_Route_Dialogflow_A_Config
 */
class IUi {
    /**
     * Hide dialog.
     */
    hide() { }

    /**
     * Set API key.
     * @param {string} key
     */
    show(key) { }
}


// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Aid_Mob_Front_Ui_Route_Dialogflow_A_Config.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Aid_Mob_Front_Defaults} */
    const DEF = spec['Aid_Mob_Front_Defaults$'];

    // VARS
    const template = `
<q-dialog ref="${REF_SELF}">
    <q-card>
        <q-card-section class="column q-col-gutter-md" style="min-width: 200px;">
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
     * @memberOf Aid_Mob_Front_Ui_Route_Dialogflow_A_Config
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        data() {
            return {
                fldLang: DEF.DATA_LANG,
            };
        },
        computed: {
            optsLang() {
                return [
                    {label: 'en', value: 'en-US'},
                    {label: 'es', value: 'es-ES'},
                    {label: 'ru', value: 'ru-RU'},
                ];
            },
        },
        methods: {
            hide() {
                const ui = this.$refs[REF_SELF];
                ui.hide();
            },
            onOk() {
                this.hide();
                this.$emit(EVT_OK, this.fldLang);
            },
            show(key) {
                this.fldKey = key;
                const ui = this.$refs[REF_SELF];
                ui.show();
            },
        },
        emits: [EVT_OK],
    };
}

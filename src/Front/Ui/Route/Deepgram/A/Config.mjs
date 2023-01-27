/**
 * Dialog to configure Deepgram API.
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
     */
    show(key) { }
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
        <q-card-section class="column">
            <q-input v-model="fldKey"  
                autofocus
                label="API Key" 
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
            };
        },
        methods: {
            hide() {
                const ui = this.$refs[REF_SELF];
                ui.hide();
            },
            onOk() {
                this.hide();
                this.$emit(EVT_OK, this.fldKey);
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

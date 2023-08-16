/**
 * Dialog to display response from Deepgram.
 *
 * @namespace Aid_Mob_Front_Ui_Route_Deepgram_A_DgResp
 */
// MODULE'S VARS
const NS = 'Aid_Mob_Front_Ui_Route_Deepgram_A_DgResp';
const EVT_OK = 'onOk';
const REF_SELF = 'self';

// MODULE'S INTERFACES

// noinspection JSUnusedLocalSymbols
/**
 * @interface
 * @mixin
 * @memberOf Aid_Mob_Front_Ui_Route_Deepgram_A_DgResp
 */
class IUi {
    /**
     * Hide dialog.
     */
    hide() { }

    /**
     * Set data to display in dialog and start the show.
     * @param {Object} proxy
     */
    show(proxy) { }
}


// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Aid_Mob_Front_Ui_Route_Deepgram_A_DgResp.vueCompTmpl}
 */
/**
 * @param {Aid_Mob_Front_Defaults} DEF
 */
export default function (
    {
        Aid_Mob_Front_Defaults$: DEF,
    }) {
    // VARS
    const template = `
<q-dialog ref="${REF_SELF}">
    <q-card>
        <q-card-section class="column q-col-gutter-md">
            <pre>{{text}}</pre>          
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
     * @memberOf Aid_Mob_Front_Ui_Route_Deepgram_A_DgResp
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        data() {
            return {
                data: null,
            };
        },
        computed: {
            text() {
                return JSON.stringify(this.data, null, 2);
            },
        },
        /**
         * @mixes Aid_Mob_Front_Ui_Route_Deepgram_A_DgResp.IUi
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
            show(data) {
                this.data = data;
                const ui = this.$refs[REF_SELF];
                ui.show();
            },
        },
        emits: [EVT_OK],
    };
}

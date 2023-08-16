/**
 * UI component to display one line of audio transcription.
 *
 * @namespace Aid_Mob_Front_Ui_Route_Deepgram_A_Line
 */
// MODULE'S VARS
const NS = 'Aid_Mob_Front_Ui_Route_Deepgram_A_Line';
const EVT_DISPLAY_LINE = 'onDisplayLine';
const _formatter = new Intl.NumberFormat('en-US', {style: 'decimal', minimumFractionDigits: 2});

// MODULE'S FUNCTIONS

/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Aid_Mob_Front_Ui_Route_Deepgram_A_Line.vueCompTmpl}
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
<div class="row">
    <div>
        <q-icon name="description" color="primary" class="app-pointer" v-on:click="onClick"/>
    </div>
    <div style="margin: 0 5px 0 5px;">{{uiStart}}</div>
    <div style="margin: 0 5px 0 5px;">{{uiDuration}}</div>
    <div>{{uiTranscript}}</div>
</div>
`;

    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Aid_Mob_Front_Ui_Route_Deepgram_A_Line
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {},
        data() {
            return {};
        },
        props: {
            item: Object,
        },
        computed: {
            uiDuration() {
                return _formatter.format(this.item?.duration ?? 0);
            },
            uiStart() {
                return _formatter.format(this.item?.start ?? 0);
            },
            uiTranscript() {
                return this.item?.channel?.alternatives[0]?.transcript;
            },
        },
        methods: {
            onClick() {
                this.$emit(EVT_DISPLAY_LINE, this.item);
            },
        },
        emits: [EVT_DISPLAY_LINE],
        async created() { },
        mounted() { },
    };
}

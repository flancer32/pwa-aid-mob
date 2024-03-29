/**
 * Screen for application's homepage.
 *
 * @namespace Aid_Mob_Front_Ui_Route_Home
 */
// MODULE'S VARS
const NS = 'Aid_Mob_Front_Ui_Route_Home';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Aid_Mob_Front_Ui_Route_Home.vueCompTmpl}
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
<layout-main>

    <q-card>

        <q-card-section style="text-align: center;">
            <div>Just a demo</div>
            <p v-if="!ifAudio">Media is not supported here.</p>
        </q-card-section>      
        
        <q-card-actions align="center" v-if="ifAudio">
            <q-btn label="Deepgram File" v-on:click="$router.push('${DEF.ROUTE_DEEPGRAM_FILE}')" />
        </q-card-actions>  
    </q-card>    

</layout-main>
`;
    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Aid_Mob_Front_Ui_Route_Home
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {},
        data() {
            return {
                ifAudio: true,
            };
        },
        methods: {},
        created() {
            this.ifAudio = !!navigator.mediaDevices;
        },
        mounted() {
            document.title = 'AI Demo';
        },
    };
}

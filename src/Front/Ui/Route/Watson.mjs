/**
 * Screen to test IBM Watson Speech-To-Text.
 *
 * @namespace Aid_Mob_Front_Ui_Route_Watson
 */
// MODULE'S VARS
const NS = 'Aid_Mob_Front_Ui_Route_Watson';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Aid_Mob_Front_Ui_Route_Watson.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Aid_Mob_Front_Defaults} */
    const DEF = spec['Aid_Mob_Front_Defaults$'];

    // VARS
    const template = `
<layout-main>
    <q-card>
        <q-card-actions align="center">
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
     * @memberOf Aid_Mob_Front_Ui_Route_Watson
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {},
        data() {
            return {};
        },
        methods: {
            async onAuth() {

            },
        },
        created() {
        },
    };
}

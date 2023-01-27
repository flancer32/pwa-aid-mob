/**
 * Navigator pane.
 *
 * @namespace Aid_Mob_Front_Ui_Layout_Main_Menu
 */
// MODULE'S VARS
const NS = 'Aid_Mob_Front_Ui_Layout_Main_Menu';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Aid_Mob_Front_Ui_Layout_Main_Menu.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Aid_Mob_Front_Defaults} */
    const DEF = spec['Aid_Mob_Front_Defaults$'];

    // VARS
    const template = `
<q-scroll-area class="fit">
    <div class="q-pa-sm">
        <q-list separator>
            <q-item active-class="active" to="${DEF.ROUTE_HOME}">
                <q-item-section>Home</q-item-section>
            </q-item>
            <q-item active-class="active" to="${DEF.ROUTE_RECORD}">
                <q-item-section>Record</q-item-section>
            </q-item>
            <q-item active-class="active" to="${DEF.ROUTE_CRED}">
                <q-item-section>Credentials</q-item-section>
            </q-item>
            <q-item active-class="active" to="${DEF.ROUTE_DEEPGRAM}">
                <q-item-section>Deepgram</q-item-section>
            </q-item>
        </q-list>
    </div>
</q-scroll-area>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Aid_Mob_Front_Ui_Layout_Main_Menu
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
    };
}

/**
 * Main layout with navigator.
 *
 * @namespace Aid_Mob_Front_Ui_Layout_Main
 */
// MODULE'S VARS
const NS = 'Aid_Mob_Front_Ui_Layout_Main';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Aid_Mob_Front_Ui_Layout_Main.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Aid_Mob_Front_Defaults} */
    const DEF = spec['Aid_Mob_Front_Defaults$'];
    /** @type {Aid_Mob_Front_Ui_Layout_Main_Menu.vueCompTmpl} */
    const uiMenu = spec['Aid_Mob_Front_Ui_Layout_Main_Menu$'];

    // VARS
    const template = `
<q-layout view="hhh lpR fff" class="">
    <q-header reveal id="layout-header">
        <q-toolbar>
            <q-toolbar-title>
                <span class="app-pointer" v-on:click="$router.push('${DEF.ROUTE_HOME}')">AI Demo</span>
            </q-toolbar-title>
            <menu-top/>
            <q-btn id="btn-menu" flat @click="drawerRight = !drawerRight" round dense icon="menu"/>
        </q-toolbar>

        <q-drawer v-model="drawerRight" id="layout-right"
                  behavior="desktop"
                  overlay
                  side="right"
                  width="200"
        >
            <ui-menu/>
        </q-drawer>        
    </q-header>
    
    <q-page-container>
        <q-page id="layout-main" class="q-pa-md" style="display: grid; grid-template-columns: 1fr; justify-items: center;">
            <div>
                <slot/>
            </div>
        </q-page>

        <q-page-scroller position="bottom">
            <q-btn fab icon="keyboard_arrow_up" color="red" />
        </q-page-scroller>
    </q-page-container>
        
</q-layout>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Aid_Mob_Front_Ui_Layout_Main
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {uiMenu},
        data() {
            return {
                drawerRight: false,
            }
        },
    };
}

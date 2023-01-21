/**
 * Blank layout with centered content.
 *
 * @namespace Aid_Mob_Front_Ui_Layout_Center
 */
// MODULE'S VARS
const NS = 'Aid_Mob_Front_Ui_Layout_Center';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Aid_Mob_Front_Ui_Layout_Center.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Aid_Mob_Front_Defaults} */
    const DEF = spec['Aid_Mob_Front_Defaults$'];

    // VARS
    const template = `
<q-layout view="hHh lpr fFf" style="display: grid; grid-template-columns: 1fr; justify-items: center; align-items: center;">
    <slot/>
</q-layout>
`;
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Aid_Mob_Front_Ui_Layout_Center
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
    };
}

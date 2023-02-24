/**
 * Plugin constants (hardcoded configuration) for backend code.
 */
export default class Aid_Mob_Back_Defaults {

    /** @type {TeqFw_Web_Back_Defaults} */
    MOD_WEB;

    /** @type {Aid_Mob_Shared_Defaults} */
    SHARED;

    constructor(spec) {
        this.MOD_WEB = spec['TeqFw_Web_Back_Defaults$'];
        this.SHARED = spec['Aid_Mob_Shared_Defaults$'];
        Object.freeze(this);
    }
}

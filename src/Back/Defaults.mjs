/**
 * Plugin constants (hardcoded configuration) for backend code.
 */
export default class Aid_Mob_Back_Defaults {

    /** @type {Aid_Mob_Shared_Defaults} */
    SHARED;

    constructor(spec) {
        this.SHARED = spec['Aid_Mob_Shared_Defaults$'];
        Object.freeze(this);
    }
}

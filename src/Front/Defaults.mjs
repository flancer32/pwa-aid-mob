/**
 * Plugin constants (hardcoded configuration) for frontend code.
 */
export default class Aid_Mob_Front_Defaults {

    ROUTE_HOME = '/';
    
    /** @type {Aid_Mob_Shared_Defaults} */
    SHARED;
    
    constructor(spec) {
        this.SHARED = spec['Aid_Mob_Shared_Defaults$'];
        Object.freeze(this);
    }
}

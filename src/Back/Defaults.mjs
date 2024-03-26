/**
 * Plugin constants (hardcoded configuration) for backend code.
 */
export default class Aid_Mob_Back_Defaults {

    CLI_PREFIX = 'app';

    /** @type {TeqFw_Web_Back_Defaults} */
    MOD_WEB;

    /** @type {Aid_Mob_Shared_Defaults} */
    SHARED;

    constructor(
        {
            TeqFw_Web_Back_Defaults$: MOD_WEB,
            Aid_Mob_Shared_Defaults$: SHARED
        }
    ) {
        this.MOD_WEB = MOD_WEB;
        this.SHARED = SHARED;
        Object.freeze(this);
    }
}

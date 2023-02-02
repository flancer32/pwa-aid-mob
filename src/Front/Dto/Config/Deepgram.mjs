/**
 * Configuration DTO for Deepgram API.
 */
// MODULE'S VARS
const NS = 'Aid_Mob_Front_Dto_Config_Deepgram';

// MODULE'S CLASSES
/**
 * @memberOf Aid_Mob_Front_Dto_Config_Deepgram
 */
class Dto {
    static namespace = NS;
    /**
     * API key
     * @type {string}
     */
    key;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Aid_Mob_Front_Dto_Config_Deepgram {

    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {Aid_Mob_Front_Dto_Config_Deepgram.Dto} [data]
         * @return {Aid_Mob_Front_Dto_Config_Deepgram.Dto}
         */
        this.createDto = function (data) {
            // create new DTO and populate it with initialization data
            const res = Object.assign(new Dto(), data);
            // cast known attributes
            res.key = castString(data?.key);
            return res;
        }
    }
}

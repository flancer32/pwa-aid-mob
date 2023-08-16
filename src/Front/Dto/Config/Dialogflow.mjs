/**
 * Configuration DTO for Dialogflow API.
 */
// MODULE'S VARS
const NS = 'Aid_Mob_Front_Dto_Config_Dialogflow';

// MODULE'S CLASSES
/**
 * @memberOf Aid_Mob_Front_Dto_Config_Dialogflow
 */
class Dto {
    static namespace = NS;
    /** @type {string} */
    lang;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Aid_Mob_Front_Dto_Config_Dialogflow {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast.castString|function} castString
     */

    constructor(
        {
            ['TeqFw_Core_Shared_Util_Cast.castString']: castString,
        }) {
        // INSTANCE METHODS
        /**
         * @param {Aid_Mob_Front_Dto_Config_Dialogflow.Dto} [data]
         * @return {Aid_Mob_Front_Dto_Config_Dialogflow.Dto}
         */
        this.createDto = function (data) {
            // create new DTO and populate it with initialization data
            const res = Object.assign(new Dto(), data);
            // cast known attributes
            res.lang = castString(data?.lang);
            return res;
        }
    }
}

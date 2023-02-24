/**
 * Log item DTO to transfer data between back and front.
 * @see Fl64_Log_Agg_Shared_Dto_Log
 * TODO: move this DTO into separate log plugin to use in logs aggregator
 */
// MODULE'S VARS
const NS = 'Aid_Mob_Shared_Dto_Log';

// MODULE'S CLASSES
/**
 * @memberOf Aid_Mob_Shared_Dto_Log
 */
class Dto {
    static namespace = NS;
    /** @type {Date} */
    date;
    /** @type {number} */
    level;
    /** @type {string} */
    message;
    /**
     * Other metadata for the log entry.
     * @type {Object}
     */
    meta;
    /**
     * Namespace for source of the log entry.
     * @type {string}
     */
    source;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Aid_Mob_Shared_Dto_Log {

    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {Aid_Mob_Shared_Dto_Log.Dto} data
         * @return {Aid_Mob_Shared_Dto_Log.Dto}
         */
        this.createDto = function (data = null) {
            // create new DTO
            const res = new Dto();
            // cast known attributes
            res.date = castDate(data?.date);
            res.level = castInt(data?.level);
            res.message = castString(data?.message);
            res.meta = structuredClone(data?.meta);
            res.source = castString(data?.source);
            return res;
        }
    }

}
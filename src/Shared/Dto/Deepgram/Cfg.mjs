/**
 * DTO for configuration options sent from front-end to back-end to start Datagram transcriptions.
 */
// MODULE'S VARS
const NS = 'Aid_Mob_Shared_Dto_Deepgram_Cfg';

// MODULE'S CLASSES
/**
 * @memberOf Aid_Mob_Shared_Dto_Deepgram_Cfg
 */
class Dto {
    static namespace = NS;
    /** @type {string} */
    apiKey;
    /** @type {string} */
    lang;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Aid_Mob_Shared_Dto_Deepgram_Cfg {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast.castString|function} castString
     */
    constructor(
        {
            ['TeqFw_Core_Shared_Util_Cast.castString']: castString,
        }) {
        /**
         * @param {Aid_Mob_Shared_Dto_Deepgram_Cfg.Dto} [data]
         * @return {Aid_Mob_Shared_Dto_Deepgram_Cfg.Dto}
         */
        this.createDto = function (data) {
            // create new DTO
            const res = new Dto();
            // cast known attributes
            res.apiKey = castString(data?.apiKey);
            res.lang = castString(data?.lang);
            return res;
        }
    }
}

/**
 * DTO for startup data for Datagram transcriptions.
 */
// MODULE'S VARS
const NS = 'Aid_Mob_Shared_Dto_Start_Deepgram';

// MODULE'S CLASSES
/**
 * @memberOf Aid_Mob_Shared_Dto_Start_Deepgram
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
export default class Aid_Mob_Shared_Dto_Start_Deepgram {
    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        /**
         * @param {Aid_Mob_Shared_Dto_Start_Deepgram.Dto} [data]
         * @return {Aid_Mob_Shared_Dto_Start_Deepgram.Dto}
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

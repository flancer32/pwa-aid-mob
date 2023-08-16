/**
 * Upload audio file to backend to transfer to Deepgram API.
 */
// MODULE'S VARS
const NS = 'Aid_Mob_Shared_Web_Api_Deepgram_File';

// MODULE'S CLASSES
/**
 * @memberOf Aid_Mob_Shared_Web_Api_Deepgram_File
 */
class Request {
    static namespace = NS;
    /** @type {string} */
    apiKey;
    /** @type {string} */
    base64;
    /** @type {string} */
    lang;
}

/**
 * @memberOf Aid_Mob_Shared_Web_Api_Deepgram_File
 */
class Response {
    static namespace = NS;
    /**
     * Deepgram response.
     * @type {Object}
     */
    transcription;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Aid_Mob_Shared_Web_Api_Deepgram_File {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast.castString|function} castString
     */
    constructor(
        {
            ['TeqFw_Core_Shared_Util_Cast.castString']: castString,
        }) {
        // INSTANCE METHODS

        /**
         * @param {Aid_Mob_Shared_Web_Api_Deepgram_File.Request} [data]
         * @return {Aid_Mob_Shared_Web_Api_Deepgram_File.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            res.apiKey = castString(data?.apiKey);
            res.base64 = castString(data?.base64);
            res.lang = castString(data?.lang);
            return res;
        };

        /**
         * @param {Aid_Mob_Shared_Web_Api_Deepgram_File.Response} [data]
         * @returns {Aid_Mob_Shared_Web_Api_Deepgram_File.Response}
         */
        this.createRes = function (data) {
            // create new DTO
            const res = new Response();
            // cast known attributes
            res.transcription = Object.assign({}, data?.transcription);
            return res;
        };
    }

}

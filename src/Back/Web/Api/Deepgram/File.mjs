/**
 * Generate sign up challenge before new user registration.
 */
// MODULE'S IMPORTS

// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Aid_Mob_Back_Web_Api_Deepgram_File {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Aid_Mob_Shared_Web_Api_Deepgram_File} */
        const endpoint = spec['Aid_Mob_Shared_Web_Api_Deepgram_File$'];
        /** @type {Aid_Mob_Back_Act_Deepgram_Transcribe_File.act|function} */
        const actFile = spec['Aid_Mob_Back_Act_Deepgram_Transcribe_File$'];

        // VARS
        logger.setNamespace(this.constructor.name);

        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         *
         * @param {Aid_Mob_Shared_Web_Api_Deepgram_File.Request|Object} req
         * @param {Aid_Mob_Shared_Web_Api_Deepgram_File.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            try {
                // get and normalize input data
                const apiKey = req.apiKey;
                const lang = req.lang;
                const [mimetype, base64] = req.base64.split(';base64,');
                const buffer = Buffer.from(base64, 'base64');
                const {response} = await actFile({apiKey, buffer, lang, mimetype});
                res.transcription = response;
                logger.info(`${this.constructor.name}: ${JSON.stringify(res)}'.`);
            } catch (error) {
                logger.error(error);
            }
        };
    }


}

/**
 * Model to communicate with Deepgram API.
 */
export default class Aid_Mob_Front_Mod_Api_Deepgram {
    constructor(spec) {
        // DEPS
        /** @type {Aid_Mob_Front_Defaults} */
        const DEF = spec['Aid_Mob_Front_Defaults$'];
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {TeqFw_Web_Front_Mod_Store_Singleton} */
        const modStore = spec['TeqFw_Web_Front_Mod_Store_Singleton$'];
        /** @type {Aid_Mob_Front_Dto_Config_Deepgram} */
        const dtoCfg = spec['Aid_Mob_Front_Dto_Config_Deepgram$'];

        // VARS
        logger.setNamespace(this.constructor.name);
        const KEY_IDENTITY = `${DEF.SHARED.NAME}/api/deepgram`;
        /** @type {Aid_Mob_Front_Dto_Config_Deepgram.Dto} */
        let _cacheKey;

        // INSTANCE METHODS

        this.getApiKey = function () {
            return _cacheKey?.key;
        }

        this.setApiKey = async function (data) {
            const dto = dtoCfg.createDto();
            dto.key = data;
            await modStore.set(KEY_IDENTITY, dto);
            _cacheKey = dto;
        }

        this.loadConfig = async function () {
            _cacheKey = await modStore.get(KEY_IDENTITY);
        }
    }
}

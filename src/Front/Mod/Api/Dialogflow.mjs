/**
 * Model to communicate with Dialogflow API.
 */
export default class Aid_Mob_Front_Mod_Api_Dialogflow {
    constructor(spec) {
        // DEPS
        /** @type {Aid_Mob_Front_Defaults} */
        const DEF = spec['Aid_Mob_Front_Defaults$'];
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {TeqFw_Web_Front_Mod_Store_Singleton} */
        const modStore = spec['TeqFw_Web_Front_Mod_Store_Singleton$'];
        /** @type {Aid_Mob_Front_Dto_Config_Dialogflow} */
        const dtoCfg = spec['Aid_Mob_Front_Dto_Config_Dialogflow$'];

        // VARS
        logger.setNamespace(this.constructor.name);
        const KEY_IDENTITY = `${DEF.SHARED.NAME}/api/dialogflow`;
        /** @type {Aid_Mob_Front_Dto_Config_Dialogflow.Dto} */
        let _cache;

        // INSTANCE METHODS

        this.getLang = function () {
            return _cache?.lang;
        }

        this.set = async function (lang) {
            const dto = dtoCfg.createDto(_cache);
            dto.lang = lang;
            await modStore.set(KEY_IDENTITY, dto);
            _cache = dto;
        }

        this.loadConfig = async function () {
            _cache = await modStore.get(KEY_IDENTITY);
        }
    }
}

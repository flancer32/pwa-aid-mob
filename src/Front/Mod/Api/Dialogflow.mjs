/**
 * Model to communicate with Dialogflow API.
 */
export default class Aid_Mob_Front_Mod_Api_Dialogflow {
    /**
     * @param {Aid_Mob_Front_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Web_Front_Mod_Store_Singleton} modStore
     * @param {Aid_Mob_Front_Dto_Config_Dialogflow} dtoCfg
     */
    constructor(
        {
            Aid_Mob_Front_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Front_Mod_Store_Singleton$: modStore,
            Aid_Mob_Front_Dto_Config_Dialogflow$: dtoCfg,
        }) {
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

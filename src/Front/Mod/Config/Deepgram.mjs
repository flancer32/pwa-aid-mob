/**
 * Model to manage configuration options related to Deepgram. All options are saved in the browser's Local Storage.
 */
export default class Aid_Mob_Front_Mod_Config_Deepgram {
    /**
     * @param {Aid_Mob_Front_Defaults} DEF
     * @param {Aid_Mob_Front_Dto_Config_Deepgram} dtoCfg
     */
    constructor(
        {
            ['Aid_Mob_Front_Defaults$']: DEF,
            ['Aid_Mob_Front_Dto_Config_Deepgram$']: dtoCfg,
        }
    ) {

        // VARS
        const KEY_IDENTITY = `${DEF.SHARED.NAME}/config/deepgram`;
        /** @type {Aid_Mob_Front_Dto_Config_Deepgram.Dto} */
        let _cache = loadFromLocalStorage();

        // FUNCS
        /**
         * Load data from the Local Storage into the `_cache` object.
         * @return {Aid_Mob_Front_Dto_Config_Deepgram.Dto}
         */
        function loadFromLocalStorage() {
            const stored = window.localStorage.getItem(KEY_IDENTITY);
            return JSON.parse(stored);
        }

        /**
         * Save cached data into the Local Storage.
         */
        function saveToLocalStorage() {
            window.localStorage.setItem(KEY_IDENTITY, JSON.stringify(_cache));
        }

        // INSTANCE METHODS

        this.getApiKey = () => _cache?.key;

        this.getLang = () => _cache?.lang ?? DEF.DATA_LANG;

        /**
         * @param {string} key
         * @param {string} lang
         */
        this.set = function (key, lang) {
            const dto = dtoCfg.createDto(_cache);
            dto.key = key;
            dto.lang = lang;
            _cache = dto;
            saveToLocalStorage();
        };

    }
}

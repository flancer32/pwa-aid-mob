/**
 * Logging transport implementation to send logs to logs aggregator.
 * Send logs to log monitoring server.
 *
 * @implements TeqFw_Core_Shared_Api_Logger_Transport
 */
export default class Aid_Mob_Front_Mod_Logger_Transport {
    constructor(spec) {
        // DEPS
        /** @type {Aid_Mob_Front_Defaults} */
        const DEF = spec['Aid_Mob_Front_Defaults$'];
        /** @type {TeqFw_Web_Front_Mod_Config} */
        const modCfg = spec['TeqFw_Web_Front_Mod_Config$'];
        /** @type {TeqFw_Core_Shared_Logger_Transport_Console} */
        const transConsole = spec['TeqFw_Core_Shared_Logger_Transport_Console$'];
        /** @type {Aid_Mob_Shared_Dto_Log} */
        const dtoLog = spec['Aid_Mob_Shared_Dto_Log$'];
        /** @type {typeof TeqFw_Web_Shared_Enum_Log_Type} */
        const TYPE = spec['TeqFw_Web_Shared_Enum_Log_Type$'];

        // VARS
        const STORE_KEY = `${DEF.SHARED.NAME}/front/log/monitor`;
        let BASE;
        let _canSendLogs;

        // MAIN

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Core_Shared_Dto_Log.Dto} dto
         */
        this.log = function (dto) {
            // FUNCS
            /**
             * Don't call this function in VARS section, because config is not loaded yet.
             * @return {string}
             */
            function composeBaseUrl() {
                if (!BASE) {
                    /** @type {TeqFw_Web_Shared_Dto_Config_Front.Dto} */
                    const cfg = modCfg.get();
                    const schema = '//';
                    const domain = cfg?.custom[DEF.SHARED.CFG_LOGS_AGG];
                    BASE = `${schema}${domain}/log-agg-beacon/`;
                }
                return BASE;
            }

            // MAIN
            if (_canSendLogs)
                try {
                    // compose DTO to send data to logs aggregator
                    // noinspection JSCheckFunctionSignatures
                    const entry = dtoLog.createDto(dto);
                    // init aggregator specific properties
                    entry.level = (dto.isError) ? 1 : 0;
                    entry.meta = entry.meta ?? {};
                    // default type is 'back'
                    entry.meta['type'] = entry.meta['type'] ?? TYPE.FRONT;
                    // send log entry to logs monitor
                    const postData = JSON.stringify(entry);
                    const url = composeBaseUrl();
                    if (url) navigator.sendBeacon(url, JSON.stringify(postData));
                    else this.disableLogs();
                } catch (e) {
                    _canSendLogs = false;
                }
            // duplicate to console
            transConsole.log(dto);
        }

        this.enableLogs = function () {
            _canSendLogs = true;
            window.localStorage.setItem(STORE_KEY, _canSendLogs);
        }

        this.disableLogs = function () {
            _canSendLogs = false;
            window.localStorage.setItem(STORE_KEY, _canSendLogs);
        }

        this.isLogsMonitorOn = () => _canSendLogs;
    }
}

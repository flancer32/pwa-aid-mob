/**
 * Logging transport implementation to send logs to logs aggregator.
 * Send logs to log monitoring server.
 */
// MODULE'S IMPORT
import http from "node:https";

// MODULE'S CLASSES
/**
 * @implements TeqFw_Core_Shared_Api_Logger_Transport
 */
export default class Aid_Mob_Back_Mod_Logger_Transport {
    constructor(spec) {
        // DEPS
        /** @type {Aid_Mob_Back_Defaults} */
        const DEF = spec['Aid_Mob_Back_Defaults$'];
        /** @type {TeqFw_Core_Back_Config} */
        const config = spec['TeqFw_Core_Back_Config$'];
        /** @type {TeqFw_Core_Shared_Logger_Transport_Console} */
        const transConsole = spec['TeqFw_Core_Shared_Logger_Transport_Console$'];
        /** @type {Aid_Mob_Shared_Dto_Log} */
        const dtoLog = spec['Aid_Mob_Shared_Dto_Log$'];
        /** @type {typeof TeqFw_Web_Shared_Enum_Log_Type} */
        const TYPE = spec['TeqFw_Web_Shared_Enum_Log_Type$'];

        // VARS
        let _canSendLogs = false;
        const HOSTNAME = initHostname();

        // FUNCS
        function initHostname() {
            /** @type {TeqFw_Web_Back_Plugin_Dto_Config_Local.Dto} */
            const cfgWeb = config.getLocal(DEF.MOD_WEB.SHARED.NAME);
            const host = cfgWeb?.custom?.[DEF.SHARED.CFG_LOGS_AGG];
            if (host) _canSendLogs = true;
            return host;
        }

        // INSTANCE METHODS
        /**
         * @param {TeqFw_Core_Shared_Dto_Log.Dto} data
         */
        this.log = function (data) {
            if (_canSendLogs)
                try {
                    // compose DTO to send data to logs aggregator
                    // noinspection JSCheckFunctionSignatures
                    const log = dtoLog.createDto(data);
                    // init aggregator specific properties
                    log.level = (data.isError) ? 1 : 0;
                    log.meta = data.meta ?? {};
                    // default type is 'back'
                    log.meta['type'] = log.meta['type'] ?? TYPE.BACK;
                    // send log entry to logs monitor
                    const postData = JSON.stringify(log);
                    const options = {
                        hostname: HOSTNAME,
                        path: '/log-agg-collect/',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': Buffer.byteLength(postData)
                        }
                    };
                    // just write out data w/o response processing
                    const req = http.request(options, (res) => {
                        if (res.statusCode !== 200)
                            _canSendLogs = false;
                    });
                    req.on('error', (e) => {
                        if (e.code === 'ECONNREFUSED') {
                            _canSendLogs = false;
                        } else {
                            console.error(`problem with request: ${e.message}`);
                        }
                    });
                    req.write(postData);
                    req.end();
                } catch (e) {
                    _canSendLogs = false;
                }
            // duplicate to console
            transConsole.log(data);
        }

        this.enableLogs = () => _canSendLogs = true;

        this.disableLogs = () => _canSendLogs = false;

        this.isLogsMonitorOn = () => _canSendLogs;
    }
}

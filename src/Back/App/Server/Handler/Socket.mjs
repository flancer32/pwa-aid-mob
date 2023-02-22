/**
 * Web server handler to process web sockets connections. One handler is used for all connections.
 *
 * @implements TeqFw_Web_Back_Api_Listener_Socket
 */
export default class Aid_Mob_Back_App_Server_Handler_Socket {
    constructor(spec) {
        // DEPS
        /** @type {Aid_Mob_Back_Defaults} */
        const DEF = spec['Aid_Mob_Back_Defaults$'];
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Aid_Mob_Back_App_Server_Handler_Socket_A_Dg_File} */
        const aDgFile = spec['Aid_Mob_Back_App_Server_Handler_Socket_A_Dg_File$'];
        /** @type {Aid_Mob_Back_App_Server_Handler_Socket_A_Dg_Live} */
        const aDgLive = spec['Aid_Mob_Back_App_Server_Handler_Socket_A_Dg_Live$'];
        /** @type {Aid_Mob_Back_App_Server_Handler_Socket_A_Gdf_Live} */
        const aGdfLive = spec['Aid_Mob_Back_App_Server_Handler_Socket_A_Gdf_Live$'];

        // VARS
        logger.setNamespace(this.constructor.name);

        // INSTANCE METHODS

        this.canProcess = function (req) {
            return req.url.includes(DEF.SHARED.SPACE_WS);
        }

        this.init = async function () { }

        this.prepareSocket = function (ws) {
            // ws.binaryType = 'fragments';
            logger.info(`Client web socket is connected.`);
            return ws;
        }

        this.process = (ws, req) => {
            const url = req.url;
            try {
                if (url.includes(DEF.SHARED.WS_DG_FILE)) {
                    aDgFile.process(ws, req);
                } else if (url.includes(DEF.SHARED.WS_DG_LIVE)) {
                    aDgLive.process(ws, req);
                } else if (url.includes(DEF.SHARED.WS_GDF_LIVE)) {
                    aGdfLive.process(ws, req);
                } else {
                    // codes: https://www.iana.org/assignments/websocket/websocket.xhtml
                    ws.close(1000, 'Unknown request');
                }
            } catch (e) {
                logger.error(`Cannot process websocket request. `
                    + `Error: ${e?.message || e}`);
            }
        }

    }
}

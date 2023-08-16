/**
 * Web server handler to process web sockets connections. One handler is used for all connections.
 *
 * @implements TeqFw_Web_Back_Api_Listener_Socket
 */
export default class Aid_Mob_Back_App_Server_Handler_Socket {
    /**
     * @param {Aid_Mob_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {Aid_Mob_Back_App_Server_Handler_Socket_A_Dg_File} aDgFile
     * @param {Aid_Mob_Back_App_Server_Handler_Socket_A_Dg_Live} aDgLive
     * @param {Aid_Mob_Back_App_Server_Handler_Socket_A_Gdf_Live} aGdfLive
     */
    constructor(
        {
            Aid_Mob_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Aid_Mob_Back_App_Server_Handler_Socket_A_Dg_File$: aDgFile,
            Aid_Mob_Back_App_Server_Handler_Socket_A_Dg_Live$: aDgLive,
            Aid_Mob_Back_App_Server_Handler_Socket_A_Gdf_Live$: aGdfLive,
        }) {
        // VARS
        logger.setNamespace(this.constructor.name);

        // INSTANCE METHODS

        this.canProcess = function (req) {
            return req.url.includes(DEF.SHARED.SPACE_WS);
        };

        this.init = async function () { };

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

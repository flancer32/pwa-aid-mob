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
        /** @type {Aid_Mob_Back_App_Server_Handler_Socket_A_Dg_File} */
        const aDgFile = spec['Aid_Mob_Back_App_Server_Handler_Socket_A_Dg_File$'];
        /** @type {Aid_Mob_Back_App_Server_Handler_Socket_A_Dg_Live} */
        const aDgLive = spec['Aid_Mob_Back_App_Server_Handler_Socket_A_Dg_Live$'];
        /** @type {Aid_Mob_Back_App_Server_Handler_Socket_A_Gdf_Live} */
        const aGdfLive = spec['Aid_Mob_Back_App_Server_Handler_Socket_A_Gdf_Live$'];

        // INSTANCE METHODS

        this.canProcess = function (req) {
            return req.url.includes(DEF.SHARED.SPACE_WS);
        }

        this.init = async function () { }

        this.prepareSocket = function (ws) {
            // ws.binaryType = 'fragments';
            return ws;
        }

        this.process = (ws, req) => {
            const url = req.url;
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
        }

    }
}

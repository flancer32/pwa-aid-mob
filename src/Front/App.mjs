/**
 * Web application.
 *
 * Initialization:
 * - Load config and i18n from server (WAPI).
 * - Init UUID for front & back.
 * - Init processes and bind it to events.
 * - Open reverse events stream.
 * - Init Vue (add router, Quasar UI, i18next),
 *
 * Then create and mount root vue component to given DOM element.
 */
// MODULE'S VARS
const NS = 'Aid_Mob_Front_App';

// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Front_Api_IApp
 */
export default class Aid_Mob_Front_App {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {function} */
        const createApp = spec['TeqFw_Vue_Front_Ext_Vue.createApp'];
        /** @type {function} */
        const createRouter = spec['TeqFw_Vue_Front_Ext_Router.createRouter'];
        /** @type {function} */
        const createWebHashHistory = spec['TeqFw_Vue_Front_Ext_Router.createWebHashHistory'];
        /** @type {Aid_Mob_Front_Defaults} */
        const DEF = spec['Aid_Mob_Front_Defaults$'];
        /** @type {TeqFw_Di_Shared_Container} */
        const container = spec['TeqFw_Di_Shared_Container$'];
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {TeqFw_Core_Shared_Logger_Base} */
        const loggerBase = spec['TeqFw_Core_Shared_Logger_Base$'];
        /** @type {Aid_Mob_Front_Mod_Logger_Transport} */
        const modLogTrn = spec['TeqFw_Core_Shared_Api_Logger_Transport$']; // as interface
        /** @type {TeqFw_Ui_Quasar_Front_Lib} */
        const quasar = spec['TeqFw_Ui_Quasar_Front_Lib'];
        /** @type {TeqFw_Web_Front_Mod_Config} */
        const modCfg = spec['TeqFw_Web_Front_Mod_Config$'];
        /** @type {Aid_Mob_Front_Ui_Layout_Center.vueCompTmpl} */
        const layoutCenter = spec['Aid_Mob_Front_Ui_Layout_Center$'];
        /** @type {Aid_Mob_Front_Ui_Layout_Main.vueCompTmpl} */
        const layoutMain = spec['Aid_Mob_Front_Ui_Layout_Main$'];
        /** @type {TeqFw_Ui_Quasar_Front_Lib_Spinner.vueCompTmpl} */
        const uiSpinner = spec['TeqFw_Ui_Quasar_Front_Lib_Spinner$'];

        // VARS
        let _isInitialized = false; // application is initialized and can be mounted
        let _print; // function to printout logs to UI or console
        let _root; // root vue component for the application

        // MAIN
        logger.setNamespace(this.constructor.namespace);

        // INSTANCE METHODS

        this.init = async function (fnPrintout) {
            // FUNCS

            /**
             * Create printout function to log application startup events (to page or to console).
             * @param {function(string)} fn
             * @return {function(string)}
             */
            function createPrintout(fn) {
                return (typeof fn === 'function') ? fn : (msg) => console.log(msg);
            }

            function initQuasarUi(app, quasar) {
                app.use(quasar, {config: {}});
                // noinspection JSUnresolvedVariable
                quasar.iconSet.set(quasar.iconSet.svgMaterialIcons);
            }

            function initUiComponents(app) {

            }

            function initRouter(app, DEF, container) {
                /** @type {{addRoute}} */
                const router = createRouter({
                    history: createWebHashHistory(), routes: [],
                });
                // setup application routes (load es6-module on demand with DI-container)
                router.addRoute({
                    path: DEF.ROUTE_CRED,
                    component: () => container.get('Aid_Mob_Front_Ui_Route_Cred$'),
                });
                router.addRoute({
                    path: DEF.ROUTE_DEEPGRAM,
                    component: () => container.get('Aid_Mob_Front_Ui_Route_Deepgram$'),
                });
                router.addRoute({
                    path: DEF.ROUTE_DEEPGRAM_FILE,
                    component: () => container.get('Aid_Mob_Front_Ui_Route_Deepgram_File$'),
                });
                router.addRoute({
                    path: DEF.ROUTE_DIALOGFLOW,
                    component: () => container.get('Aid_Mob_Front_Ui_Route_Dialogflow$'),
                });
                router.addRoute({
                    path: DEF.ROUTE_HOME,
                    component: () => container.get('Aid_Mob_Front_Ui_Route_Home$'),
                });
                router.addRoute({
                    path: DEF.ROUTE_OCR,
                    component: () => container.get('Aid_Mob_Front_Ui_Route_Ocr$'),
                });
                router.addRoute({
                    path: DEF.ROUTE_RECORD,
                    component: () => container.get('Aid_Mob_Front_Ui_Route_Record$'),
                });
                router.addRoute({
                    path: DEF.ROUTE_WATSON,
                    component: () => container.get('Aid_Mob_Front_Ui_Route_Watson$'),
                });

                //
                router.afterEach((to) => {
                    const _paq = window._paq;
                    _paq.push(['setCustomUrl', to.path]);
                    _paq.push(['setDocumentTitle', document.title]);
                    _paq.push(['trackPageView']);
                });
                app.use(router);
                return router;
            }

            function initLogger() {
                /** @type {TeqFw_Web_Shared_Dto_Config_Front.Dto} */
                const cfg = modCfg.get();
                const domain = cfg?.custom?.[DEF.SHARED.CFG_LOGS_AGG];
                if (domain) {
                    modLogTrn.enableLogs();
                    loggerBase.setTransport(modLogTrn);
                }
            }

            // MAIN
            let res = true;
            _print = createPrintout(fnPrintout);
            _print(`TeqFW App is initializing...`);
            // create root vue component
            _root = createApp({
                teq: {package: DEF.SHARED.NAME},
                name: NS,
                data() {
                    return {
                        canDisplay: false
                    };
                },
                template: '<router-view v-if="canDisplay"/><div class="launchpad" v-if="!canDisplay">App is starting...</div>',
                async mounted() {
                    logger.info(`Front app is mounted in DOM.`);
                    this.canDisplay = true;
                }
            });
            // ... and add global available components
            _root.component('layoutCenter', layoutCenter);
            _root.component('layoutMain', layoutMain);
            _root.component('uiSpinner', uiSpinner);
            // other initialization
            await modCfg.init({}); // this app has no separate 'doors' (entry points)
            _print(`Application config is loaded.`);
            try {
                initLogger();
                initQuasarUi(_root, quasar);
                initUiComponents(_root);
                _print(`Data sources are initialized.`);
                // validate route and authentication
                initRouter(_root, DEF, container);
                _print(`Vue app is created and initialized.`);
                _isInitialized = true;
            } catch (e) {
                _print(e?.message);
                res = false;
            }
            return res;
        }

        /**
         * Mount root vue component of the application to DOM element.
         *
         * @see https://v3.vuejs.org/api/application-api.html#mount
         *
         * @param {Element|string} elRoot
         */
        this.mount = function (elRoot) {
            if (_isInitialized) _root.mount(elRoot);
        }

        this.reinstall = function (elRoot) {
            _print(`
It is required to reinstall app. Please clean up all data in DevTools 
(F12 / Application / Storage / Clear site data).
Then reload this page.
`);
        }
    }
}

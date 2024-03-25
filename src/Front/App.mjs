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
 * @implements TeqFw_Web_Front_Api_App
 */
export default class Aid_Mob_Front_App {
    /**
     * @param {TeqFw_Di_Container} container
     * @param {TeqFw_Vue_Front_Ext_Vue} extVue
     * @param {TeqFw_Ui_Quasar_Front_Ext} extQuasar
     * @param {Aid_Mob_Front_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Core_Shared_Logger_Base} loggerBase
     * @param {Aid_Mob_Front_Mod_Logger_Transport} modLogTrn -  injected as interface
     * @param {TeqFw_Web_Front_Mod_Config} modCfg
     * @param {Aid_Mob_Front_Ui_Layout_Center.vueCompTmpl} layoutCenter
     * @param {Aid_Mob_Front_Ui_Layout_Main.vueCompTmpl} layoutMain
     * @param {TeqFw_Ui_Quasar_Front_Lib_Spinner.vueCompTmpl} uiSpinner
     */
    constructor(
        {
            container,
            TeqFw_Vue_Front_Ext_Vue: extVue,
            TeqFw_Ui_Quasar_Front_Ext: extQuasar,
            Aid_Mob_Front_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Core_Shared_Logger_Base$: loggerBase,
            TeqFw_Core_Shared_Api_Logger_Transport$: modLogTrn,
            TeqFw_Web_Front_Mod_Config$: modCfg,
            Aid_Mob_Front_Ui_Layout_Center$: layoutCenter,
            Aid_Mob_Front_Ui_Layout_Main$: layoutMain,
            TeqFw_Ui_Quasar_Front_Lib_Spinner$: uiSpinner,
        }) {
        // VARS
        let _isInitialized = false; // application is initialized and can be mounted
        let _print; // function to printout logs to UI or console
        let _root; // root vue component for the application
        const {
            /** @type {{createApp:function}} */
            Vue,
            /** @type {{createRouter:function, createWebHashHistory:function}} */
            VueRouter,
        } = extVue;

        const {default: quasar} = extQuasar;

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
                const router = VueRouter.createRouter({
                    history: VueRouter.createWebHashHistory(), routes: [],
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
                    if (_paq?.push) {
                        _paq.push(['setCustomUrl', to.path]);
                        _paq.push(['setDocumentTitle', document.title]);
                        _paq.push(['trackPageView']);
                    }
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
            _root = Vue.createApp({
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
        };

        /**
         * Mount root vue component of the application to DOM element.
         *
         * @see https://v3.vuejs.org/api/application-api.html#mount
         *
         * @param {Element|string} elRoot
         */
        this.mount = function (elRoot) {
            if (_isInitialized) _root.mount(elRoot);
        };

        this.reinstall = function (elRoot) {
            _print(`
It is required to reinstall app. Please clean up all data in DevTools 
(F12 / Application / Storage / Clear site data).
Then reload this page.
`);
        };
    }
}

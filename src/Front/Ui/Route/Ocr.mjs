/**
 * Screen for OCR test (Optical Character Recognition).
 *
 * @namespace Aid_Mob_Front_Ui_Route_Ocr
 */
// MODULE'S VARS
const NS = 'Aid_Mob_Front_Ui_Route_Ocr';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Aid_Mob_Front_Ui_Route_Ocr.vueCompTmpl}
 */
/**
 * @param {Aid_Mob_Front_Defaults} DEF
 */
export default function (
    {
        Aid_Mob_Front_Defaults$: DEF,
    }) {
    // VARS
    const template = `
<layout-main>

    <q-card>

        <q-card-section style="text-align: center;">
            <div>Just an OCR demo</div>
             <input type="file" id="uploader">
        </q-card-section>      
        
        <q-card-actions align="center">
            <q-btn label="Start" v-on:click="onStart" />
        </q-card-actions>  
    </q-card>    

</layout-main>
`;
    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Aid_Mob_Front_Ui_Route_Ocr
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {},
        data() {
            return {};
        },
        methods: {
            async onStart() {
                const worker = await Tesseract.createWorker({
                    corePath: '/src/tesseract.js-core/tesseract-core.wasm.js',
                    workerPath: '/src/tesseract.js/worker.min.js',
                    logger: m => console.log(m),
                });

                await worker.loadLanguage('rus');
                await worker.initialize('rus');
                await worker.setParameters({
                    // tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz., ',
                    tessedit_ocr_engine_mode: 2, // TESSERACT_LSTM_COMBINED
                });

                const recognize = async function (evt) {
                    const files = evt.target.files;
                    const ret = await worker.recognize(files[0]);
                    console.log(ret.data.text);
                }

                const elm = document.getElementById('uploader');
                elm.addEventListener('change', recognize);
            }
        },
        created() { },
        mounted() {
            document.title = 'OCR Test';
        },
    };
}

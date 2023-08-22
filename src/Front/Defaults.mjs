/**
 * Plugin constants (hardcoded configuration) for frontend code.
 */
export default class Aid_Mob_Front_Defaults {

    COLOR_Q_PRIMARY = 'primary';

    DATA_LANG = 'en-US';
    DATA_GDF_PRJ_ID = 'ai-demo-64';

    ROUTE_CRED = '/cred';
    ROUTE_DEEPGRAM = '/deepgram';
    ROUTE_DEEPGRAM_FILE = '/deepgram/file';
    ROUTE_DIALOGFLOW = '/dialogflow';
    ROUTE_HOME = '/';
    ROUTE_OCR = '/ocr';
    ROUTE_RECORD = '/record';
    ROUTE_WATSON = '/watson';

    /** @type {Aid_Mob_Shared_Defaults} */
    SHARED;

    constructor(
        {
            Aid_Mob_Shared_Defaults$: SHARED
        }
    ) {
        this.SHARED = SHARED;
        Object.freeze(this);
    }
}

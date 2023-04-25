/**
 * Transcribe audio/video file using Deepgram SDK.
 *
 * @namespace Aid_Mob_Back_Act_Deepgram_Transcribe_File
 */
// MODULE'S IMPORTS
import sdk from '@deepgram/sdk';

// MODULE'S VARS
const NS = 'Aid_Mob_Back_Act_Deepgram_Transcribe_File';

// MODULE'S FUNCTIONS
export default function (spec) {
    // DEPS
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance

    // VARS
    logger.setNamespace(NS);

    // FUNCS
    /**
     * @param {string} apiKey
     * @param {Buffer} buffer
     * @param {string} lang
     * @param {string} mimetype
     * @return {Promise<{response: Object}>}
     * @memberOf Aid_Mob_Back_Act_Deepgram_Transcribe_File
     */
    async function act({apiKey, buffer, lang, mimetype}) {
        try {
            // Open the audio file
            const source = {
                buffer,
                mimetype,
            };
            // Initialize the Deepgram SDK
            const deepgram = new sdk.Deepgram(apiKey);
            const response = await deepgram.transcription
                .preRecorded(source, {
                    diarize: true,
                    language: lang,
                    model: 'general',
                    paragraphs: true,
                    punctuate: true,
                    utterances: true,
                });
            return {response};
        } catch (e) {
            logger.error(e);
        }
        return {};
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
// MODULE'S IMPORTS
import assert from 'node:assert';
import {container} from '@teqfw/test';
import {describe, it} from 'mocha';

// MODULE'S VARS
/** @type {Aid_Mob_Back_Act_Deepgram_Transcribe_File.act|function} */
const act = await container.get('Aid_Mob_Back_Act_Deepgram_Transcribe_File$');


// MODULE'S MAIN
describe('Aid_Mob_Back_Act_Deepgram_Transcribe_File', function () {

    it('act is a function', async () => {
        assert(typeof act === 'function');
    });

    it('act works fine', async () => {
        const apiKey = '...';
        const file = '...';
        const lang = 'en';
        const mimetype = 'audio/flac';
        const res = await act({apiKey, file, lang, mimetype});
    });

});

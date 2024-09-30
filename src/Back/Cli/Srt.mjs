/**
 * Get application version.
 *
 * @namespace Aid_Mob_Back_Cli_Srt
 */
// MODULE'S IMPORT
import {readFileSync, writeFileSync} from 'node:fs';

// MODULE'S VARS
const NS = 'Aid_Mob_Back_Cli_Srt';
const OPT_INPUT = 'input';
const OPT_OUTPUT = 'output';
/**
 * The state of the parsing process (see structure of SRT file).
 */
const STATE = {
    FRAME: 'frame',
    INIT: 'init',
    TEXT: 'text',
    TIME: 'time',
};

const REG_FRAME = /^(?:[1-9]|[1-9][0-9]{1,4})$/; // "1", ... "9999"

// MODULE'S FUNCS
function formatTime(time) {
    const [hms, sss] = time.split('.');
    const padded = sss.substring(0, 3).padEnd(3, '0');
    const norm = (padded === 'und') ? '000' : padded; // the 'undefined' case
    return `${hms},${norm}`;
}

/**
 * Factory to create CLI command.
 *
 * @param {Aid_Mob_Back_Defaults} DEF
 * @param {TeqFw_Core_Back_Config} config
 * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
 * @param {TeqFw_Core_Back_Api_Dto_Command.Factory} fCommand
 * @param {TeqFw_Core_Back_Api_Dto_Command_Option.Factory} fOpt
 *
 * @returns {TeqFw_Core_Back_Api_Dto_Command}
 * @memberOf Aid_Mob_Back_Cli_Srt
 */
export default function Factory(
    {
        Aid_Mob_Back_Defaults$: DEF,
        TeqFw_Core_Back_Config$: config,
        TeqFw_Core_Shared_Api_Logger$$: logger,
        'TeqFw_Core_Back_Api_Dto_Command.Factory$': fCommand,
        'TeqFw_Core_Back_Api_Dto_Command_Option.Factory$': fOpt,
    }
) {
    // FUNCS
    /**
     * Command action.
     * @returns {Promise<void>}
     * @memberOf Aid_Mob_Back_Cli_Srt
     */
    async function action(opts) {
        try {
            const input = opts[OPT_INPUT];
            const output = opts[OPT_OUTPUT];
            if (input && output) {
                logger.info(`Converting the file '${input}' into the '${output}'...`);
                const buffer = readFileSync(input, 'utf-8');
                const inTxt = buffer.toString().split('\n');
                const outSrt = [];
                let state = STATE.INIT;
                debugger
                for (const one of inTxt) {
                    const line = one.trim();
                    if (line.length === 0) {
                        state = STATE.INIT;
                        outSrt.push(line);
                        continue;
                    }
                    if ((state === STATE.INIT) && REG_FRAME.test(line)) {
                        state = STATE.FRAME;
                        outSrt.push(line);
                        continue;
                    }
                    if (state === STATE.FRAME) {
                        state = STATE.TIME;
                        const [startTime, endTime] = line.split(' - ');
                        const startFormatted = formatTime(startTime);
                        const endFormatted = formatTime(endTime);
                        outSrt.push(`${startFormatted} --> ${endFormatted}`);
                        continue;
                    }
                    if ((state === STATE.TIME) || (state === STATE.TEXT)) {
                        state = STATE.TEXT;
                        outSrt.push(line);
                    }
                }
                writeFileSync(output, outSrt.join('\n'));
                logger.info(`Job is done.`);
            }
        } catch (e) {
            logger.exception(e);
        }
    }

    Object.defineProperty(action, 'namespace', {value: NS});

    // COMPOSE RESULT
    const res = fCommand.create();
    res.realm = DEF.CLI_PREFIX;
    res.name = 'srt';
    res.desc = 'convert text transcription into the SRT file (subtitles)';
    res.action = action;
    // add option --input
    const optInput = fOpt.create();
    optInput.flags = `-i, --${OPT_INPUT} <path>`;
    optInput.description = `the path to the text file with transcription`;
    res.opts.push(optInput);
    // add option --output
    const optOutput = fOpt.create();
    optOutput.flags = `-o, --${OPT_OUTPUT} <path>`;
    optOutput.description = `the path to the srt file with subtitles`;
    res.opts.push(optOutput);
    return res;
}

// finalize code components for this es6-module
Object.defineProperty(Factory, 'namespace', {value: NS});

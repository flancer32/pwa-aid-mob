/**
 * Utility to upgrade the old-style DI specification to the new-style.
 *
 * Usage: ./upgradeSpec.mjs ./src
 */
import {extname, isAbsolute, join} from 'node:path';
import {readdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';

// VARS
const REG_TARGET = /^([\s\w]*(constructor|function)\s*\w*\s*\(spec\)\s*\{\s*)(.*)/sm;
const REG_SPEC_DOC = /\/\*\*\s*@type\s*(\{[^}]*\})/s;
const REG_SPEC_PARAM = /const\s+(\w*)\s+=\s+spec(\[[^\]]+\]);*\s*(\/\/(.*))?/s;
const REG_TYPE_DI_WO = /\['(.+)']/s;
const REG_TYPE_DI_WITH = /\[(.+)]/s;

const FILES_SKIP = [];

// FUNCS

/**
 * Get first argument as a root path in the filesystem and scan this directory for the JS sources.
 * @return {string[]}
 */
function getFiles() {
    // FUNCS

    function readDirectory(curDir, files) {
        const statsRoot = statSync(curDir);
        if (statsRoot.isDirectory()) {
            const items = readdirSync(curDir);
            for (const item of items) {
                const itemPath = join(curDir, item);
                const statsSub = statSync(itemPath);
                if (
                    statsSub.isFile() &&
                    ((extname(item) === '.mjs') || (extname(item) === '.js'))
                ) {
                    files.push(itemPath);
                } else if (statsSub.isDirectory()) {
                    readDirectory(itemPath, files);
                }
            }
        } else if (
            statsRoot.isFile() &&
            ((extname(curDir) === '.mjs') || (extname(curDir) === '.js'))
        ) {
            files.push(curDir);
        }
    }

    // MAIN
    const res = [];
    // The first two elements of process.argv are always the Node.js executable and the path to the script.
    const path = process.argv[2];
    const target = (isAbsolute(path)) ? path : join(process.cwd(), path);
    log(`Scan files in: ${target}`);
    readDirectory(target, res);
    log(`Total ${res.length} files are scanned.`);
    return res;
}

function log(msg) {
    console.log(msg);
}

function processOneFile(file) {
    const source = readFileSync(file, 'utf8');
    const parts = REG_TARGET.exec(source);
    if (parts) {
        const fromBase = parts[1]; // constructor or function
        const type = parts[2]; // constructor or function
        const lines = parts[3].split('\n');
        let jsdoc = '    /**\n';
        let toSpec = '';
        let docType = '';
        let fromSpec = '';
        for (const line of lines) {
            fromSpec += line + '\n';
            if (
                (line.indexOf('// DEPS') !== -1) ||
                (line.indexOf('// EXTRACT DEPS') !== -1)
            ) continue;
            const partsDoc = REG_SPEC_DOC.exec(line);
            if (partsDoc?.length) {
                docType = partsDoc[1];
                continue;
            }
            const partsParam = REG_SPEC_PARAM.exec(line);
            if (partsParam?.length) {
                const param = partsParam[1];
                const type = partsParam[2];
                const comment = partsParam[4];
                jsdoc += `     * @param ${docType} ${param}`;
                if (comment) jsdoc += ` - ${comment}`;
                jsdoc += '\n';
                docType = '';
                if (
                    (type.indexOf('.') === -1) &&
                    (type.indexOf('#') === -1) &&
                    (type.indexOf('@') === -1)
                ) {
                    // w/o quotes
                    const partsKey = REG_TYPE_DI_WO.exec(type);
                    toSpec += ' '.repeat(14) + `${partsKey[1]}: ${param},\n`;
                } else {
                    // with quotes
                    const partsKey = REG_TYPE_DI_WITH.exec(type);
                    toSpec += ' '.repeat(14) + `${partsKey[1]}: ${param},\n`;
                }
                continue;
            }
            break;
        }
        if (toSpec !== '') {
            jsdoc += `     */\n`;
            const toBase = (jsdoc + fromBase).replace('spec) {', '');
            toSpec = `{\n${toSpec}}) {\n`;
            let target = source.replace(fromBase, toBase);
            toSpec = toSpec.replace(/\$/g, '$$$$');
            target = target.replace(fromSpec, toSpec);
            writeFileSync(file, target);
        }
    } else {
        if (source.indexOf('constructor() {') === -1) {
            log(`File has no templates to be parsed.`);
            // log(source);
        }
    }
}

// MAIN
const files = getFiles();
for (const file of files) {
    log(file);
    let skip = false;
    for (const one of FILES_SKIP) {
        if (file.indexOf(one) !== -1) {
            skip = true;
            break;
        }
    }
    if (!skip) processOneFile(file);
}
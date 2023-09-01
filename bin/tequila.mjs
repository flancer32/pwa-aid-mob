#!/usr/bin/env node
'use strict';
/** Main script to create and run TeqFW backend application. */
// IMPORT
import {dirname, join} from 'node:path';
import {readFileSync} from 'node:fs';
import Container from '@teqfw/di';

// VARS
/* Resolve paths to main folders */
const url = new URL(import.meta.url);
const script = url.pathname;
const currentDir = dirname(script);
const root = join(currentDir, '..');

// FUNCS
/**
 * Create and setup DI container.
 * @param {string} root
 * @returns {Promise<TeqFw_Di_Api_Container>}
 */
async function initContainer(root) {
    /** @type {TeqFw_Di_Api_Container} */
    const res = new Container();
    res.setDebug(false);
    // add path mapping for @teqfw/core to the DI resolver
    const resolver = res.getResolver();
    const pathDi = join(root, 'node_modules', '@teqfw', 'di', 'src');
    const pathCore = join(root, 'node_modules', '@teqfw', 'core', 'src');
    resolver.addNamespaceRoot('TeqFw_Di_', pathDi, 'js');
    resolver.addNamespaceRoot('TeqFw_Core_', pathCore, 'mjs');
    // setup parser for the legacy code
    const chunkOld = await res.get('TeqFw_Core_Shared_App_Di_Parser_Chunk$');
    const parser = res.getParser();
    parser.addChunk(chunkOld);
    return res;
}

/**
 * Read project version from './package.json' or use default one.
 * @param root
 * @returns {*|string}
 */
function readVersion(root) {
    const filename = join(root, 'package.json');
    const buffer = readFileSync(filename);
    const content = buffer.toString();
    const json = JSON.parse(content);
    return json?.version ?? '0.1.0';
}

// MAIN
try {
    const container = await initContainer(root);
    const version = readVersion(root);
    /** Construct backend app instance using Container then init app & run it */
    /** @type {TeqFw_Core_Back_App} */
    const app = await container.get('TeqFw_Core_Back_App$');
    await app.init({path: root, version});
    await app.run();
} catch (e) {
    console.error('Cannot create or run TeqFW application.');
    console.dir(e);
}

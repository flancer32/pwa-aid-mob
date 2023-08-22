#!/usr/bin/env node
'use strict';
/** Main script to create and to run TeqFW backend application. */
// IMPORT
import {dirname, join} from 'node:path';
import {readFileSync} from 'node:fs';
import Container from '@teqfw/di';
import parserOld from '@teqfw/di/src/Parser/Old.js';

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
 * @returns {TeqFw_Di_Container}
 */
function initContainer(root) {
    /** @type {TeqFw_Di_Container} */
    const res = new Container();
    res.setDebug(false);
    // const pathDi = join(root, 'node_modules', '@teqfw', 'di', 'src');
    const pathCore = join(root, 'node_modules', '@teqfw', 'core', 'src');
    const resolver = res.getResolver();
    resolver.addNamespaceRoot('TeqFw_Core_', pathCore, 'mjs');
    // set old format parser for TeqFw_
    const validate = function (key) {
        return (key.indexOf('TeqFw_Core_') === 0) ||
            (key.indexOf('TeqFw_Test_') === 0) ||
            (key.indexOf('TeqFw_Ui_Quasar_') === 0) ||
            (key.indexOf('TeqFw_Vue_') === 0) ||
            (key.indexOf('TeqFw_Web_') === 0) ||
            (key.indexOf('TeqFw_Web_Api_') === 0);
    };
    res.getParser().addParser(validate, parserOld);
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
    const container = initContainer(root);
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

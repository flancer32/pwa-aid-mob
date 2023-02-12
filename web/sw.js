// MODULE'S VARS
const CACHE_STATIC = 'static-cache-v1'; // store name to cache static resources
const FILES_TO_CACHE = ['/', '/index.html', '/favicon.ico', '/styles.css'];

// MODULE'S FUNCS

/**
 * Send message to `index.html` to start bootstrap.
 */
function onActivate() {
    console.log('activating....');
    self.clients.claim().then();
}

/**
 * Load list of files required for offline running from server and cache all files.
 * @param {ExtendableEvent} event
 */
function onInstall(event) {

    // FUNCS
    /**
     * Load urls from server and cache content locally. All URLs are separated to batches up to 10 URLs each.
     * @param {string[]} urls
     * @return {Promise<void>}
     */
    async function cacheStatics(urls) {
        try {
            if (Array.isArray(urls)) {
                // ... and load static files to the local cache
                const cacheStat = await caches.open(CACHE_STATIC);
                // cache by batches
                let total = 0;
                const SIZE = 10;
                while (total <= urls.length) {
                    const slice = urls.slice(total, total + SIZE);
                    await Promise.all(
                        slice.map(function (url) {
                            return cacheStat.add(url).catch(function (reason) {
                                console.error(`SW install error: '${url}' failed, ${String(reason)}`);
                            });
                        })
                    );
                    total += SIZE;
                    const cached = total < urls.length ? total : urls.length;
                    console.log(`Total '${cached}' URLs are cached.`);
                }
            }
            console.log(`Static files are loaded and cached by Service Worker.`);
        } catch (e) {
            console.error(`SW iInstallation error: ${JSON.stringify(e)}`);
        }
    }

    // MAIN
    console.log('installing....');

    event.waitUntil(
        cacheStatics(FILES_TO_CACHE)
            .catch((e) => {
                console.error(`[TeqFw_Web_Sw_Worker] error: ${e.message}`);
            })
    );
}

/**
 * @param {FetchEvent} event
 */
function onFetch(event) {
    // always return result from network
}


// MAIN
self.addEventListener('activate', onActivate);
self.addEventListener('install', onInstall);
self.addEventListener('fetch', onFetch);

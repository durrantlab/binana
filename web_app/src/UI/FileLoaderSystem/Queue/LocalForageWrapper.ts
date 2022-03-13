// Released under the Apache 2.0 License. See LICENSE.md or go to
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2022
// Jacob D. Durrant.

import { IFileInfo } from "../Common/Interfaces";
import { ParentMol } from "../Mols/ParentMol";

let localforage: any;

let delim = "-::-:-";
let outputPrefix = "OUTPUTOUTPUT"

/**
 * Import the localforage module and return a promise that resolves to the
 * localforage module.
 * @returns The promise.
 */
function getLocalForage(): Promise<any> {
    return import(
        /* webpackChunkName: "localforage" */
        /* webpackMode: "lazy" */
        "localforage"
    )
    .then((mod: any) => {
        localforage = mod;
        return Promise.resolve();
    });

}

/**
 * Get all the localforage keys that start with the given id.
 * @param {string} id  The prefix of the keys you want to retrieve.
 * @returns {Promise}  A promise that resolves when done.
 */
function getKeys(id: string): Promise<any> {
    return getLocalForage()
    .then(() => {
        return localforage.keys()
    })
    .then((keys: string[]) => {
        keys = keys.filter(k => k.startsWith(id + delim));
        return Promise.resolve(keys);
    });
}

/**
 * Clear all localForage items for a given id
 * @param {string} id  The prefix of the items you want to clear.
 * @returns {Promise}  A promise that resolves when done.
 */
export function clearAllLocalForage(id: string): Promise<any> {
    return getLocalForage()
    .then(() => { return getKeys(id); })
    .then((keys: string[]) => {
        let removePromises = keys.map(k => localforage.removeItem(k));
        return Promise.all(removePromises);
    });
}

/**
 * Given an id and a files object, clear all localForage items with that id,
 * then set each key/value pair in the files object to localForage.
 * @param {string} id     The prefix of the items you want to clear.
 * @param {any}    files  The files object to be stored.
 * @returns {Promise}  A promise that resolves when done.
 */
export function filesObjToLocalForage(id: string, files: any): Promise<any> {
    return getLocalForage()
    .then(() => { return clearAllLocalForage(id); })
    .then(() => {
        let setPromises = Object.keys(files).map(k => localforage.setItem(id + delim + k, files[k]));
        return Promise.all(setPromises);
    })
}

/**
 * Gets the localforage keys for each of a list of ids.
 * @param {string[]} ids  The list of ids.
 * @returns An array of arrays of strings.
 */
function getQueueKeysPerId(ids: string[]): Promise<string[][]> {
    // Gets the status of the queue, but doesn't change the queue.
    let getKeysPromises = ids.map(id => getKeys(id));
    return Promise.all(getKeysPromises)
    .then((keysPerId: string[][]) => {
        return Promise.resolve(keysPerId);
    });
}

/**
 * Get the number of items remaining in the queue.
 * @param {string[]} ids  The localforage ids to check.
 * @returns {number} The number of items in the queue.
 */
export function numLeftInQueue(ids: string[]): Promise<number> {
    // Gets the status of the queue, but doesn't change the queue.
    return getQueueKeysPerId(ids)
    .then((keysPerId: string[][]) => {
        let numEntriesPerId = keysPerId.map(p => p.length);

        // Check if there are no keys for any id (empty queue).
        let sumNumKeys = numEntriesPerId.reduce((p, c) => p + c);
        if (sumNumKeys === 0) {
            return Promise.resolve(0);
        }

        // Is there any id with not associated items? That must be due to an
        // error, but let's just return 0 (silent error).
        for (let numEntries of numEntriesPerId) {
            if (numEntries === 0) {
                return Promise.resolve(0);
            }
        }

        // So return the maximum size of any entry.
        return Promise.resolve(Math.max(...numEntriesPerId));
    });
}

/**
 * Given an array of ids, return an array of corresponding ParentMol from
 * localforage.
 * @param {string[]} ids  The ids to retrieve.
 * @returns {Promise}  A promise that resolves to an array of ParentMol objects.
 */
function getContents(ids: string[]): Promise<ParentMol[]> {
    // Each one contains only one element.
    let contentsPromises: Promise<ParentMol>[] = ids.map(
        id => localforage.getItem(id)
    );
    return Promise.all(contentsPromises);
}

/**
 * Get the contents of the first item in the queue, and remove that item.
 * @param {string[]} ids  An array of ids.
 * @returns {Promise}  A promise that resolves to an array of IFileInfo objects.
 */
export function popQueue(ids: string[]): Promise<IFileInfo[]> {
    // TODO: Still right? I think objects are now stored in localforage as
    // objects.
    return getLocalForage()
    .then(() => { return numLeftInQueue(ids); })
    .then((numItems: number): Promise<IFileInfo[]> => {
        let onlyOneOfEach: boolean;
        switch (numItems) {
            case 0:
                let emptyFiles = ids.map((id) => {
                    return {filename: "", mol: undefined} as IFileInfo
                });
                return Promise.resolve(emptyFiles);
            case 1:
                onlyOneOfEach = true;
                break;
            default:
                onlyOneOfEach = false;
                break;
        }

        return getQueueKeysPerId(ids)
        .then((keysPerId: string[][]) => {
            let infosPerId: any[] = keysPerId.map(p => {
                return {
                    num: p.length,
                    firstKey: p[0]
                }
            });

            // Each one contains only one element.
            let keys = infosPerId.map(info => info.firstKey);
            return getContents(keys)
            .then((mols: ParentMol[]) => {
                keys = keys.map(k => k.split(delim)[1])
                let files: IFileInfo[] = mols.map((c, i) => {
                    return {
                        filename: keys[i],
                        mol: c
                    } as IFileInfo;
                });

                let removeItemsPromise: Promise<any>[] = [];
                if (onlyOneOfEach) {
                    // There's only one item assocaited with each id, so remove
                    // everything.
                    ids.forEach(id => clearAllLocalForage(id));
                } else {
                    // One of them contains more than one element. Only remove
                    // from the one(s) with more than 1.
                    infosPerId.forEach(infoPerId => {
                        if (infoPerId.num > 1) {
                            removeItemsPromise.push(
                                localforage.removeItem(infoPerId.firstKey)
                            );
                        }
                    })
                }

                return Promise.all(removeItemsPromise)
                .then((): Promise<IFileInfo[]> => {
                    return Promise.resolve(files);
                });
            });
        });
    });
}

/**
 * In case you want to load these common modules externally, they are exposed
 * here.
 * @param {Promise<any>[]} [existingModulePromises=undefined]  Any other
 *                                                             promises that
 *                                                             will resolve
 *                                                             modules.
 * @returns {Promise<any>}  A promise that resolves all the modules.
 */
export function jsZipAndFileSaverPromises(existingModulePromises: Promise<any>[] = undefined): Promise<any> {
    let jsZipPromise = import(
        /* webpackChunkName: "JSZip" */ 
        /* webpackMode: "lazy" */
        '../../../../node_modules/jszip/lib/index'
    ).then((mod) => {
        // @ts-ignore
        return Promise.resolve(mod.default);
    });

    // let jsZipPromise = Promise.resolve(JSZip);

    let fileSaverPromise = import(
        /* webpackChunkName: "FileSaver" */ 
        /* webpackMode: "lazy" */
        "file-saver"
    )
    .then((mod) => {
        return Promise.resolve(mod);
    });

    let promises = [jsZipPromise, fileSaverPromise];

    if (existingModulePromises) {
        promises = [...promises, ...existingModulePromises];
    }

    return Promise.all(promises);
}

/**
 * Generate a ZIP file from a list of files.
 * @param {any} files                        A map of file names to file
 *                                           contents.
 * @param {string} [zipFilename=output.zip]  The name of the zip file that will
 *                                           be created.
 */
function generateZIPDownload(files: any, zipFilename: string = "output.zip") {

    jsZipAndFileSaverPromises()
    .then((payload) => {
        let [JSZip, FileSaver] = payload;

        var zip = new JSZip();
        
        for (let id1 in files) {
            let file = files[id1];
            let content1 = file;
            if (typeof(content1) === "string") {
                zip["file"](id1, content1);
            } else {
                // it's a folder
                for (let id2 in file) {
                    let content2 = file[id2];
                    zip["folder"](id1)["file"](id2, content2);
                }
            }
        }

        return zip["generateAsync"]({["type"]:"blob"}).then(
            function (blob) {
                FileSaver["saveAs"](blob, zipFilename);
            }
        );
    });

}

/**
 * Now that queue is empty, and if there are files to download, generate a zip
 * file and download it.
 * @param {string} [zipFilename=output.zip]  The name of the zip file to download.
 * @returns {Promise}  A promise that resolves when done.
 */
export function endQueueAndDownloadFilesIfAvailable(zipFilename = "output.zip"): Promise<any> {
    return getLocalForage()
    .then(() => { return getKeys(outputPrefix); })
    .then((ids: string[]) => {
        if (ids.length > 0) {
            // There are files to download.
            return getContents(ids)
            .then((mols: ParentMol[]) => {
                let files = {};
                ids.forEach((id: string, idx: number) => {
                    let [dirname, filename] = id.split(delim).slice(1);
                    if (dirname !== "") {
                        // There is a directory.

                        files[dirname] = (!files[dirname]) 
                            ? {} 
                            : files[dirname];
                        files[dirname][filename] = mols[idx];
                    } else {
                        // Just a file,.
                        files[filename] = mols[idx];
                    }
                });
                return generateZIPDownload(files, zipFilename);
            })
        }
        // Nothing to download
        return Promise.resolve();
    })
    .then(() => {
        return localforage.clear();
    });
}

/**
 * Save a file to the localForage database
 * @param {string} filename      The name of the file to save.
 * @param {string} content       The content to be saved.
 * @param {string} [dirname=""]  The directory name to save the file in.
 * @returns {Promise}  A promise that resolves when done.
 */
export function saveOutputToLocalForage(filename: string, content: string, dirname: string = ""): Promise<any> {
    if (typeof content !== "string") {
        alert("ERROR: Output content saved to LocalForage needs to be a string!");
        return;
    }

    let key = [outputPrefix, dirname, filename].join(delim);
    return getLocalForage()
    .then(() => { 
        return localforage.setItem(key, content); 
    })
}


/**
 * Saves the meta data to localForage (e.g., program run parameters).
 * @param {any} content  The data to be saved.
 * @returns {Promise}  A promise that resolves when done.
 */
export function saveMetaToLocalForage(content: any): Promise<any> {
    return getLocalForage()
    .then(() => { 
        return localforage.setItem("meta", content); 
    })
}

/**
 * Get the meta data from localForage.
 * @returns {Promise}  A promise that resolves with the metadata.
 */
export function loadMetaFromLocalForage(): Promise<any> {
    return localforage.getItem("meta");
}
// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2021 Jacob D. Durrant.

// For functions that don't really need to be within the Vue framework.

/**
 * Creates a new object with a property updated.
 * @param  {*}      obj  The original object.
 * @param  {string} key  The new key.
 * @param  {*}      val  The new value.
 * @returns *  A new object with the key/value updated.
 */
export function getNewObjWithUpdate(obj: any, key: string, val: any): any {
    let newObj = {};
    const keys = Object.keys(obj);
    const keysLen = keys.length;
    for (let i = 0; i < keysLen; i++) {
        const k = keys[i];
        const v = obj[k];
        if ((v !== undefined) && (v !== null) && (!isNaN(v))) {
            newObj[k] = v;
        }
    }
    newObj[key] = val;

    return newObj;
}

/**
 * Detect whether webassembly is supported.
 * @returns boolean  True if supported. False otherwise
 */
export function webAssemblySupported(): boolean {
    // https://stackoverflow.com/questions/47879864/how-can-i-check-if-a-browser-supports-webassembly
    try {
        if (typeof WebAssembly === "object"
            && typeof WebAssembly.instantiate === "function") {
            const module = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
            if (module instanceof WebAssembly.Module)
                return new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
        }
    } catch (e) {
    }
    return false;
};

/**
 * Get the path of the index.html file. Allows BINANA to run even fromm a
 * subdir.
 * @returns string  The path.
 */
export function curPath(): string {
    let url = window.location.pathname.replace("index.html", "");
    if (url.slice(url.length - 1) !== "/") {
        url = url + "/";
    }
    return url;
}

/**
 * Given a filename, replace its extension.
 * @param  {string} filename  The original filename.
 * @param  {string} newExt    The new extension.
 * @returns string  The new filename.
 */
 export function replaceExt(filename: string, newExt: string): string {
    if (filename.indexOf(".") !== -1) {
        let prts = filename.split(".");
        filename = prts.slice(0, prts.length - 1).join(".");
    }
    return filename + "." + newExt;
}


/**
 * Given a filename, gets its extension.
 * @param  {string} filename  The filename.
 * @returns string  The extension.
 */
 export function getExt(filename: string): string {
    if (filename.indexOf(".") !== -1) {
        let prts = filename.split(".");
        return prts.slice(prts.length - 1)[0];
    }
    return "";
}

export function dataURIToBlob(dataURI): Blob {
    // See https://stackoverflow.com/questions/12168909/blob-from-dataurl
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    var blob = new Blob([ab], {type: mimeString});
    return blob;
}

export function firstLetterCapital(sent: string): string {
    return sent.substring(0, 1).toUpperCase() + sent.substring(1)
}
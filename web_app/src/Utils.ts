// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2020 Jacob D. Durrant.


// For functions that don't really need to be within the Vue framework.

/**
 * Creates a new object with a property updated.
 * @param  {any}    obj  The original object.
 * @param  {string} key  The new key.
 * @param  {any}    val  The new value.
 * @returns any  A new object with the key/value updated.
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

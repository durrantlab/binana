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

/**
 * Given a filename, replace its extension.
 * @param  {string} filename  The original filename.
 * @param  {string} newExt    The new extension.
 * @returns string  The new filename.
 */
// TODO: Cruft?
// export function replaceExt(filename: string, newExt: string): string {
//     if (filename.indexOf(".") !== -1) {
//         let prts = filename.split(".");
//         filename = prts.slice(0, prts.length - 1).join(".");
//     }
//     return filename + "." + newExt;
// }

/**
 * Given some PDB text, keep only those lines that describe protein atoms.
 * @param  {string} pdbTxt  The original PDB text.
 * @returns string  the PDB text containing only the protein atoms.
 */
// TODO: Cruft?
// export function keepOnlyProteinAtoms(pdbTxt: string): string {
//     let proteinResidues = [
//         "ALA", "ARG", "ASH", "ASN", "ASP", "ASX", "CYM", "CYS", "CYX",
//         "GLH", "GLN", "GLU", "GLX", "GLY", "HID", "HIE", "HIP", "HIS",
//         "HSD", "HSE", "HSP", "ILE", "LEU", "LYN", "LYS", "MET", "MSE",
//         "PHE", "PRO", "SER", "THR", "TRP", "TYR", "VAL"
//     ];
//     let lines: string[] = pdbTxt.split("\n");
//     let l = lines.length;
//     let linesToKeep = "";
//     for (let i = 0; i < l; i++) {
//         if ((lines[i].substr(0, 5) !== "ATOM ") && (lines[i].substr(0, 7) !== "HETATM ")) {
//             // Not an atom line.
//             continue;
//         }

//         if (proteinResidues.indexOf(lines[i].substr(17,3)) !== -1) {
//             linesToKeep += lines[i] + "\n";
//         }
//     }

//     return linesToKeep;
// }

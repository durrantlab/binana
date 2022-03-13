// This file is released under the Apache 2.0 License. See
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2022
// Jacob D. Durrant.

import { getMol } from "../Mols";
import { ParentMol } from "../Mols/ParentMol";
import { IFileInfo, IFileLoadError } from "./Interfaces";

/**
 * Takes a string of extensions and returns an array of extensions.
 * @param  {string} exts  A string containing a list of extensions separated by
 *                        commas.
 * @returns array
 */
export function extsStrToList(exts: string): string[] {
    return exts
        .toLowerCase()
        .split(/,/g)
        .map(
            (e) => 
            e.replace(/ /g, "").replace(/\./, "")
        );
}

/**
 * Given a filename, return the basename of the file
 * @param {string}  filename          The filename to get the basename of.
 * @param {boolean} [extensive=true]  If true, considers multi-component
 *                                    extensions (e.g., .pdb.txt).
 * @returns {string}
 */
export function getBasename(filename: string, extensive = true): string {
    let ext = getExt(filename, extensive);
    return filename.substring(0, filename.length - ext.length - 1);
}

/**
 * Given a filename, return the extension of the file
 * @param {string}  filename          The filename to get the extension from.
 * @param {boolean} [extensive=true]  If true, considers multi-component
 *                                    extensions (e.g., .pdb.txt).
 * @returns {string}
 */
export function getExt(filename: string, extensive = true): string {
    if (filename === undefined) {
        return "";
    }
    
    let fileNameParts = filename.toLowerCase().split(/\./g);
    let ext = fileNameParts[fileNameParts.length - 1];

    if (extensive) {
        for (let i = fileNameParts.length - 2; i > 0; i--) {
            // Note that because length -2 and i > 0 (not i > -1), doesn't get
            // last (always included) or first (never included) parts. Assuming
            // here that if any part has more than four characters, no longer
            // extension. This is an arbitrary choice.
            let prt = fileNameParts[i];
            if (prt.length > 4) {
                break;
            }
            ext = prt + "." + ext;
        }
    }

    return ext;
}

/**
 * Get the type of a file given the extension.
 * @param {string}   ext                  The extension.
 * @param {string[]} [choices=undefined]  The file-type options.
 * @returns {string}  The detected type (one of the elements ni choices, if it's
 *                    given).
 */
export function getFileTypeFromExt(ext: string, choices: string[] = undefined): string {
    // Remove first letter from ext if it is "."
    if (ext.substring(0, 1) === ".") { ext = ext.substring(1); }
    
    // Get the extension parts
    let extPrts = ext.split(/\./g);
    
    if (choices === undefined) {
        return extPrts.pop().toLowerCase();
    }
    
    // Choices need to be lower case
    let choicesLowerCase = choices.map(c => c.toLowerCase());

    // In windows, text files often have the ".txt" extension, even if they are
    // other formats (e.g., pdb.txt).
    if (extPrts[extPrts.length - 1] === "txt") {
        // But if txt is one of the choicesLowerCase, choose that.
        if (choicesLowerCase.indexOf("txt") !== -1) {
            return "txt";
        }
        extPrts.pop();
    }

    let lastExtPrt = extPrts.pop();
    let idx = choicesLowerCase.indexOf(lastExtPrt);
    if (idx === -1) {
        // Not one of the choicesLowerCase
        return undefined;
    }
    
    return choices[idx];
}

// let fileType = getFileTypeFromExt(".pdb.txt", ["pdb"]);
// fileType = getFileTypeFromExt(".pdb.txt", ["pdb", "txt"]);
// fileType = getFileTypeFromExt(".pdb", ["pdb"]);
// fileType = getFileTypeFromExt(".pdb", undefined);

/**
 * Given a file object, returns a promise that resolves the text
 * in that file.
 * @param  {*} fileObj  The file object.
 * @returns Promise
 */
export function getFileObjContents(fileObj): Promise<string> {
    return new Promise((resolve, reject) => {
        var fr = new FileReader();
        fr.onload = () => {
            // @ts-ignore: Not sure why this causes Typescript problems.
            var data = new Uint8Array(fr.result);
            resolve(new TextDecoder("utf-8").decode(data));
        };
        fr.readAsArrayBuffer(fileObj);
    });
}

/**
 * Loads a remote file and sends it to the relevant Vue component.
 * @param {string} url      The URL of the remote file to load.
 * @param {*}      vueComp  The Vue component.
 * @returns {Promise<boolean>}
 */
export function loadRemote(url: string, vueComp: any): Promise<boolean> {
    let urlUpper = url.toUpperCase();
    if (
        (urlUpper.slice(0, 7) !== "HTTP://") && 
        (urlUpper.slice(0, 8) !== "HTTPS://")
    ) {
        vueComp.onError({
            title: "Bad URL",
            body: `The URL should start with http:// or https://.`
        } as IFileLoadError);
        return Promise.resolve(false);
    }
    
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    vueComp.onError({
                        title: "Bad URL",
                        body: `Could not load the URL ${url}. Status ` + response.status.toString() + ": " + response.statusText
                    } as IFileLoadError);
                    resolve(false);
                } else {
                    return response.text()
                }
            })
            .then(text => {
                let flnm = url.split("/").pop();
    
                let filesInfo: IFileInfo[] = [{
                    filename: flnm,
                    mol: getMol(flnm, text)
                } as IFileInfo]
                
                let allFilesLoaded = vueComp.onFilesLoaded(filesInfo);
                
                // false if invalid files or something.
                resolve(allFilesLoaded);
            })
            .catch((err) => {
                vueComp.onError({
                    title: "Bad URL",
                    body: `Could not load the URL ${url}: ` + err.message
                } as IFileLoadError);
                resolve(false);
            });
    })
}

/**
 * Add a CSS string to the document's head
 * @param {string} css  The CSS to be added to the page.
 */
export function addCSS(css: string): void {
    document.head.appendChild(Object.assign(
        document.createElement("style"), {
        textContent: css
    }));
}

/**
 * Takes a string and converts it to lowercase, replaces any non-alphanumeric
 * characters with dashes, and replaces any double dashes with a single dash.
 * @param   {string} complexString  The string to be slugified.
 * @returns {string}
 */
export function slugify(complexString: string): string {
    // With help from codex
    var slug = complexString.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    slug = slug.replace(/\-\-/g, "-");
    return slug;
}

export function deepCopy(obj: any): any {
    return Object.assign({}, obj);
}


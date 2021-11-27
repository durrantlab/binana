// This file is released under the Apache 2.0 License. See
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2021
// Jacob D. Durrant.

import { IFileInfo, IFileLoadError } from "./Interfaces";

export function extsStrToList(exts: string): string[] {
    return exts
        .toLowerCase()
        .split(/,/g)
        .map(
            (e) => 
            e.replace(/ /g, "").replace(/\./, "")
        );
}

export function getExt(filename: string): string {
    let fileNameParts = filename.toLowerCase().split(/\./g);
    let ext = fileNameParts[fileNameParts.length - 1];
    return ext;
}

/**
 * Given a file object, returns a promise that resolves the text
 * in that file.
 * @param  {*} fileObj  The file object.
 * @returns Promise
 */
export function getFileObjContents(fileObj): Promise<any> {
    return new Promise((resolve, reject) => {
        var fr = new FileReader();
        fr.onload = () => {
            // @ts-ignore: Not sure why this causes Typescript problems.
            var data = new Uint8Array(fr.result);
            resolve(new TextDecoder("utf-8").decode(data));
        };
        fr.readAsArrayBuffer(fileObj);

        // Reset the show non-protein atom's link.
        // if (this["id"] === "receptor") {
        //     this.$store.commit("setVar", {
        //         name: "showKeepProteinOnlyLink",
        //         val: true,
        //     });
        // }
    });
}

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
                    fileContents: text
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

export function deepCopy(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
}

export function addCSS(css: string): void {
    document.head.appendChild(Object.assign(
        document.createElement("style"), {
        textContent: css
    }));
}

export function slugify(complexString: string): string {
    // With help from codex
    var slug = complexString.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return slug;
}
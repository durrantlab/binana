// This file is released under the Apache 2.0 License. See
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2021
// Jacob D. Durrant.

import { IFileInfo, IFileLoadError } from "../../../Common/Interfaces";
import { extsStrToList, getExt } from "../../../Common/Utils";
import { getAtomLines } from "../../../ProteinProcessing.Vue/PDBUtils";

export function processFiles(filesInfo: IFileInfo[]): boolean {
    // In this function, this is a vue component.

    // Check if the file extension is ok.
    let exts = filesInfo.map(f => getExt(f.filename));
    let acceptableExts = extsStrToList(this["accept"]);
    let convertExts = extsStrToList(this["convert"]);

    // Categorize the files

    let files = {
        convertNeeded: [],
        invalidFiles: [],
        acceptablefiles: []
    }

    const extsLen = exts.length;
    for (let i = 0; i < extsLen; i++) {
        const ext = exts[i];
        let fileInfo = filesInfo[i];

        if (convertExts.indexOf(ext) !== -1) {
            // It's one of the file formats that needs to be converted.
            files.convertNeeded.push(fileInfo);
        } else if (acceptableExts.indexOf(ext) === -1) {
            // It is not one of the acceptable extensions. It's in an
            // unacceptable format.
            files.invalidFiles.push(fileInfo);
        } else {
            // It's already in the required format. Load it.
            files.acceptablefiles.push(...splitPDBLikeFile(fileInfo, this["multipleFiles"]));
        }
    }

    // Before anything, check for invalid files. Because you won't proceed
    // otherwise.
    let allFilesValid = checkInvalidFiles(
        files.invalidFiles, exts, acceptableExts, convertExts, this
    );
    if (!allFilesValid) {
        return false;
    }

    // Convert any files that need converting, one at a time.
    if (files.convertNeeded.length > 0) {
        // Set the updated filename.
        this.onStartConvertFiles(files.convertNeeded);
    }

    // If it gets here, the file is in the right format and can be
    // loaded.
    if (files.acceptablefiles.length > 0) {
        // Need to do it this way so effectively nextTick between each fire.
        let fireOffNextFileReady = () => {
            if (files.acceptablefiles.length > 0) {
                let acceptablefile = files.acceptablefiles.pop();
                this.onFileReady(acceptablefile);
                setTimeout(fireOffNextFileReady, 100);
            }
        }

        fireOffNextFileReady();
    }

    return true;

    // If it gets here, the file is in the right format and can be loaded.
    // this["files"] = vals;

    // getFileObjContents(this["files"]).then((text: string) => {
    //     onFileReady(val["name"], text, true);

    //     // Smooth to the bottom of the list in a bit...
    //     setTimeout(() => {
    //         let div = (this.$refs["filesDiv"] as HTMLDivElement);
    //         div.scrollTo({
    //             top: div.clientHeight,
    //             left: 0,
    //             behavior: 'smooth'
    //         });
    //     }, 500);
    // });
}

function checkInvalidFiles(invalidFiles: IFileInfo[], exts: string[], acceptableExts: string[], convertExts: string[], vueComp: any): boolean {
    // Throw an error for any invalid files. In this case, load no file
    // (even valid ones).
    if (invalidFiles.length > 0) {
        let allExtsAllowed = acceptableExts.concat(convertExts);

        let msg = "The file(s) must end in ";
        if (allExtsAllowed.length > 1) {
            allExtsAllowed[allExtsAllowed.length - 1] =
                "or " + allExtsAllowed[allExtsAllowed.length - 1];
        }

        let okFilesString: string;
        if (allExtsAllowed.length > 2) {
            okFilesString = allExtsAllowed.join('," "');
        } else {
            okFilesString = allExtsAllowed.join('" "');
        }

        let uniq = exts
            .filter((item, pos) => exts.indexOf(item) === pos)
            .map(e => '"' + e + '"');

        okFilesString = okFilesString.replace(/"or /g, 'or "');
        msg += '"' + okFilesString + '." Your file(s) end in ' + uniq.join(", ");

        vueComp.onError({
            title: "Invalid File Extension!", 
            body: msg
        } as IFileLoadError)

        return false;
    }
    return true;
}

function splitPDBLikeFile(fileInfo: IFileInfo, multipleFiles: boolean): IFileInfo[] {
    //2M30
    // Some files are PDB like and might have multiple frames. Good to split
    // those.
    let pdbTxt = fileInfo.fileContents;
    if (pdbTxt.match(/^(ATOM|HETATM)/gm) != null) {
        // Let's assume it's a pdb. Thanks codex.
        let pdbTxtModels = pdbTxt.split(/^(MODEL\s+?\d+?\s+?|ENDMDL\s+?)$/gm);
        let fileInfos: IFileInfo[] = [];
        for (let pdbTxtModel of pdbTxtModels) {
            let atomLines = getAtomLines(pdbTxtModel);
            if (atomLines.length > 0) {
                pdbTxtModel = atomLines.join("\n");
                fileInfos.push({
                    filename: fileInfo.filename,
                    fileContents: pdbTxtModel
                });
            }
        }

        // Rename files if more than one.
        if (fileInfos.length > 1) {
            for (let i = 0; i < fileInfos.length; i++) {
                fileInfos[i].filename = fileInfos[i].filename + ".model" + (i + 1).toString() + ".pdb";
            }
        }

        if (!multipleFiles) {
            // Keep only first one.
            fileInfos = fileInfos.slice(0, 1);
        } else {
            fileInfos.reverse();
        }

        return fileInfos;
    }

    // Just return in a list if not pdb.
    return [fileInfo];
}
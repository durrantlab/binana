// This file is released under the Apache 2.0 License. See
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2022
// Jacob D. Durrant.

import { IFileInfo, IFileLoadError } from "../../../../Common/Interfaces";
import { extsStrToList, getExt, getFileTypeFromExt } from "../../../../Common/Utils";

/**
 * Given a list of file infos, process them and return true if all files were
 * processed successfully. Processing means validating extensions, separating
 * into files that need to be converted vs. just loaded, etc.
 * @param {IFileInfo[]} filesInfo  An array of objects that contain information
 *                                 about the files that.
 * @returns {boolean}
 */
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

        if (getFileTypeFromExt(ext, convertExts)) {
            // It's one of the file formats that needs to be converted.
            files.convertNeeded.push(fileInfo);
        } else if (getFileTypeFromExt(ext, acceptableExts) === undefined) {
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

    // If it gets here, the file is in the right format and can be loaded.
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
}

/**
 * Check if files are valid. Throw an error for any invalid files. In this case,
 * load no file (even valid ones).
 * @param {IFileInfo[]} invalidFiles    An array of invalid-file infos.
 * @param {string[]}    exts            The file extensions that were found in
 *                                      the file list.
 * @param {string[]}    acceptableExts  The file extensions that are allowed to
 *                                      be loaded.
 * @param {string[]}    convertExts     The file extensions that should be
 *                                      converted to the acceptableExts.
 * @param {*}           vueComp         The associated Vue component.
 * @returns {boolean}  Whether or not the files are valid.
 */
function checkInvalidFiles(invalidFiles: IFileInfo[], exts: string[], acceptableExts: string[], convertExts: string[], vueComp: any): boolean {
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

/**
 * If the file is a PDB-like file, split it into multiple frames.
 * @param {IFileInfo} fileInfo     The info of the file that should be split
 *                                 into frames.
 * @param {boolean} multipleFiles  Whether multiple files are permitted. If so,
 *                                 each frame becomes its own file. Otherwise,
 *                                 just keeps the first frame.
 * @returns A list of fileInfo objects, one for each frame.
 */
function splitPDBLikeFile(fileInfo: IFileInfo, multipleFiles: boolean): IFileInfo[] {
    // Some files are PDB like and might have multiple frames. Good to split
    // those. For example, 2M30.
    let fileInfos: IFileInfo[] = [];
    for (let frameIdx in fileInfo.mol.frames) {
        fileInfos.push({
            filename: fileInfo.filename,
            mol: fileInfo.mol.frameToMol(parseInt(frameIdx))
        });
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
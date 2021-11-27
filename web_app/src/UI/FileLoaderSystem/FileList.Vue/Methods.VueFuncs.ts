// This file is released under the Apache 2.0 License. See
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2021
// Jacob D. Durrant.

import { deepCopy } from "../Common/Utils";

/** An object containing the vue-component methods functions. */
export let fileLoaderFileListMethodsFunctions = {
    "fileDismissed"(filename) {
        // removeFileFromDatabase(this["id"], filename, this["associatedFileLoaderComponent"])
        let files = deepCopy(this["value"]);
        let keys = Object.keys(files);
        let idx = keys.indexOf(filename);
        let newIdx = (idx === 0) ? idx + 1 : idx - 1;
        let newFilename = keys[newIdx];
        this["fileNameClicked"](newFilename);

        delete files[filename];

        this.$emit("input", files);
        this.$emit("onSelectedFilenameChange", newFilename);

        // this.$nextTick(() => {
        //     this.$emit("onRequestRemoveFile", filename);
        // });
    },

    "clearAll"(): void {
        // Clears all entries in the list.
        // this.$emit("onRequestRemoveAllFiles");

        this.$emit("input", {});
        this.$emit("onSelectedFilenameChange", "");

        // clearAllInDatabase(this["id"]);
        // clearAllInDatabase();
    },

    // ...dbVueFuncs,

    "fileNameClicked"(filename: string): void {
        // this.loadSingleFileFromIndexedDB(filename, this["associatedFileLoaderComponent"]);
        this["currentlySelectedFilenameToUse"] = filename;
        
        this.$nextTick(() => {
            this.$emit("onSelectedFilenameChange", filename);
            // this.$emit("onSelectFile", {
            //     filename: filename,
            //     fileContents: this["files"][filename]
            // } as IFileInfo);
        });
    },

    "scrollToBottom"(): void {
        setTimeout(() => {
            let div = (this.$refs["filesDiv"] as HTMLDivElement);
            div.scrollTo({
                top: div.clientHeight,
                left: 0,
                behavior: 'smooth'
            });
        }, 500);
    },
};

// This file is released under the Apache 2.0 License. See
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2021
// Jacob D. Durrant.

import { IConvert, IFileInfo, IFileLoadError } from "../../Common/Interfaces";
import { deepCopy } from "../../Common/Utils";

// Note that plugin emits (with same name) are present in PluginParent.ts. These
// emit from the encapsulating FileLoader itself.

// These functions are called when plugin children emit data. They process that
// data a bit if necessary and emit it to the encompassing component
// (FileLoaderWrapper). Like relay functions.
export let fileLoaderEmitFunctions = {
    // Start converting files that need to be converted.
    "onStartConvertFiles": function(val: IConvert): void {
        this.$emit("onStartConvertFiles", val);
    },

    // When an error occurs, handle that as well. No need to process. Just pass
    // up the chain.
    "onError": function(val: IFileLoadError): void {
        this.$emit("onError", val);
    },

    // When the file is completely ready, after any conversion, error handling,
    // etc. Fires for every file loaded.
    "onFileReady": function(val: IFileInfo): void {
        let files = {};
        
        // If multiple not files allowed, copy current files.
        if (this["multipleFiles"] !== false) {
            files = deepCopy(this["value"]);
        }

        // Add this file to the object containing all files
        files[val.filename] = val.fileContents;
        // this["selectedFilename"] = val.filename;

        // Send all the data up the chain (via v-bind).
        this.$emit("input", files);
        this.$emit("onSelectedFilenameChange", val.filename);

        // this.$emit("onFileReady", {
        //     selectedFilename: val.filename,
        //     allFiles: files
        // } as IAllFiles);
    },
}

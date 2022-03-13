// This file is released under the Apache 2.0 License. See
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2022
// Jacob D. Durrant.

import { IConvert, IFileInfo, IFileLoadError } from "../../Common/Interfaces";

// Note that plugin emits (with same name) are present in PluginParent.ts. These
// emit from the encapsulating FileLoader itself.

// These functions are called when plugin children emit data. They process that
// data a bit if necessary and emit it to the encompassing component
// (FileLoaderWrapper). Like relay functions.
export let fileLoaderEmitFunctions = {
    /**
     * This is a relay function. Start converting files that need to be
     * converted.
     * @param {IConvert} val
     */
    "onStartConvertFile": function(val: IConvert): void {
        this.$emit("onStartConvertFile", val);
    },

    /**
     * This is a relay function. When an error occurs, handle that as well. No
     * need to process. Just pass up the chain.
     * @param  {IFileLoadError} val  The error information.
     * @returns void
     */
    "onError": function(val: IFileLoadError): void {
        this.$emit("onError", val);
    },

    /**
     * When the file is completely ready, after any conversion, error handling,
     * etc. Fires for every file loaded.
     * @param {IFileInfo} val  The file information.
     */
    "onFileReady": function(val: IFileInfo): void {
        this.$set(this["value"], val.filename, val.mol);

        // Send all the data up the chain (via v-bind).
        this.$emit("input", this["value"]);
        this.$emit("onSelectedFilenameChange", val.filename);
    },
}

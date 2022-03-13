// This file is released under the Apache 2.0 License. See
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2022
// Jacob D. Durrant.

import { fileLoaderInputComputedFunctions } from "./Computed.VueFuncs";
import { fileLoaderInputMethodsFunctions } from "./Methods.VueFuncs";
import { fileLoaderInputMountedFunction } from "./Mounted.VueFuncs";
import { FileLoaderPluginParent } from "../PluginParent/PluginParent";
import { commonFileLoaderProps } from "../../../../Common/CommonProps.VueFuncs";

export class FileLoaderInputPlugin extends FileLoaderPluginParent {
    tag = "file-loader-input";
    tabName = "File";
    defaultPlaceHolder = "Choose a file or drop it here...";

    /**
     * How to clear the entry after a file has loaded.
     */    
    clearEntryAfterLoad = function() {}
    
    template = /*html*/ `
        <div>
            <b-form-file
                ref="fileInput"
                v-model="val"
                :state="valid"
                :placeholder="placeholder"
                drop-placeholder="Drop file here..."
                :class="id"
                :required="required"
                :file-name-formatter="formatFileNames"
                :multiple="true"
            ></b-form-file>
        </div>`;
    
    data = function() {
        return {
            "files": null
        };
    }

    methods = fileLoaderInputMethodsFunctions;
    
    props = {
        ...commonFileLoaderProps
    };

    computed = fileLoaderInputComputedFunctions;

    mounted = fileLoaderInputMountedFunction
}

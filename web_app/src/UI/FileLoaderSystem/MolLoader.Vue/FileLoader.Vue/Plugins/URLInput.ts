// This file is released under the Apache 2.0 License. See
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2022
// Jacob D. Durrant.

import { commonFileLoaderProps } from "../../../Common/CommonProps.VueFuncs";
import { loadRemote } from "../../../Common/Utils";
import { FileLoaderPluginParent } from "./PluginParent/PluginParent";

export class URLInputPlugin extends FileLoaderPluginParent {
    tag = "url-input";
    tabName = "URL";
    defaultPlaceHolder = "Type your URL here...";

    /**
     * How to clear the entry after a file has loaded.
     */    
    clearEntryAfterLoad = function() {
        this["val"] = "";
    }
    template = /*html*/ `
        <file-loader-text-input
            v-model="val"
            ref="textInput"
            :placeholder="placeholder"
            @onLoad="loadUrl"
            :valid="valid"
        >
        </file-loader-text-input>`;
    
    data = function() {
        return {
            "val": ""
        };
    }

    methods = {
        /**
         * Loads a remote file.
         * @param {string} url  The URL to load.
         */
        "loadUrl"(url: string): void {
            loadRemote(url, this).then((success) => {});
        }
    };
    
    props = {
        ...commonFileLoaderProps,
    };
}

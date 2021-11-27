// This file is released under the Apache 2.0 License. See
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2021
// Jacob D. Durrant.

import { commonFileLoaderProps, FileLoaderPluginParent } from "./PluginParent/PluginParent";
import { loadRemote } from "../../Common/Utils";

export class URLInputPlugin extends FileLoaderPluginParent {
    tag = "url-input";
    tabName = "URL";
    defaultPlaceHolder = "Type your URL here...";
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
        "loadUrl"(url: string): void {
            loadRemote(url, this).then((success) => {
                if (!success) {
                    console.warn("evaluate");
                    // this.$refs["textInput"]["clearText"]();
                }
            });
        }
    };
    
    props = {
        ...commonFileLoaderProps,
        // "selectedFilename": {
        //     "type": String,
        //     "default": ""
        // },
        // "associatedFileLoaderComponent": {
        //     "type": Object,
        //     "default": undefined
        // }
    };

    // computed = {};

    // mounted = () => {}
}

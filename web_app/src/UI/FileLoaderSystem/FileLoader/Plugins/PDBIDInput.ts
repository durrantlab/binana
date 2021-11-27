// This file is released under the Apache 2.0 License. See
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2021
// Jacob D. Durrant.

import { commonFileLoaderProps, FileLoaderPluginParent } from "./PluginParent/PluginParent";
import { loadRemote } from "../../Common/Utils";
export class PDBIDInputPlugin extends FileLoaderPluginParent {
    tag = "pdb-id-input";
    tabName = "PDB";
    defaultPlaceHolder = "Type your four-character PDB ID here...";
    clearEntryAfterLoad = function() {
        this["val"] = "";
    }
    template = /*html*/ `
        <file-loader-text-input
            v-model="val"
            ref="textInput"
            :placeholder="placeholder"
            :formatter="formatter"
            @onLoad="loadPdb"
            :btnDisabledFunc="btnDisabledFunc"
            :valid="valid"
        >
        </file-loader-text-input>`;
    
    data = function() {
        return {
            "val": ""
        };
    }

    methods = {
        "loadPdb"(pdbid): void {
            let url = `https://files.rcsb.org/view/${pdbid.toUpperCase()}.pdb`;
            loadRemote(url, this).then((success) => {
                if (!success) {
                    console.warn("evaluate");
                    // this.$refs["textInput"]["clearText"]();
                }
                // return Promise.resolve();
            });
        },
        "formatter"(text: string): string {
            text = text.toUpperCase();
            text = text.slice(0, 4);
            return text;
        },
        "btnDisabledFunc"(text: string): boolean {
            return text.length !== 4
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

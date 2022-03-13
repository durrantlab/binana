// This file is released under the Apache 2.0 License. See
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2022
// Jacob D. Durrant.

import { loadRemote } from "../../../Common/Utils";
import { commonFileLoaderProps } from "../../../Common/CommonProps.VueFuncs";
import { FileLoaderPluginParent } from "./PluginParent/PluginParent";

export class PDBIDInputPlugin extends FileLoaderPluginParent {
    tag = "pdb-id-input";
    tabName = "PDB";
    defaultPlaceHolder = "Type your four-character PDB ID here...";
    
    /**
     * How to clear the entry after a file has loaded.
     */    
    clearEntryAfterLoad = function(): void {
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
        /**
         * Loads a PDB file from the RCSB
         * @param {string} pdbid The PDB ID.
         */
        "loadPdb"(pdbid: string): void {
            let url = `https://files.rcsb.org/view/${pdbid.toUpperCase()}.pdb`;
            loadRemote(url, this).then((success) => {});
        },

        /**
         * Enforces PDB ID formatting (four upper-case letters).
         * @param {string} text  The PDB ID.
         * @returns The reformatted PDB ID.
         */
        "formatter"(text: string): string {
            text = text.toUpperCase();
            text = text.slice(0, 4);
            return text;
        },

        /**
         * If the length of the text is not equal to 4, disable the button.
         * Otherwise, enabled.
         * @param {string} text  The text to evaluate.
         * @returns A boolean value, whether to disable the button.
         */
        "btnDisabledFunc"(text: string): boolean {
            return text.length !== 4
        }
    };
    
    props = {
        ...commonFileLoaderProps,
    };
}

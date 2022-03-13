// This file is released under the Apache 2.0 License. See
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2022
// Jacob D. Durrant.

import { addCSS } from "../../Common/Utils";
import { fileLoaderFileListMethodsFunctions } from "./Methods.VueFuncs";

declare var Vue;

/** An object containing the vue-component computed functions. */
let computedFunctions = {
    /**
     * Return the filenames of the currently loaded molecules.
     * @returns {string[]}
     */
    "filenames"(): string[] {
        return Object.keys(this["value"]);
    }
};

/**
 * The vue-component mounted function.
 * @returns void
 */
function mountedFunction(): void {
    // Add some CSS
    addCSS(`.alert-dismissible { padding: 0.15rem !important;} .alert-dismissible .close {padding-top: 1px; padding-right: 8px; padding-left: 8px; padding-bottom: 0;}`);
}

/**
 * Setup the file-list Vue commponent.
 * @returns void
 */
export function setupFileList(): void {
    Vue.component("file-list", {
        /**
         * Get the data associated with this component.
         * @returns any  The data.
         */
        "data"(): any {
            return {
                "currentlySelectedFilenameToUse": ""
            };
        },
        "watch": {
            /**
             * When the selectedFilename property changes, call the
             * fileNameClicked method with the new value.
             * @param {string} newVal  The new value of the property.
             * @param {string} oldVal  The old value of the property.
             */
            "selectedFilename"(newVal: string, oldVal: string): void {
                this["fileNameClicked"](newVal);
            }
        },
        "methods": fileLoaderFileListMethodsFunctions,
        "template": /*html*/ `
            <div>
                <div 
                    ref="filesDiv" 
                    style="max-height:135px; overflow-y:scroll;" 
                    :class="filenames.length > 0 ? 'mt-2' : ''"
                >
                    <b-alert 
                        v-for="filename in filenames"
                        :key="filename"
                        class="mb-1 p-3 py-3"
                        dismissible
                        fade
                        show
                        :variant="(filename === currentlySelectedFilenameToUse) ? 'primary' : 'secondary'"
                        @dismissed="fileDismissed(filename)"
                    >
                        <div style="cursor:pointer; position:relative; top:0px; left:4px;" @click="fileNameClicked(filename)">
                            <div style="display:inline; position:relative: top:2px;">&#128206; &nbsp;</div> {{filename}}
                        </div>
                    </b-alert>
                </div>
                <div 
                    v-if="filenames.length > 1"
                    style="height:22.5px;"
                >
                    <b-form-tag
                        style="padding-top:3px; cursor:pointer; position:relative; top:1px; float:right;"
                        :no-remove="true"
                        :pill="true"
                        @click.native="clearAll"
                    >Clear All</b-form-tag>
                </div>
            </div>
        `,
        "props": {
            "selectedFilename": {
                "type": String,
                "default": ""
            },
            "id": {
                "type": String,
                "default": undefined
            },

            // for v-model
            "value": {
                "type": Object,
                "default": {}
            }
        },
        "computed": computedFunctions,

        /**
         * Runs when the vue component is mounted.
         * @returns void
         */
        "mounted": mountedFunction,
    });
}

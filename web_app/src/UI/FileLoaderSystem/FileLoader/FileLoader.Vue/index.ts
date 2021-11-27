// This file is released under the Apache 2.0 License. See
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2021
// Jacob D. Durrant.

import { FileLoaderInputPlugin } from "../Plugins/FileLoaderInput.Vue";
import { fileLoaderEmitFunctions } from "./Emits.VueFuncs";
import { fileLoaderMethodsFunctions } from "./Methods.VueFuncs";
import { fileLoaderMountedFunction } from "./Mounted.VueFuncs";
import { fileLoaderPropsFunctions } from "./Props.VueFuncs";
import { FileLoaderPluginParent } from "../Plugins/PluginParent/PluginParent";
import { setupFileLoaderTextInput } from "../../Common/FileLoaderTextInput";

declare var Vue;

let plugins: FileLoaderPluginParent[] = [];

let getPluginsStr = () => {
    switch (plugins.length) {
        case 0:
            return "";
        case 1:
            return plugins[0].create()
        default:
            // More than one plugin loaded.
            let str = `<span v-if="fileLoaderPlugins.length > 1">
                <b-tabs>`;

            // What if only one tab in fileLoaderPlugins? Need to not show tabs in that case.

            let i = 1;
            for (let plugin of plugins) {
                str += `
                    <b-tab 
                        v-if="fileLoaderPlugins.indexOf('${plugin.tag}') !== -1"
                        v-model="tabIndex" 
                        key="${plugin.tabName}" 
                        style="margin-top:-1px;" 
                        title="${plugin.tabName}"
                    >
                        ${plugin.create(i)}
                    </b-tab>`;
                i++;
            }

            str += `</b-tabs>
                </span>
                <span v-else>`;

            i = 1;
            for (let plugin of plugins) {
                str += `
                    <div
                        v-if="fileLoaderPlugins.indexOf('${plugin.tag}') !== -1"
                        key="${plugin.tabName}" 
                    >
                        ${plugin.create(i)}
                    </div>`;
                i++;
            }

            str += `</span>`;

            return str;
    }
}

/** An object containing the vue-component computed functions. */
let computedFunctions = {
    "isValid"(): boolean {
        let valid = (this["required"] === false) || (Object.keys(this["value"]).length !== 0);
        return valid ? null : valid;
    },
    "filenameToShow"(): string {
        if (this["multipleFiles"] === true) {
            return "";
        } else {
            return this["selectedFilename"];
        }
    }
};

/**
 * Setup the file-loader Vue commponent.
 * @returns void
 */
export function setup(pluginList=undefined): void {
    plugins = pluginList;
    if (plugins === undefined) {
        plugins = [
            new FileLoaderInputPlugin().setup(),
        ];
    }

    setupFileLoaderTextInput();

    Vue.component("file-loader", {
        /**
         * Get the data associated with this component.
         * @returns any  The data.
         */
        "data"(): any {
            return {
                "tabIndex": 0,
            };
        },
        "methods": {
            ...fileLoaderMethodsFunctions,
            ...fileLoaderEmitFunctions
        },
        "template": /*html*/ `
            <span>
                <file-loader-form-group
                    :label="label"
                    :id="'input-group-' + id"
                    :description="description"
                    styl="line-height:0;"
                >
                    <template v-slot:extraDescription>
                        <slot name="extraDescription"></slot>
                    </template>

                    ${getPluginsStr()}

                    <small 
                        v-if="isValid === false" 
                        alert tabindex="-1" 
                        class="text-danger form-text"
                    >{{invalidMsg}}</small>
                </file-loader-form-group>
            </span>
        `,
        "props": fileLoaderPropsFunctions,
        "computed": computedFunctions,

        /**
         * Runs when the vue component is mounted.
         * @returns void
         */
        "mounted": fileLoaderMountedFunction,
    });
}

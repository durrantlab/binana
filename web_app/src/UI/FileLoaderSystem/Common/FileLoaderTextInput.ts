// This file is released under the Apache 2.0 License. See
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2021
// Jacob D. Durrant.

declare var Vue;

/**
 * Setup the file-loader-text-input Vue commponent.
 * @returns void
 */
export function setupFileLoaderTextInput(): void {
    Vue.component("file-loader-text-input", {
        /**
         * Get the data associated with this component.
         * @returns any  The data.
         */
        "data"(): any {
            return {
                "localValue": ""
            };
        },
        "methods": {
            "onLoad"(): void {
                this.$emit("onLoad", this["value"]);
            },
            "keydown"(e: KeyboardEvent): void {
                if (e.key === "Enter") {
                    this["onLoad"]();
                }
            },
            "keyup"(e: KeyboardEvent) : void {
                this.$emit("input", this["localValue"]);
            }
            // "clearText"(): void {
            //     this["val"] = "";
            // }
        },
        "template": /*html*/ `
            <b-input-group>
                <b-form-input 
                    v-model="localValue"
                    style="border-top-left-radius:4px; border-bottom-left-radius:4px;"
                    :placeholder="placeholder"
                    :formatter="formatter"
                    @keydown="keydown"
                    @keyup="keyup"
                    :state="valid"
                ></b-form-input>
                <b-input-group-append>
                    <b-button 
                        style="background-color:#e9ecef; color:#4a5056; border:1px solid #ced4da; border-top-right-radius:4px; border-bottom-right-radius:4px;"
                        variant="outline-primary"
                        @click="onLoad"
                        :disabled="btnDisabledFunc(value)"
                    >
                        Load
                    </b-button>
                </b-input-group-append>
            </b-input-group>`,
        "props": {
            "placeholder": {
                "type": String,
                "default": "Type here...",
            },
            "formatter": {
                "type": Function,
                "default": (t) => {return t;}
            },
            "btnDisabledFunc": {
                "type": Function,
                "default": () => {return false;}
            },
            "valid": {
                "type": Boolean,
                "default": true
            },
            "value": {
                "type": String,
                "default": ""
            }
        },
        "computed": {},

        /**
         * Runs when the vue component is mounted.
         * @returns void
         */
        "mounted": () => {},
    });
}

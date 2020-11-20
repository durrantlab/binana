// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2020 Jacob D. Durrant.


declare var Vue;

/** An object containing the vue-component computed functions. */
let computedFunctions = {
    /** Gets and sets the binanaParams object. */
    "val": {
        get(): any {
            return this.$store.state["binanaParams"][this["id"]];
        },

        set(val: any): void {
            this.$store.commit("setBinanaParam", {
                name: this["id"],
                val: val
            });
        }
    },

    /**
     * Generates a description string.
     * @returns string  The description.
     */
    "desc"(): string {
        return this["description"]  //  + (this["required"] !== true ? " (Leave blank to use default value.)" : "");
    }
}

/**
 * Setup the check-box Vue commponent.
 * @returns void
 */
export function setup(): void {
    Vue.component('check-box', {
        /**
         * Get the data associated with this component.
         * @returns any  The data.
         */
        "data": function() {
            return {}
        },
        "computed": computedFunctions,
        "template": `
            <b-form-checkbox
                :id="id"
                v-model="val"
                :name="id"
                :value="true"
                :unchecked-value="false"
            >
                {{label}}
            </b-form-checkbox>
        `,
        "props": {
            "label": String,
            "id": String,
        }
    })
}

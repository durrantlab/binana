// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2020 Jacob D. Durrant.


declare var Vue;

/** An object containing the vue-component computed functions. */
let computedFunctions = {
    /** Gets and sets the binanaParams object. In setting, also makes sure that
     * the value meets min/max requirements, etc.*/
    "val": {
        get(): any {
            return this.$store.state["binanaParams"][this["id"]];
        },

        set(val: any): void {
            // Save the value to the store
            val = (val === "") ? undefined : +val;
            if (isNaN(val)) {
                val = undefined;
            }
            this.$store.commit("setBinanaParam", {
                name: this["id"],
                val: val
            });

            // Determine if it is valid. First, make sure there's
            // something here if its required.
            let valid = true;
            let scoreOnly = this.$store.state["binanaParams"]["score_only"];
            if ((this["required"] === true) && (scoreOnly !== true)) {
                this["invalidMsg"] = "This field is required.";
                valid = val !== undefined;
            }

            // Check if min or max requirements met.
            if ((valid === true) && (this["min"] !== undefined) && (this["min"] > val)) {
                this["invalidMsg"] = "Value must be &ge; " + this["min"].toString() + ".";
                valid = false;
            }

            if ((valid === true) && (this["max"] !== undefined) && (this["max"] < val)) {
                this["invalidMsg"] = "Value must be &le; " + this["max"].toString() + ".";
                valid = false;
            }

            this.$store.commit("setValidationParam", {
                name: this["id"],
                val: valid
            });
        }
    },

    /**
     * Generates a description string.
     * @returns string  The description.
     */
    "desc"(): string {
        let toAdd = "";
        return this["description"] + toAdd;
    },

    /**
     * Determine whether the component value is valid.
     * @returns boolean  True if it is valid, false otherwise.
     */
    "isValid"(): boolean {
        let val = this.$store.state["validation"][this["id"]];
        return val;
    }
}

/**
 * The vue-component mounted function.
 * @returns void
 */
function mountedFunction(): void {
    // Always start by assuming it validates fine.
    if (this.$store.state["validation"][this["id"]] === undefined) {
        this.$store.commit("setValidationParam", {
            name: this["id"],
            val: !this["required"]
        });
    }

    // Set value if it is given.
    if (this["default"] !== undefined) {
        this.$store.commit("setBinanaParam", {
            name: this["id"],
            val: this["default"]
        });
    }
}

/**
 * Setup the numeric-input Vue commponent.
 * @returns void
 */
export function setup(): void {
    Vue.component('numeric-input', {
        /**
         * Get the data associated with this component.
         * @returns any  The data.
         */
        "data": function() {
            return {
                "invalidMsg": "This field is required."
            }
        },
        "computed": computedFunctions,
        "template": `
            <form-group
                :label="label"
                :id="'input-group-' + id"
                :style="styl"
                :description="desc"
                :formGroupWrapper="formGroupWrapper"
            >
                <b-form-input
                    :id="id"
                    :name="id"
                    v-model="val"
                    type="number"
                    :required="required"
                    :placeholder="placeholder"
                    :class="{ 'is-invalid': !isValid }"
                    :min="min" :max="max"
                ></b-form-input>
                <small v-if="!isValid" alert tabindex="-1" class="text-danger form-text" v-html="invalidMsg"></small>
            </form-group>
        `,
        "props": {
            "label": String,
            "id": String,
            "description": String,
            "placeholder": String,
            "required": Boolean,
            "styl": String,
            "default": Number,
            "formGroupWrapper": {
                "type": Boolean,
                "default": true
            },
            "min": {
                "type": Number,
                "default": undefined
            },
            "max": {
                "type": Number,
                "default": undefined
            }
        },

        /**
         * Runs when the vue component is mounted.
         * @returns void
         */
        "mounted": mountedFunction
    })
}

// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2021 Jacob D. Durrant.


declare var Vue;

/** An object containing the vue-component computed functions. */
let computedFunctions = {
    /**
     * Determines whether this component has a label.
     * @returns boolean  True if it does, false otherwise.
     */
    hasLabel(): boolean {
        return this["label"] !== "" && this["label"] !== undefined;
    },

    /**
     * Determines if label should be placed to the left or above.
     * @returns number  Returns 3 if it has a label, 0 otherwise.
     */
    "labelCols"(): number {
        return ((this.hasLabel === true)  && (this["labelToLeft"] === true)) ? 3 : 0;
    },

    /**
     * Determines if label should be placed to the left or above.
     * @returns number  Returns 2 if it has a label, 0 otherwise.
     */
    "labelColsLg"(): number {
        return ((this.hasLabel === true)  && (this["labelToLeft"] === true)) ? 2 : 0;
    }
}

/**
 * Setup the form-group Vue commponent.
 * @returns void
 */
export function setup(): void {
    Vue.component('form-group', {
        /**
         * Get the data associated with this component.
         * @returns any  The data.
         */
        "data": function() {
            return {}
        },
        "computed": computedFunctions,
        "template": `
            <span>
                <b-form-group
                    v-if="formGroupWrapper"
                    :label-cols="labelCols" :label-cols-lg="labelColsLg"
                    :label="label"
                    :label-for="id"
                    :id="'input-group-' + id"
                    :style="styl"
                >
                    <slot></slot>
                    <div style='text-align:left;'>
                        <small
                            tabindex="-1"
                            :id="'input-group-input-group-' + id + '__BV_description_'"
                            class="form-text text-muted" style="display:inline;"
                            v-html="description">
                        </small>
                        <small class="form-text text-muted" style="display:inline;">
                            <slot name="extraDescription"></slot>
                        </small>
                    </div>
                </b-form-group>
                <div v-else>
                    <slot></slot>
                </div>
            </span>
        `,
        "props": {
            "label": String,
            "id": String,
            "styl": String,
            "description": String,
            "formGroupWrapper": {
                "type": Boolean,
                "default": true
            },
            "labelToLeft": {
                "type": Boolean,
                "default": true
            }
        },
        "methods": {}
    })
}

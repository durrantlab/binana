// This file is released under the Apache 2.0 License. See
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2022
// Jacob D. Durrant.

import { addCSS } from "../Utils";


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
     * Determines if label should be placed to the left or above. Number of
     * columns for the label width 'xs' screens and up. Always 0 (labele above
     * on small screens).
     * @returns number  0
     */
    "labelCols"(): number {
        return 0;

        // Used to return 2, but now I think it's good to have label on top if
        // there isn't plenty of room.

        // return ((this.hasLabel === true)  && (this["labelToLeft"] === true)) ? 2 : 0;
    },
}

/**
 * Setup the file-loader-form-group Vue commponent.
 * @returns void
 */
export function setupFileLoaderFormGroup(): void {
    Vue.component('file-loader-form-group', {
        /**
         * Get the data associated with this component.
         * @returns any  The data.
         */
        "data": function() {
            return {}
        },
        "computed": computedFunctions,
        "template": /* html */ `
            <span class="file-loader-form-group">
                <b-form-group
                    v-if="formGroupWrapper"
                    :label="label"
                    :label-for="id"
                    :id="'input-group-' + id"
                    :style="styl + ';max-width:none !important;'"
                    :label-cols="label ? 12 : 0"
                    :label-cols-sm="label ? 2 : 0"
                >
                    <slot></slot>
                    <small
                        tabindex="-1"
                        :id="'input-group-input-group-' + id + '__BV_description_'"
                        class="form-text text-muted" style="display:inline;"
                        v-html="description">
                    </small>
                    <small class="form-text text-muted" style="display:inline;">
                        <slot name="extraDescription"></slot>
                    </small>
                </b-form-group>
                <div v-else>
                    <slot></slot>
                </div>
            </span>
        `,
        "props": {
            "label": {
                "type": String,
                "default": undefined
            },
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
        "methods": {},
        "mounted"() {
            addCSS(`.file-loader-form-group .col-form-label { hyphens: auto; }`);
        }
    })
}

// This file is released under the Apache 2.0 License. See
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2022
// Jacob D. Durrant.

declare var Vue;

/** An object containing the vue-component computed functions. */
let computedFunctions = {}

/**
 * Setup the small-pill-btn Vue commponent.
 * @returns void
 */
export function setupSmallPillBtn(): void {
    Vue.component('small-pill-btn', {
        /**
         * Get the data associated with this component.
         * @returns any  The data.
         */
        "data": function() {
            return {}
        },
        "computed": computedFunctions,
        "template": /* html */ `
            <b-button 
                pill :variant="actionStyling === 'delete' ? 'secondary' : 'outline-secondary'" size="sm" 
                class="py-0 px-1"
                style="line-height:14px; font-size:90%; margin-right:2px;"
                @click="onClick"
            >
                <span
                    v-if="actionStyling === 'extract'"
                    style="display:inline-block; transform: scaleX(-1);">&#10138;
                </span>
                <span v-else>&#10006;</span>
                <slot></slot>
            </b-button>
            <!-- style="line-height:14px; font-size:80%;" -->
        `,
        "props": {
            "actionStyling": {
                "type": String,
                "default": "delete"  // Can also be "extract"
            }
        },
        "methods": {
            "onClick"(): void {
                this.$emit("click");
            }
        },
        "mounted"() {}
    })
}

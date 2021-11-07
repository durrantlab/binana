// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2020 Jacob D. Durrant.

declare var Vue;
declare var jQuery;

/** An object containing the vue-component computed functions. */
let computedFunctions = {};

/** An object containing the vue-component methods functions. */
let methodsFunctions = {};

/** An object containing the vue-component watch functions. */
let watchFunctions = {}

/**
 * The vue-component mounted function.
 * @returns void
 */
function mountedFunction(): void {}

/**
 * Setup the check-mark Vue commponent.
 * @returns void
 */
export function setup(): void {
    Vue.component("check-mark", {
        /**
         * Get the data associated with this component.
         * @returns any  The data.
         */
        "data"(): any {
            return {};
        },
        "methods": methodsFunctions,
        "template": /* html */ `
            <span>
                <div class="spacer25px" v-if="value">✔️</div>
                <div class="spacer25px" v-else></div>

                <slot></slot>
                <div class="spacer25px"></div>
            </span>
        `,
        "props": {
            "value": Boolean,
        },
        "computed": computedFunctions,

        /**
         * Runs when the vue component is mounted.
         * @returns void
         */
        "mounted": mountedFunction,

        "watch": watchFunctions
    });
}

// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2021 Jacob D. Durrant.

declare var Vue;

/** An object containing the vue-component methods functions. */
let methodsFunctions = {
    onSubmitClick(): void {
        location.reload();
    }
}

/**
 * Setup the start-over Vue commponent.
 * @returns void
 */
export function setup(): void {
    Vue.component('start-over', {
        "template": `
            <div class="text-center">
                <b-alert show variant="warning">If you start over, your existing data will be deleted. Proceed only if you have already saved your data.</b-alert>
                <form-button @click.native="onSubmitClick" variant="primary">Start Over</form-button>
            </div>
        `,
        "props": {},
        "computed": {},

        /**
         * Get the data associated with this component.
         * @returns any  The data.
         */
        "data"(): any {
            return {}
        },
        "methods": methodsFunctions
    })
}

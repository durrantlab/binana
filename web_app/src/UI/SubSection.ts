// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2020 Jacob D. Durrant.


declare var Vue;

/**
 * Setup the sub-section Vue commponent.
 * @returns void
 */
export function setup(): void {
    Vue.component('sub-section', {
        /**
         * Get the data associated with this component.
         * @returns any  The data.
         */
        "data"(): any {
            return {}
        },
        "computed": {
            /**
             * Gets the style of the card.
             * @returns string  The css style string.
             */
            "cardStyle"(): string {
                return this["title"] !== undefined ? 'margin-top: 16px;' : '';
            }
        },
        "template": `
            <b-card :title="title" class="mb-4">
                <b-card-text :style="cardStyle">
                    <slot></slot>
                </b-card-text>
            </b-card>
        `,
        "props": {
            "title": String
        }
    })
}

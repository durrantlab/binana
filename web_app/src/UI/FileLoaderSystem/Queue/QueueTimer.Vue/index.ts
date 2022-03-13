// This file is released under the Apache 2.0 License. See
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2022
// Jacob D. Durrant.

declare var Vue;

/** An object containing the vue-component computed functions. */
let computedFunctions = {
    "itemsLeftMsg"(): string {
        if (this["numItemsInQueue"] === 1) {
            return "There is currently 1 item in the queue.";
        } else {
            return `There are currently ${this["numItemsInQueue"]} items in the queue.`;
        }
    }
};

/**
 * The vue-component mounted function.
 * @returns void
 */
function mountedFunction(): void {
    // Start the countdown
    this["countDownTimeLeft"] = this["countDownSeconds"];
    setTimeout(this.nextCountDownTick, 1000);
}

/**
 * Setup the file-list Vue commponent.
 * @returns void
 */
export function setupQueueTimer(): void {
    Vue.component("queue-timer", {
        /**
         * Get the data associated with this component.
         * @returns any  The data.
         */
        "data"(): any {
            return {
                "countDownPaused": false,
                "countDownTimeLeft": undefined
            };
        },
        "watch": {},
        "methods": {
            /**
             * If the countdown is enabled, decrement the countdown time by 1
             * second and call the nextCountDownTick function again after 1
             * second. In onProceed() if enough time has passed.
             */
            nextCountDownTick(): void {
                if (this["countDownTimeLeft"] === -1) {
                    // Not enabled from the beginning
                    return;
                }
        
                let newVal = this["countDownTimeLeft"] - 1;
                if (newVal >= 0) {
                    this["countDownTimeLeft"] = newVal;
        
                    if (!this["countDownPaused"]) {
                        setTimeout(this.nextCountDownTick, 1000);
                    }
                } else {
                    // Time up.
                    this["onProceed"]();
                }
            },

            /**
             * Runs when user pauses or resumes countdown. If the count down is
             * not paused, set a timeout to call the nextCountDownTick function.
             */
            "onPauseOrResume"(): void {
                this["countDownPaused"] = !this["countDownPaused"];
        
                if (!this["countDownPaused"]) {
                    setTimeout(this.nextCountDownTick, 1000);
                }
            },

            /**
             * Disable countdown timer, emit onProceed.
             */
            "onProceed"(): void {
                this["countDownTimeLeft"] = -1;  // disable
                this.$emit("onProceed");
            },

            /**
             * Disable countdown timer, emit onStop.
             */
            "onStop"(): void {
                this["countDownTimeLeft"] = -1;  // disable
                this.$emit("onStop");
            }
        },
        "template": /*html*/ `
            <b-alert
                v-if="countDownTimeLeft !== -1"
                show variant="primary"
            >
                <p style="text-align:center;">
                    {{itemsLeftMsg}}
                    The next item will be processed
                    {{countDownPaused 
                        ? "after resume"
                        : "in " + countDownTimeLeft + " seconds"
                    }}...
                </p>
                <b-container fluid>
                    <b-row>
                        <b-col cols="4" class="px-1">
                            <b-button 
                                @click="onPauseOrResume"
                                style="width:100%;"
                                title="Pause/resume countdown"
                            >{{countDownPaused ? "Resume": "Pause"}}</b-button>
                        </b-col>
                        <b-col cols="4" class="px-1">
                            <b-button
                                @click="onStop"
                                style="width:100%;"
                                title="Cancel and download results generated thus far"
                            >Stop</b-button>
                        </b-col>
                        <b-col cols="4" class="px-1">
                            <b-button
                                @click="onProceed"
                                style="width:100%;"
                                title="Proceed with next calculation"
                            >Proceed</b-button>
                        </b-col>
                    </b-row>
                </b-container>
            </b-alert>
        `,
        "props": {
            "countDownSeconds": {
                "type": Number,
                "default": 5
            },
            "numItemsInQueue": {
                "type": Number,
                "required": true
            }
        },
        "computed": computedFunctions,

        /**
         * Runs when the vue component is mounted.
         * @returns void
         */
        "mounted": mountedFunction,
    });
}

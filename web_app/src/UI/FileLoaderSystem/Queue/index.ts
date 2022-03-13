// Released under the Apache 2.0 License. See LICENSE.md or go to
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2022
// Jacob D. Durrant.

import { setupQueueCatcher } from "./QueueCatcher.vue";
import { setupQueueController } from "./QueueController.Vue";
import { setupQueueTimer } from "./QueueTimer.Vue";

/**
 * Setup the queue system.
 */
export function setupQueueSystem(): void {
    setupQueueTimer();
    setupQueueController();
    setupQueueCatcher();
}
// This file is released under the Apache 2.0 License. See
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2022
// Jacob D. Durrant.

import { addCSS } from "../../../../Common/Utils";

/**
 * The vue-component mounted function.
 * @returns void
 */
 export function fileLoaderInputMountedFunction(): void {
    // Add some CSS
    addCSS(`.form-file-text { color: #878e95 }`);
}

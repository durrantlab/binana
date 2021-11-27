// This file is released under the Apache 2.0 License. See
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2021
// Jacob D. Durrant.

import * as FileLoaderVue from "./FileLoader.Vue";
import { FileLoaderInputPlugin } from "./Plugins/FileLoaderInput.Vue";
import { PDBIDInputPlugin } from "./Plugins/PDBIDInput";
import { URLInputPlugin } from "./Plugins/URLInput";

export function setupFileLoader() {
    // Always load all plugins. Whether they are displayed will be specified
    // within vue.js, but just always load them all.
    FileLoaderVue.setup([
        new FileLoaderInputPlugin().setup(),
        new PDBIDInputPlugin().setup(),
        new URLInputPlugin().setup()
    ]);
}
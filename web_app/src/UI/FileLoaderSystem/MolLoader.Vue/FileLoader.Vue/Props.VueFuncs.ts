// This file is released under the Apache 2.0 License. See
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2022
// Jacob D. Durrant.

import { commonFileLoaderProps, commonMultipleFilesProps } from "../../Common/CommonProps.VueFuncs";

export let fileLoaderPropsFunctions = {
    ...commonMultipleFilesProps,
    ...commonFileLoaderProps,
    "label": String,
    "description": String,
    "invalidMsg": {
        "type": String,
        "default": "This field is required!",
    },
    "selectedFilename": {
        "type": String,
        "default": ""
    },
    "value": {
        "type": Object,
        "default": {}
    },
    "fileLoaderPlugins": {
        "type": Array,
        "default": ["pdb-id-input", "file-loader-input"]
    }
}
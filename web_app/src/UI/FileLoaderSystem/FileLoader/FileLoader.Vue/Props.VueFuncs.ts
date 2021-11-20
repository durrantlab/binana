import { commonFileLoaderProps } from "../Plugins/PluginParent/PluginParent";

export let fileLoaderPropsFunctions = {
    ...commonFileLoaderProps,
    "label": String,
    "description": String,
    "invalidMsg": {
        "type": String,
        "default": "This field is required!",
    },
    "multipleFiles": {
        "type": Boolean,
        "default": false
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
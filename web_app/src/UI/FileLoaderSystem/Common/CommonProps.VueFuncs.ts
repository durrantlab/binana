// Released under the Apache 2.0 License. See LICENSE.md or go to
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2022
// Jacob D. Durrant.

// A place to put properties that are common to multiple components.

// Common to mol-loader, and file loaders.
export var commonMultipleFilesProps = {
    "multipleFiles": {
        "type": Boolean,
        "default": false
    },
    "saveMultipleFilesToDatabase": {
        // Saves copies of files to database for use elsewhere (even after page
        // reload). But I can imagine scenarios when you'd want to load multiple
        // files without realoading the page, so false by default.
        "type": Boolean,
        "default": false
    },
}

// Properties common to file load, from PDB, from URL, etc.
export var commonFileLoaderProps = {
    "id": {
        "type": String,
        "required": false
    },
    "required": {
        "type": Boolean,
        "default": true,
    },
    "accept": {
        "type": String,
        "default": "",  // e.g., ".pdbqt, .out, .pdb"
    },
    "convert": {
        "type": String,
        "default": "",  // e.g., ".sdf, .mol2"
    },
    "valid": {
        "type": Boolean,
        "default": true
    }
}

export var commonProteinEditingProps = {
    "allowAtomExtract": {
        "type": Boolean,
        "default": false
    },
    "allowAtomDelete": {
        "type": Boolean,
        "default": true
    }
}

// Used in both queue-catcher and queue-controller.
export var commonQueueProps = {
    "trigger": {
        "type": Boolean,
        "default": false,
        "required": true
    },
    "countDownSeconds": {
        "type": Number,
        "default": 5
    },
    "molLoaderIds": {
        "type": Array,
        "required": true
    },
    "outputZipFilename": {
        "type": String,
        "default": "output.zip"
    }
}
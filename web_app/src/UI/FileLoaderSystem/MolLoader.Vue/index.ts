// This file is released under the Apache 2.0 License. See
// https://opensource.org/licenses/Apache-2.0 for full details. Copyright 2021
// Jacob D. Durrant.

// FileLoader.ts is meant to be generic. You'll usually want to wrap it in
// another component to provide app-specific functionality.

import { IConvert, IFileInfo, IFileLoadError, IResidueInfo } from '../Common/Interfaces';
import { deepCopy, slugify } from '../Common/Utils';
import { setupFileLoader } from '../FileLoader/Setup';
import { setupFileList } from '../FileList.Vue/index';
import { setupProteinProcessing } from '../ProteinProcessing.Vue';
import { setupProteinProcessingDeleteExtract } from '../ProteinProcessing.Vue/ProteinProcessingDeleteExtract';
import { setupFileLoaderFormGroup } from '../Common/FileLoaderFormGroup.Vue/FileLoaderFormGroup.Vue';

declare var Vue;

/** An object containing the vue-component computed functions. */
let computedFunctions = {
    "currentPdbFile"(): IFileInfo {
        return {
            filename: this["selectedFilename"],
            fileContents: this["files"][this["selectedFilename"]]
        }
    },

    "idToUse"(): string {
        return slugify(this["label"]);
    }
};

/** An object containing the vue-component methods functions. */
let methodsFunctions = {
    "onSelectedFilenameChange"(selectedFilename: string): void {
        this["selectedFilename"] = selectedFilename
    },

    "onError"(error: IFileLoadError): void {
        this.$emit("onError", error);
    },

    "onExtractAtoms"(residueInfo: IResidueInfo): void {
        this.$emit("onExtractAtoms", residueInfo);
    },

    "onStartConvertFiles"(convertInfo: IConvert) {
        // Must always call convertInfo.onConvertDone(filename, convertedText)
        // (to resume next convert) or convertInfo.onConvertCancel (to abort
        // conversions).
        alert("Convert :: " + convertInfo.filename + " :: " + convertInfo.fileContents);
        convertInfo.onConvertDone(convertInfo.filename, "new content");
    },
    "loadMolFromExternal"(filename: string, pdbContents: string): void {
        // Note that typically you don't want a parent component to access a
        // child component directly through $ref. But in some rare cases, this
        // is just easier. This function allows the user to load a PDB file
        // directly, bypassing the user interface. For example, when extracting
        // a ligand molecule from the protein structure, you might want to set
        // the ligand here directly.
        
        this.$refs["fileLoader"].$refs["fileLoaderPlugin1"].onFilesLoaded([
            {
                filename: filename,
                fileContents: pdbContents
            } as IFileInfo
        ]);
    }
};

/**
 * The vue-component mounted function.
 * @returns void
 */
function mountedFunction(): void {}

/**
 * Setup the mol-loader Vue commponent.
 * @returns void
 */
export function setupMolLoader(): void {
    setupFileLoaderFormGroup();
    setupFileLoader();
    setupFileList();
    setupProteinProcessing();
    setupProteinProcessingDeleteExtract();

    Vue.component("mol-loader", {
        /**
         * Get the data associated with this component.
         * @returns any  The data.
         */
        "data"(): any {
            return {
                "selectedFilename": "",
                "files": {}
            };
        },
        "methods": methodsFunctions,
        "template": /*html*/ `
            <div>
                <file-loader
                    ref="fileLoader"
                    v-model="files"
                    :label="label"
                    :id="idToUse"
                    :description="description"
                    :accept="accept"
                    :convert="convert"
                    :required="required"

                    :fileLoaderPlugins="fileLoaderPlugins"

                    @onSelectedFilenameChange="onSelectedFilenameChange"
                    :selectedFilename="selectedFilename"

                    @onError="onError"
                    @onStartConvertFiles="onStartConvertFiles"
                    :multipleFiles="multipleFiles"
                >
                    <template v-slot:extraDescription>
                        {{extraDescription}}
                        <file-list
                            v-if="multipleFiles"
                            v-model="files"
                            :selectedFilename="selectedFilename"
                            @onSelectedFilenameChange="onSelectedFilenameChange"
                        ></file-list>
        
                        <protein-processing 
                            :allowDeleteHeteroAtoms="allowDeleteHeteroAtoms"
                            :allowExtractHeteroAtoms="allowExtractHeteroAtoms"
                            v-model="files"
                            :selectedFilename="selectedFilename"
                            @onSelectedFilenameChange="onSelectedFilenameChange"
                            @onExtractAtoms="onExtractAtoms"
                        ></protein-processing>
                    </template>
                </file-loader>

            </div>
        `,
        "props": {
            "multipleFiles": {
                "type": Boolean,
                "default": true
            },
            "allowDeleteHeteroAtoms": {
                "type": Boolean,
                "default": false
            },
            "allowExtractHeteroAtoms": {
                "type": Boolean,
                "default": false
            },
            "label": {
                "type": String,
                "default": "Molecule"
            },
            "description": {
                "type": String,
                "default": "Primary description goes here."
            },
            "extraDescription": {
                "type": String,
                "default": "Some extra description goes here."
            },
            "accept": {
                "type": String,
                "default": ".pdb"
            },
            "convert": {
                "type": String,
                "default": ".pdbqt, .ent, .xyz, .pqr, .mcif, .mmcif"
            },
            "required": {
                "type": Boolean,
                "default": true
            },
            "fileLoaderPlugins": {
                "type": Array,
                "default": ["pdb-id-input", "file-loader-input"]
            }
        },
        "computed": computedFunctions,
        "watch": {
            "currentPdbFile"(newValue: string, oldValue: string): void {
                this.$emit("onFileReady", newValue);
            }
        },

        /**
         * Runs when the vue component is mounted.
         * @returns void
         */
        "mounted": mountedFunction,
    });
}

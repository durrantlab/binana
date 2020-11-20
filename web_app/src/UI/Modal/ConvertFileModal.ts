// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2020 Jacob D. Durrant.

import * as Utils from "../../Utils";

declare var Vue;

/** An object containing the vue-component computed functions. */
let computedFunctions = {
    /** The visibility (boolean, open/closed) of the convert file modal. Can
     * both get and set. */
    "convertFileModalShow": {
        get(): boolean {
            return this.$store.state["convertFileModalShow"];
        },

        set(val: boolean): void {
            this.$store.commit("setVar", {
                name: "convertFileModalShow",
                val,
            });
        },
    },

    /**
     * Get the extension of the user-submitted file.
     * @returns string The extension.
     */
    "currentExt"(): string {
        return this.$store.state["convertFileExt"].toUpperCase();
    },

    /**
     * Get the current type of the user-submitted file. "receptor" or
     * "ligand".
     * @returns string The type.
     */
    "currentType"(): string {
        return this.$store.state["convertFileType"];
    },

    /**
     * Determine whether 3D coordinates must be generated, given the file
     * extension. If they are required regardless, don't give the user the
     * option.
     * @returns boolean  True if generating 3D coordinates is required.
     */
    "gen3DRequired"(): boolean {
        if (["CAN", "SMI", "SMILES"].indexOf(this["currentExt"]) !== -1) {
            // It's one of the formats that always required that 3D
            // coordinates be generated.
            this["gen3D"] = true;
            return true;
        }
        return false;
    }
}

/** An object containing the vue-component methods functions. */
let methodsFunctions = {
    /**
     * Begin to convert the file to PDBQT.
     * @param  {*}      e                              The click event.
     * @param  {number=1} currentPDBOptimizationLevel  To what extent the PDB
     *                                                 file should be
     *                                                 optimized (to keep size
     *                                                 low for converting).
     * @param  {string[]} successMsgs                  The messages to display
     *                                                 to the user on success
     *                                                 (if any).
     * @returns void
     */
    "beginConvert"(e, currentPDBOptimizationLevel=1, successMsgs=[]): void {
        let frameWindow = document.getElementById("convert-frame")["contentWindow"];
        frameWindow["startSpinner"]();
        let content: string = this.$store.state["convertFile"];
        while (content.substr(content.length - 1, 1) === "\n") {
            content = content.substr(0, content.length - 1);
        }

        if (this["currentExt"].toUpperCase() === "PDB") {
            let msg = this.pdbOptimization(currentPDBOptimizationLevel);
            if (msg !== "") {
                successMsgs.push(msg);
            }
        }

        if (this["currentType"]!=="ligand") {
            // If it's not a ligand, there's no need to generate 3D
            // coordinates.
            this["gen3D"] = false;
        }

        frameWindow.document.querySelector("html").style.overflow = "hidden";
        frameWindow["PDBQTConvert"]["convert"](
            content,
            this["currentExt"].toLowerCase(),
            this["currentType"]==="ligand",
            this["addHydrogens"],
            this["gen3D"],
            parseFloat(this["phVal"])
        ).then((out) => {
            this.$store.commit("setVar", {
                name: this["currentType"] + "Contents",
                val: out
            });

            this["$refs"]["convert-modal"].hide();

            // This makes it look like it validated.
            this.$store.commit("setVar", {
                name: this["currentType"] + "ForceValidate",
                val: true
            });

            // This actually sets the validation.
            this.$store.commit("setValidationParam", {
                name: this["currentType"],
                val: true
            });

            // Update the filename to end in pdbqt.
            let newFilename = Utils.replaceExt(this.$store.state[this["currentType"] + "FileName"], "converted.pdbqt");
            this.$store.commit("updateFileName", { type: this["currentType"], filename: newFilename });

            if (successMsgs.length !== 0) {
                let overallMsg = successMsgs.map((m, i) => { return "(" + (i + 1).toString() + ") " + m; }).join(" ");
                this["$bvModal"]["msgBoxOk"]("To convert your file to PDBQT, BINANA had to make the following modifications: " + overallMsg, {
                    "title": "Warning: File Too Big!",
                });
            }
        }).catch((msg) => {
            // The conversion failed. But if it's a PDB file, it might be
            // worth trying to optimize it further.
            if (currentPDBOptimizationLevel <= 4) {  // one less than max number in pdbOptimization.
                this["beginConvert"](e, currentPDBOptimizationLevel + 1, successMsgs);
                return;
            }

            this["$refs"]["convert-modal"].hide();
            this["$bvModal"]["msgBoxOk"]("Could not convert your file. Are you sure it is a properly formatted " + this["currentExt"] + " file? If so, it may be too large to convert in the browser.", {
                "title": "Error Converting File!",
            });
            this.$store.commit("setVar", {
                name: this["currentType"] + "ForceValidate",
                val: false
            });
            this.$store.commit("updateFileName", { type: this["currentType"], filename: "" });
            console.log("ERROR: " + msg);
        });

        e.preventDefault();
    },


    /**
     * PDB files are very common, yet openbabel.js cannot convert them if they
     * are too large. Here we make efforts to "optimize" the PDB file to
     * maximize the changes that openbabel.js will succeed.
     * @param  {number} level  The optimization level.
     * @returns string  A message to show the user re. any modifications made
     *                  to the PDB file.
     */
    pdbOptimization(level: number): string {
        let pdbTxt = this.$store.state["convertFile"];

        let msg = "";

        switch (level) {
            case 1:
                // Always run this optimization. Just removes lines that don't
                // start with ATOM and HETATM. Also keeps only the first frame
                // if it's a multi-frame PDB.

                if (pdbTxt.indexOf("\nEND") !== -1) {
                    // Perhaps a multi-frame PDB.
                    pdbTxt = pdbTxt.split("\nEND")[0];
                    msg = "Keep only the first frame."
                }

                pdbTxt = pdbTxt.split("\n").filter(l => l.slice(0, 5) === "ATOM " || l.slice(0, 7) === "HETATM ").join("\n");
                break;
            case 2:
                // Try removing everything but protein atoms.
                pdbTxt = Utils.keepOnlyProteinAtoms(pdbTxt);
                msg = "Discard non-protein atoms."
                break;
            case 3:
                // Keep only the first chain.
                let chain = pdbTxt.slice(21,22);  // first chain
                pdbTxt = pdbTxt.split("\n").filter(l => l.slice(21,22) === chain).join("\n");
                msg = "Keep only the first chain (chain " + chain + ").";
                break;
            case 4:
                // Remove existing hydrogen atoms.
                pdbTxt = pdbTxt.split("\n").filter(l => l.substr(12,4).replace(/ /g, "").substr(0, 1) !== "H").join("\n");
                msg = "Remove original hydrogen atoms.";
                break;
            case 5:
                // Remove beta, occupancy, etc. columns.
                pdbTxt = pdbTxt.split("\n").map(l => l.substr(0,54)).join("\n");
                msg = "Remove original occupancy, beta, and element columns.";
                break;
        }

        // console.log("HHHHH>>> " + msg + " >>>> " + pdbTxt.length.toString());

        this.$store.commit("setVar", {
            name: "convertFile",
            val: pdbTxt
        });

        return msg;
    },

    /**
     * The cancel button is pressed.
     * @returns void
     */
    "cancelPressed"(): void {
        // Not sure the below is really necessary, but let's just make
        // sure.
        this.$store.commit("setVar", {
            name: this["currentType"] + "FileName",
            val: undefined
        });

        this.$store.commit("setValidationParam", {
            name: this["currentType"],
            val: false
        });

        this.$store.commit("updateFileName", { type: this["currentType"], filename: "" });
    },

    /**
     * Reload the iframe containing the PDBConvert app.
     * @returns void
     */
    "reloadIFrame"(): void {
        document.getElementById("convert-frame")["src"] = "./pdbqt_convert/index.html?startBlank";
    }
}

/**
 * Setup the convert-file-modal Vue commponent.
 * @returns void
 */
export function setup(): void {
    Vue.component("convert-file-modal", {
        /**
         * Get the data associated with this component.
         * @returns any  The data.
         */
        "data": function () {
            return {
                "addHydrogens": true,
                "gen3D": false,
                "phVal": 7.4
            };
        },
        "computed": computedFunctions,
        "methods": methodsFunctions,
        "template": `
            <b-modal
              ref="convert-modal"
              @shown="reloadIFrame"
              ok-title="Convert" v-model="convertFileModalShow"
              id="convert-msg-modal" title="Convert File to PDBQT"
              @ok="beginConvert" @cancel="cancelPressed">
                <p class="my-4">
                    BINANA works with PDBQT files, not {{currentExt}} files. We suggest you:
                    <span v-if="this['currentType']==='receptor'">
                        <ol>
                            <li>Add hydrogen atoms using <a href="http://www.poissonboltzmann.org/" target="_blank">PDB2PQR</a></li>
                            <li>Convert the resulting PQR file to PDB using <a href="http://openbabel.org/wiki/Main_Page" target="_blank">Open Babel</a></li>
                            <li>Convert the PDB file to PDBQT using <a target='_blank' href='http://mgltools.scripps.edu/'>MGLTools</a></li>
                        </ol>
                    </span>
                    <span v-else-if="this['currentType']==='ligand'">
                        <ol>
                            <li>Add hydrogen atoms to your ligand files (SMILES or SDF format) using <a target='_blank' href='https://git.durrantlab.pitt.edu/jdurrant/gypsum_dl'>Gypsum-DL</a></li>
                            <li>Convert the resulting PDB or SDF file(s) to PDBQT using <a target='_blank' href='http://mgltools.scripps.edu/'>MGLTools</a></li>
                        </ol>
                    </span>
                </p>

                <p>Or click "Convert" below to convert with the PDBQTConvert app, which should be good enough for most purposes.</p>

                <b-form-checkbox
                    id="babel-add-hydrogens"
                    v-model="addHydrogens"
                    name="babel-add-hydrogens"
                    :value="true"
                    :unchecked-value="false"
                >
                    Add hydrogen atoms at pH
                    <b-form-input
                        id="ph-val"
                        v-model="phVal"
                        type="text"
                        placeholder="7.4"
                        class="form-control-sm"
                        @click.stop.prevent
                        style="width: 45px; height: 23px; text-align: center; margin-left: 2px; display: inline-block;"
                    ></b-form-input>
                </b-form-checkbox>

                <b-form-checkbox
                    v-if="(this['currentType']==='ligand') && (!gen3DRequired)"
                    id="babel-gen-3d"
                    v-model="gen3D"
                    name="babel-gen-3d"
                    :value="true"
                    :unchecked-value="false"
                >
                    Generate 3D coordinates.
                </b-form-checkbox>

                <iframe id="convert-frame" style="border: 0; width: 100%; height: 65px;"></iframe>

                <small class="form-text text-muted">
                    PDBQTConvert is an optional GPL-licensed helper app
                    built on <a
                    href="https://github.com/partridgejiang/cheminfo-to-web/tree/master/OpenBabel/OpenBabel-js" target="_blank">
                    OpenBabel JS</a>. It communicates with BINANA at "arms
                    length" via an iframe.
                </small>
            </b-modal>`,
        "props": {}
    });
}

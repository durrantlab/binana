// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2020 Jacob D. Durrant.

import * as BINANAInterface from "../BINANAInterface";
import { store } from "../Vue/Store";

declare var $3Dmol;
declare var jQuery;
declare var Vue;

export var viewer;

var runBINANATimeout;

/**
* Show a sticks representation if it is appropriate given user
* settings.
* @returns void
*/
export function showSticksAsAppropriate(): void {
    // If no protein has been loaded, no need to proceed.
    if (store.state["receptorMol"] === undefined) {
        return;
    }

    if (store.state["renderProteinSticks"] === true) {
        // Set up the style.
        store.state["receptorMol"].setStyle(
            {},
            {
                "stick": { "radius": 0.1 },  // 0.15
                "cartoon": { "color": 'spectrum' },
            }
        );
        viewer["render"]();
    } else {
        // Set up the style.
        store.state["receptorMol"].setStyle({}, {});  // This is better. Clear first.
        viewer["render"]();
        store.state["receptorMol"].setStyle(
            {},
            { "cartoon": { "color": 'spectrum' } }
        );
        viewer["render"]();
    }
}

/** An object containing the vue-component computed functions. */
let computedFunctions = {
    /**
     * Get the value of the receptorContents variable.
     * @returns string  The value.
     */
    "receptorContents"(): string {
        return this.$store.state["receptorContents"];
    },

    /**
     * Get the value of the ligandContents variable.
     * @returns string  The value.
     */
    "ligandContents"(): string {
        return this.$store.state["ligandContents"];
    },

    /**
     * Get the value of the binanaParams variable.
     * @returns string  The value.
     */
    // TODO: Cruft?
    // binanaParams(): string {
    //     return this.$store.state["binanaParams"];
    // },

    /**
     * Get the value of the surfBtnVariant variable.
     * @returns string|boolean  The value.
     */
    "surfBtnVariant"(): string|boolean {
        return (this["renderProteinSurface"] === true) ? undefined : "default";
    },

    /**
     * Get the value of the allAtmBtnVariant variable.
     * @returns string|boolean  The value.
     */
    "allAtmBtnVariant"(): string|boolean {
        return (this.$store.state["renderProteinSticks"] === true) ? undefined : "default";
    },

    /**
     * Determines whether the appropriate receptor PDB content has
     * been loaded.
     * @returns boolean  True if it has been loaded, false otherwise.
     */
    // TODO: Cruft?
    // appropriateReceptorPdbLoaded(): boolean {
    //     return this.$store.state["receptorContents"] !== "";
    // },

    /**
     * Determines whether the appropriate ligand PDB content has been
     * loaded.
     * @returns boolean  True if it has been loaded, false otherwise.
     */
    // TODO: Cruft?
    // appropriateLigandPdbLoaded(): boolean {
    //     return this.$store.state["ligandContents"] !== "";
    // },
}

/** An object containing the vue-component methods functions. */
let methodsFunctions = {
    /**
     * Runs when a new model has been added.
     * @param  {number} duration  How long to wait before adding that
     *                            model to 3dmol.js widget.
     * @returns void
     */
    modelAdded(duration: number): void {
        // Put app into waiting state.
        jQuery("body").addClass("waiting");
        this["msg"] = "Loading...";

        setTimeout(() => {
            // Initialize the viewer if necessary.
            if (viewer === undefined) {
                let element = jQuery("#" + this["type"] + "-3dmol");
                let config = {
                    backgroundColor: "white"
                };
                viewer = $3Dmol["createViewer"](element, config);
                viewer["enableFog"](true);
            }

            BINANAInterface.clearInteraction();

            let loadModelTxt = (typeStr: string): any => {
                let origModelContent = this[typeStr + "Contents"];

                let filename = this.$store.state[typeStr + "FileName"];
                let ext = filename.split(".").slice(filename.split(".").length - 1)[0].toLowerCase()

                let modelContent = origModelContent;
                if (ext === "pdbqt") {
                    modelContent = pdbqtToPDB(origModelContent, this.$store);
                    ext = "pdb"
                    this.$store.commit("setVar", {
                        name: typeStr + "Contents",
                        val: modelContent
                    });
                    this.$store.commit("setVar", {
                        name: typeStr + "FileName",
                        val: "myfile.pdb"
                    });
                }

                if (modelContent !== "") {
                    if (this[typeStr + "Mol"] !== undefined) {
                        viewer["removeModel"](this[typeStr + "Mol"]);
                        viewer["resize"]();
                        viewer["render"]();
                    }

                    this[typeStr + "Mol"] = viewer["addModel"](modelContent, ext, {"keepH": true});
                    if (ext !== "pdb") {
                        // Some other format that 3dmol can read directly,
                        // that needs to be converted to pdb for binana.
                        modelContent = mol3DToPDB(this[typeStr + "Mol"]);
                        this.$store.commit("setVar", {
                            name: typeStr + "Contents",
                            val: modelContent
                        });
                        this.$store.commit("setVar", {
                            name: typeStr + "FileName",
                            val: "myfile.pdb"
                        });
                    }

                    this.msgIfNoHydrogens(this[typeStr + "Mol"]);

                    return this[typeStr + "Mol"];
                } else if (origModelContent !== "") {
                    // It's empty, but shouldn't be. Probably not
                    // properly formed.

                    this.$store.commit("openModal", {
                        title: "Invalid Input File!",
                        body: "<p>The selected input file is not properly formatted. The molecular viewer has not been updated. Please select a properly formatted PDBQT or PDB file, as appropriate.</p>"
                    });
                }
            }

            viewer["removeAllSurfaces"]();
            this["surfaceObj"] = undefined;

            let receptorModel = loadModelTxt("receptor");
            if (receptorModel !== undefined) {
                this.$store.commit("setVar", {
                    name: "receptorMol", val: receptorModel
                });
                this.receptorAdded(receptorModel);
            }

            let ligandModel = loadModelTxt("ligand");
            if (ligandModel !== undefined) {
                this.ligandAdded(ligandModel);
                this.$store.commit("setVar", {
                    name: "ligandMol",
                    val: ligandModel
                });
            }

            // viewer.resize();  // To make sure. Had some problems in testing.
            viewer["render"]();
            viewer["zoomTo"](
                {
                    "model": this.$store.state["ligandMol"] !== undefined ? this.$store.state["ligandMol"] : this.$store.state["receptorMol"]
                },
                duration
            );
            viewer["zoom"](0.8, duration);

            if ((this.$store.state["ligandMol"] !== undefined) && (this.$store.state["receptorMol"] !== undefined)) {
                // Good to strategically delay running BINANA in case the app
                // reconverts some of the files to PDB format.
                if (runBINANATimeout !== undefined) {
                    clearTimeout(runBINANATimeout);
                }
                runBINANATimeout = setTimeout(() => {
                    BINANAInterface.setup(viewer, this.$store.state["receptorMol"], this.$store.state["ligandMol"]);
                    BINANAInterface.start(this["receptorContents"], this["ligandContents"]);
                }, 250);
            }

            // Stop waiting state.
            jQuery("body").removeClass("waiting");
        }, 50);
    },

    /**
     * Runs when a receptor has been added.
     * @param  {any} mol  The 3dmol.js molecule object.
     * @returns void
     */
    receptorAdded(mol: any): void {
        // Make the atoms of the protein clickable if it is receptor.
        if (this["type"] === "receptor") {
            this.makeAtomsClickable(mol);
        }

        this.showSurfaceAsAppropriate();
        showSticksAsAppropriate();
    },

    /**
     * Runs when a ligand has been added.
     * @param  {any} mol  The 3dmol.js molecule object.
     * @returns void
     */
    ligandAdded(mol, isCrystal = false): void {
        let stickStyle = {};
        mol.setStyle({}, {
            "stick": { "radius": 0.4 }
        });
        viewer["render"]();
    },

    /**
     * Makes the atoms of a 3dmol.js molecule clicable.
     * @param  {any} mol  The 3dmol.js molecule.
     * @returns void
     */
    makeAtomsClickable(mol: any): void {
        mol.setClickable({}, true, (e) => {
            this.$store.commit("setBinanaParam", {
                name: "center_x",
                val: e["x"]
            });
            this.$store.commit("setBinanaParam", {
                name: "center_y",
                val: e["y"]
            });
            this.$store.commit("setBinanaParam", {
                name: "center_z",
                val: e["z"]
            });
        });

        // Also make labels.
        var atoms = mol.selectedAtoms({});
        let len = atoms.length;
        if (len <= 5000) {
            // If there are a lot of atoms, this becomes slow. So only if <
            // 5000 atoms.
            for (var i = 0; i < len; i++) {
                let atom = atoms[i];
                viewer["setHoverable"]({}, true, (atom: any) => {
                    let lbl = atom["resn"].trim() + atom["resi"].toString() + ":" + atom["atom"].trim();
                    atom["chain"] = atom["chain"].trim();
                    if (atom["chain"] !== "") {
                        lbl += ":" + atom["chain"];
                    }
                    viewer["addLabel"](lbl, {"position": atom, "backgroundOpacity": 0.8});
                }, (atom: any) => {
                    viewer["removeAllLabels"]();
                })
            }
        }
    },

    /**
     * Sets a BINANA parameter only if it is currently undefined. Used
     * for setting default values, I think.
     * @param  {string} name  The variable name.
     * @param  {any}    val   The value.
     * @returns void
     */
    // TODO: Cruft?
    // setBinanaParamIfUndefined(name: string, val: any): void {
    //     if (this.$store.state["binanaParams"][name] === undefined) {
    //         this.$store.commit("setBinanaParam", {
    //             name,
    //             val
    //         });
    //         this.$store.commit("setValidationParam", {
    //             name,
    //             val: true
    //         })
    //     }
    // },

    /**
     * Show a molecular surface representation if it is appropriate
     * given user settings.
     * @returns void
     */
    showSurfaceAsAppropriate(): void {
        // If no protein has been loaded, no need to proceed.
        if (this.$store.state["receptorMol"] === undefined) {
            return;
        }

        if (this["renderProteinSurface"] === true) {
            // You're supposed to render the surface. What if it
            // doesn't exist yet?
            if (this["surfaceObj"] === undefined) {
                viewer["removeAllSurfaces"]();
                this["surfaceObj"] = viewer["addSurface"](
                    $3Dmol.SurfaceType.MS, {
                        "color": 'white',
                        "opacity": 0.85
                    },
                    {
                        "model": this.$store.state["receptorMol"]
                    }
                );
            }

            // Now it exists for sure. Make sure it is visible.
            viewer["setSurfaceMaterialStyle"](
                this["surfaceObj"]["surfid"],
                {
                    "color": 'white',
                    "opacity": 0.85
                }
            )
            viewer["render"]();
        } else {
            // So you need to hide the surface, if it exists.
            if (this["surfaceObj"] !== undefined) {
                viewer["setSurfaceMaterialStyle"](
                    this["surfaceObj"]["surfid"],
                    { "opacity": 0 }
                );
                viewer["render"]();
            }
        }
    },

    /**
     * Toggles the surface representation on and off.
     * @returns void
     */
    "toggleSurface"(): void {
        this["renderProteinSurface"] = !this["renderProteinSurface"];
        this.showSurfaceAsAppropriate();
    },

    /**
     * Toggles the sricks representation on and off.
     * @returns void
     */
    "toggleSticks"(): void {
        this.$store.commit("setVar", {
            name: "renderProteinSticks",
            val: !this.$store.state["renderProteinSticks"]
        })
        showSticksAsAppropriate();
    },

    /**
     * Shows a warning modal if the given molecule has no hydrogen atoms.
     * @param  {*} mol  The molecule.
     * @returns void
     */
    msgIfNoHydrogens(mol: any): void {
        let elements = mol["selectedAtoms"]({}).map(a => a["elem"]);
        if (elements.indexOf("H") === -1) {
            // No hydrogens
            this.$store.commit("openModal", {
                title: "Warning!",
                body: `<p>
                    One of your files has no hydrogen atoms. BINANA may not be
                    able to identify some interactions (e.g., hydrogen bonds).
                    Consider using <a href="http://server.poissonboltzmann.org/"
                    target="_blank">PDB2PQR</a> to add hydrogen atoms to your
                    receptor, and/or <a href="http://durrantlab.com/gypsum-dl/"
                    target="_blank">Gypsum-DL</a> to add hydrogen atoms to your
                    ligand.
                </p>
                <p>
                    You may also get this error if one or more of your files is
                    improperly formatted.
                </p>`
            });
        }
    }
}

/** An object containing the vue-component watch functions. */
let watchFunctions = {
    /**
     * Watch when the receptorContents computed property.
     * @param  {string} oldReceptorContents  The old value of the property.
     * @param  {string} newReceptorContents  The new value of the property.
     * @returns void
     */
    "receptorContents": function (oldReceptorContents: string, newReceptorContents: string): void {
        // The purpose of this is to react when new receptorContents
        // are added.

        let duration: number = (newReceptorContents === "") ? 0 : 500;
        this.modelAdded(duration);
    },

    /**
     * Watch when the ligandContents computed property.
     * @param  {string} oldLigandContents  The old value of the property.
     * @param  {string} newLigandContents  The new value of the property.
     * @returns void
     */
    "ligandContents": function (oldLigandContents: string, newLigandContents: string): void {
        // The purpose of this is to react when new ligandContents are
        // added.
        let duration: number = (newLigandContents === "") ? 0 : 500;
        this.modelAdded(duration);
    },
}

/**
 * The vue-component mounted function.
 * @returns void
 */
function mountedFunction(): void {
    this["renderProteinSurface"] = this["proteinSurface"];
}

/**
 * Setup the threedmol Vue commponent.
 * @returns void
 */
export function setup(): void {
    Vue.component('threedmol', {
        /**
         * Get the data associated with this component.
         * @returns any  The data.
         */
        "data"() {
            return {
                "surfaceObj": undefined,
                "receptorPdbOfLoaded": "",  // To prevent from loading twice.
                "ligandPdbOfLoaded": "",  // To prevent from loading twice.
                "renderProteinSurface": undefined,
            }
        },
        "computed": computedFunctions,
        "template": `
            <div class="container-3dmol" style="display:grid;">
                <div
                    :id="type + '-3dmol'"
                    style="height: 400px; width: 100%; position: relative;">

                    <!-- v-if="!appropriatePdbLoaded" -->
                    <!-- :title="'Missing ' + type.substring(0, 1).toUpperCase() + type.substring(1)" -->

                    <b-card
                        class="text-center"
                        style="width: 100%; height: 100%;"
                        title="Missing Receptor and/or Ligand"
                    >
                        <b-card-text v-if="autoLoad">
                            Loading...
                        </b-card-text>
                        <b-card-text v-else>
                            Use the file inputs above to select the receptor and ligand files.
                        </b-card-text>
                    </b-card>
                    <!--
                    <b-card v-else
                        class="text-center"
                        :title="'Missing ' + type.substring(0, 1).toUpperCase() + type.substring(1)"
                        style="width: 100%; height: 100%;"
                    >
                        Currently loading...
                    </b-card>  -->
                </div>
                <div v-if="type!=='ligand'" style="margin-top:-34px; padding-right:9px;" class="mr-1">
                    <form-button :variant="surfBtnVariant" @click.native="toggleSurface" :small="true">Surface</form-button>
                    <form-button :variant="allAtmBtnVariant" @click.native="toggleSticks" :small="true">All Atoms</form-button>
                    </div>
                    </div>
                    `,
        "watch": watchFunctions,
        "props": {
            "type": String, // receptor, ligand, or docked. Used only to
                            // determine if it's been loaded yet.
            "proteinSurface": {
                "type": Boolean,
                "default": false
            },
            "autoLoad": {
                "type": Boolean,
                "default": false
            }
        },
        "methods": methodsFunctions,

        /**
         * Runs when the vue component is mounted.
         * @returns void
         */
        "mounted": mountedFunction
    })
}

/**
 * Given an atom name, returns the name of the element.
 * @param  {string} atomName  The atom name.
 * @returns string  The name of the element.
 */
export function elementFromAtomName(atomName: string): string {
    atomName = atomName.trim().replace(/[0-9]/g, "").substr(0, 2).toUpperCase();
    if (["BR", "CL", "ZN", "MG", "AU", "MN", "FE"].indexOf(atomName) !== -1) {
        return atomName;
    } else {
        return atomName.substring(0, 1);
    }
}

/**
 * Converts a pdbqt string to pdb.
 * @param  {string}           pdbqtTxt  The pdbqt text.
 * @param  {any=undefined}    store?    A VueX store object.
 * @returns string  The pdb text.s
 */
export function pdbqtToPDB(pdbqtTxt: string, store?: any): string {
    let lines: string[] = pdbqtTxt.split("\n");

    lines = lines.map(l => l.replace(/^HETATM/g, "ATOM  "))
    lines = lines.filter(l => {
        if (l.substring(0, 4) === "ATOM") {
            return true;
        }
        return false;
    });

    // Get the element names
    let elements = lines.map(l => elementFromAtomName(l.substring(11, 17)));

    lines = lines.map((l, i) => {
        return l.substring(0, 77) + elements[i];
    });

    pdbqtTxt = lines.join("\n");
    return pdbqtTxt;
}

/**
 * Justifies text. Useful for constructing the PDB string.
 * @param  {string}  str           The string to justify.
 * @param  {number}  cols          The number of columns.
 * @param  {boolean} [right=true]  Whether to right justify (vs. left).
 * @param  {string}  [deflt="X"]   The default value if str is undefined.
 * @returns string  The justified string.
 */
function justify(str: string, cols: number, right = true, deflt = "X"): string {
    if (str === undefined) {
        str = deflt;
    }

    if (str.length > cols) {
        // String is too long. Trim it.
        if (right) {
            return str.slice(str.length - cols);
        } else {
            return str.slice(0, cols);
        }
    } else {
        // String is not too long. Pad it.
        let padNum = cols - str.length;
        for (let i = 0; i < padNum; i++) {
            if (right) {
                str = " " + str;
            } else {
                str = str + " ";
            }
        }
        return str;
    }
}

/**
 * Given a 3Dmol.js molecule, create a PDB-formatted string.
 * @param  {*} mol  The 3Dmol.js molecule.
 * @returns string  The PDB-formatted string.
 */
function mol3DToPDB(mol: any): string {
    let atoms: any[] = mol.selectedAtoms({});
    const atomsLen = atoms.length;
    let pdbTxt = "";
    for (let i = 0; i < atomsLen; i++) {
        const atom = atoms[i];
        if (atom["pdbline"] !== undefined) {
            // pdbline already exists, so just use that.
            pdbTxt += atom["pdbline"] + "\n";
        } else {
            // You will need to reconstruct the pdb line.
            let hetFlag = atom["hetflag"] ? "ATOM  " : "HETATM";
            let idx = justify((i + 1).toString(), 5, true);  // right

            let atomName = justify(atom["atom"], 5, true, "X");  // left. note not exactly correct, but works for deepfrag.
            let resName = justify(atom["resn"], 4, true, "XXX");  // right
            let chain = justify(atom["chain"], 2, true, "X");  // right
            let resnum = justify(atom["resi"], 4, true, "1");  // right

            let x = justify(atom["x"].toFixed(3), 11, true, "0.000");
            let y = justify(atom["y"].toFixed(3), 8, true, "0.000");
            let z = justify(atom["z"].toFixed(3), 8, true, "0.000");

            let elem = justify(atom["elem"], 2, true, "X");

            pdbTxt += hetFlag + idx + atomName + resName + chain + resnum + " " + x + y + z + "  1.00  0.00          " + elem + "\n";
        }
    }

    return pdbTxt;
}

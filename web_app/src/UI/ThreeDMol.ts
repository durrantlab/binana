// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2020 Jacob D. Durrant.

import * as BINANAInterface from "../BINANAInterface";
import * as OpenModal from "../UI/Modal/OpenModal";
import { store } from "../Vue/Store";

declare var $3Dmol;
declare var jQuery;
declare var Vue;

export var viewer;
let bigMolAlreadyModalDisplayed = false;

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
    binanaParams(): string {
        return this.$store.state["binanaParams"];
    },

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
    appropriateReceptorPdbLoaded(): boolean {
        return this.$store.state["receptorContents"] !== "";
        //  || this.$store.state["crystalContents"] !== "";
    },

    /**
     * Determines whether the appropriate ligand PDB content has been
     * loaded.
     * @returns boolean  True if it has been loaded, false otherwise.
     */
    appropriateLigandPdbLoaded(): boolean {
        return this.$store.state["ligandContents"] !== "";
    },
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
        // First, check to make sure the added model is relevant to this
        // 3dmoljs instance.
        // if (this["appropriatePdbLoaded"] === false) {
            // return;
        // }

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

            let loadPDBTxt = (typeStr: string): any => {
                let origPDBContent = this[typeStr + "Contents"];
                let pdb = pdbqtToPDB(origPDBContent, this.$store);
                if (pdb !== "") {
                    if (this[typeStr + "PdbOfLoaded"] !== pdb) {
                        // console.log(this["type"], "Adding " + typeStr, pdb.length);
                        this[typeStr + "PdbOfLoaded"] = pdb;

                        viewer["removeModel"](this[typeStr + "Mol"]);
                        viewer["resize"]();

                        this[typeStr + "Mol"] = viewer["addModel"](pdb, "pdb", {"keepH": true});

                        this.msgIfNoHydrogens(this[typeStr + "Mol"]);

                        // newModel = this[typeStr + "Mol"];
                        // callBack(this[typeStr + "Mol"]);
                        return this[typeStr + "Mol"];
                    }
                } else if (origPDBContent !== "") {
                    // It's empty, but shouldn't be. Probably not
                    // properly formed.

                    // viewer.removeModel(this[typeStr + "Mol"]);
                    // viewer.removeAllShapes();
                    // viewer.resize();

                    this.$store.commit("openModal", {
                        title: "Invalid Input File!",
                        body: "<p>The selected input file is not properly formatted. The molecular viewer has not been updated. Please select a properly formatted PDBQT or PDB file, as appropriate.</p>"
                    });
                }
            }

            viewer["removeAllSurfaces"]();
            this["surfaceObj"] = undefined;

            let receptorModel = loadPDBTxt("receptor");
            if (receptorModel !== undefined) {
                this.$store.commit("setVar", {
                    name: "receptorMol", val: receptorModel
                });
                this.receptorAdded(receptorModel);
            }

            //     if (somethingChanged === true) {
            //         // viewer.resize();  // To make sure. Had some problems in testing.
            //         viewer.render();
            //         viewer.zoomTo({"model": newModel}, duration);
            //         viewer.zoom(0.8, duration);
            //     }
            // // }

            // if (["ligand"].indexOf(this["type"]) !== -1) {
            let ligandModel = loadPDBTxt("ligand");
            if (ligandModel !== undefined) {
                this.ligandAdded(ligandModel);
                this.$store.commit("setVar", {
                    name: "ligandMol",
                    val: ligandModel
                })
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
                BINANAInterface.setup(viewer, this.$store.state["receptorMol"], this.$store.state["ligandMol"]);
                BINANAInterface.start(this["receptorContents"], this["ligandContents"]);
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

        // if (isCrystal === true) {
        //     this.makeAtomsClickable(mol);
        //     this.showCrystalAsAppropriate();
        // }
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
     * Sets a vina parameter only if it is currently undefined. Used
     * for setting default values, I think.
     * @param  {string} name  The variable name.
     * @param  {any}    val   The value.
     * @returns void
     */
    setBinanaParamIfUndefined(name: string, val: any): void {
        if (this.$store.state["binanaParams"][name] === undefined) {
            this.$store.commit("setBinanaParam", {
                name,
                val
            });
            this.$store.commit("setValidationParam", {
                name,
                val: true
            })
        }
    },

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
        // this["renderProteinSticks"] = !this["renderProteinSticks"];
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
                body: "<p>This file has no hydrogen atoms. BINANA may not be able to identify some interactions (e.g., hydrogen bonds).</p>"
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
        // this.updateBox();  // So when invalid pdb loaded, can recover with valid pdb.
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
                // "viewer": undefined,
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
        // <form-button v-if="crystalContents!==''" @click.native="toggleCrystal" :variant="crystalBtnVariant" :small="true">Correct Pose</form-button>
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
    let elements = lines.map(l => l.substring(11, 17).trim().replace(/[0-9]/g, "").substr(0, 2).toUpperCase());
    elements = elements.map((e) => {
        if (["BR", "CL", "ZN", "MG", "AU", "MN", "FE"].indexOf(e) !== -1) {
            return e;
        } else {
            return e.substring(0, 1);
        }
    });

    lines = lines.map((l, i) => {
        return l.substring(0, 77) + elements[i];
    });

    // let numAtoms = lines.length;

    // // You may need to remove some atoms if there are to many atoms.
    // let msg = "";
    // if (lines.length > 5000) {
    //     // Remove hydrogen atoms
    //     lines = lines.filter(l => l.slice(12, 16).replace(/ /g, '').replace(/[0-9]/g, "").slice(0, 1).toUpperCase() !== "H");
    //     msg = "hydrogen atoms";
    // }

    // if (lines.length > 5000) {
    //     // Remove sidechains
    //     lines = lines.filter(l => ["CA", "O", "C", "N"].indexOf(l.slice(12, 16).replace(/ /g, '')) !== -1);
    //     msg = "hydrogen atoms and side chains";
    // }

    // if (lines.length > 5000) {
    //     // Remove O too.
    //     lines = lines.filter(l => l.slice(12, 16).replace(/ /g, '') !== "O");
    //     msg = "hydrogen atoms, side chains, and backbone carbonyl oxygen atoms";
    // }

    // if ((bigMolAlreadyModalDisplayed === false) && (msg !== "") && (store !== undefined)) {
    //     bigMolAlreadyModalDisplayed = true;
    //     store.commit("openModal", {
    //         title: "Large Molecule!",
    //         body: "<p>The PDB or PDBQT file you provided contains " + numAtoms.toString() + " atoms. A version of your file without " + msg + " will be displayed to speed visualization.</p>"
    //     });
    // }

    pdbqtTxt = lines.join("\n");
    return pdbqtTxt;
}

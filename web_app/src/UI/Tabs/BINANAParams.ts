// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2021 Jacob D. Durrant.

import * as Utils from "../../Utils";
import * as BINANAInterface from "../../BINANAInterface";
import * as Store from "../../Vue/Store";
import { viewer } from "../ThreeDMol";
import { IFileInfo, IFileLoadError, IResidueInfo } from "../FileLoaderSystem/Common/Interfaces";

var FileSaver = require('file-saver');

declare var Vue;

/** An object containing the vue-component computed functions. */
let computedFunctions = {
    /**
     * Gets text describing the current interaction coloring scheme.
     * DEPRECIATED, but leave commented out in case you bring it back in the
     * future.
     * @returns string  The text.
     */
    // "colorByInteractionBtnTxt"(): string {
    //     switch (this.$store.state["colorByInteraction"]) {
    //         case Store.InteractionColoring.MOLECULE:
    //             return "By Molecule";
    //         case Store.InteractionColoring.INTERACTION:
    //             return "By Interaction";
    //         case Store.InteractionColoring.NONE:
    //             return "None";
    //     }
    // },

    /**
     * DEPRECIATED. Gets the text too use on the bond-visible buttton.
     * @returns string  The text to use.
     */
    // "bondVisBtnTxt"(): string {
    //     if (this.$store.state["bondVisible"]) {
    //         return "Interactions";
    //     } else {
    //         return "<span style='text-decoration: line-through;'>Interactions</span>";
    //     }
    // },

    interactionVisibilityStatus: {
        get(): string {
            return this.$store.state["interactionVisibilityStatus"];
        },
        set(val: string): void {
            this.$store.commit("setVar", {
                name: "interactionVisibilityStatus",
                val: val
            })
        }
    },

    "legendItems"() {
        let legendItems = this.$store.state["legendItems"];
        
        legendItems = legendItems.filter((l) => {
            let interactionName = l["interactionName"];
            return this.$store.state["bondTypesDetected"][interactionName];
        });
        
        legendItems = legendItems.map((l) => {
            delete l["interactionName"];
            return l;
        });
        
        return legendItems;
    },

    "missingHydrogensWarning"(): string {
        let receptorHasHydrogens = this.$store.state["receptorHasHydrogens"];
        let ligandHasHydrogens = this.$store.state["ligandHasHydrogens"];
        if (receptorHasHydrogens && ligandHasHydrogens) {
            // Hydrogens added to both, so return "".
            return "";
        }

        let msg = "";
        if (!receptorHasHydrogens && !ligandHasHydrogens) {
            // Neither has hydrogen atoms.
            msg += "Do your receptor and ligand files include hydrogen atoms? ";
        } else if (!receptorHasHydrogens) {
            msg += "Does your receptor file include hydrogen atoms? ";
        } else {
            msg += "Does your ligand file include hydrogen atoms? ";
        }
        
        msg += "You can further improve BINANA accuracy by adding them if appropriate. ";
        
        if (!receptorHasHydrogens) {
            msg += `To add hydrogen atoms to your receptor, consider using
        <a href="http://molprobity.biochem.duke.edu/"
        target="_blank">MolProbity</a> or
        <a href="http://server.poissonboltzmann.org/"
        target="_blank">PDB2PQR</a>. `
        }

        if (!ligandHasHydrogens) {
            msg += `To add hydrogen atoms to your
        ligand, consider <a href="http://durrantlab.com/gypsum-dl/"
        target="_blank">Gypsum-DL</a> or <a
        href="https://avogadro.cc/docs/menus/build-menu/"
        target="_blank">Avogadro</a>.`
        }

        return msg;
    }
}

/** An object containing the vue-component methods functions. */
let methodsFunctions = {
    /**
     * Runs when user indicates theye want to use example BINANA files,
     * rather than provide their own.
     * @returns void
     */
    "useExampleInputFiles"(): void {
        this["showFileInputs"] = false;

        setTimeout(() => {  // Vue.nextTick doesn't work...
            // Update some values.
            this.$store.commit("setVar", {
                name: "receptorContents",
                val: this.$store.state["receptorContentsExample"]
            });

            this.$store.commit("setVar", {
                name: "ligandContents",
                val: this.$store.state["ligandContentsExample"]
            });

            // Also update file names so example BINANA command line is valid.
            this.$store.commit("updateFileName", { type: "ligand", filename: "ATP.pdbqt" });
            this.$store.commit("updateFileName", { type: "receptor", filename: "1xdn.pdbqt" });

            // These values should now validate.
            let validateVars = ["receptor", "ligand"];
            const validateVarsLen = validateVars.length;
            for (let i = 0; i < validateVarsLen; i++) {
                const validateVar = validateVars[i];
                this.$store.commit("setValidationParam", {
                    name: validateVar,
                    val: true
                });
            }
        }, 100);
    },

    /**
     * Displays a modal with a video tutorial.
     * @returns void
     */
    "videoTutorial"(): void {
        this.$store.commit("openModal", {
            title: "Video Tutorial",
            body: `<iframe style="height: 479px; box-shadow: 0px 0px 5px rgb(150 150 150);" id="tutorial-iframe" width="100%" height="315" src="https://www.youtube.com/embed/BMnSYvH4Qwg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
        });

        setTimeout(() => {
            let iframe = document.querySelectorAll("#tutorial-iframe")[0] as HTMLIFrameElement;
            let width = iframe.offsetWidth;
            let height = Math.round(width / 1.6);
            iframe.style.height = height.toString() + "px";
        }, 1000);
    },

    /**
     * Highlights interactions in the 3Dmoljs viewer.
     * @param  {string} interactionName  The name of the interaction type to
     *                                   highlight.
     * @returns void
     */
    "updateHighlight"(interactionName: string): void {
        if (interactionName === undefined) {
            interactionName = this.lastInteractionNameUsed;
        } else {
            this.lastInteractionNameUsed = interactionName;
        }

        if (interactionName === undefined) {
            // Apparently, this.lastInteractionNameUsed not set either (For
            // example, happens when click on interactions between any specific
            // kind of interaction).
            return;
        }

        // update interactionVisibilityStatus
        let interactionVisibilityStatus = JSON.parse(this.interactionVisibilityStatus);
        interactionVisibilityStatus[interactionName] =
            (interactionVisibilityStatus[interactionName] === undefined)
            ? true : !interactionVisibilityStatus[interactionName];
        this.interactionVisibilityStatus = JSON.stringify(interactionVisibilityStatus);

        BINANAInterface.highlightAll();
    },

    /**
     * Clears the interactions currently displayed in the 3Dmoljs viewer.
     * @returns void
     */
    "clearInteraction"(): void {
        this.interactionVisibilityStatus = Store.defaultInteractionVisibilityStatus;
        BINANAInterface.highlightAll();
    },

    /**
     * DEPRECIATED. Fires when the user indicates s/he would like to change the
     * color scheme.
     * @returns void
     */
    // "onChangeColor"(): void {
    //     let newVal = undefined;
    //     switch (this.$store.state["colorByInteraction"]) {
    //         case Store.InteractionColoring.MOLECULE:
    //             newVal = Store.InteractionColoring.INTERACTION;
    //             break;
    //         case Store.InteractionColoring.INTERACTION:
    //             newVal = Store.InteractionColoring.NONE;

    //             // If none, make sure bonds are visible.
    //             this.$store.commit("setVar", {
    //                 name: "bondVisible",
    //                 val: true
    //             });

    //             break;
    //         case Store.InteractionColoring.NONE:
    //             newVal = Store.InteractionColoring.MOLECULE;
    //             break;
    //     }

    //     this.$store.commit("setVar", {
    //         name: "colorByInteraction",
    //         val: newVal
    //     });

    //     this["updateHighlight"]();
    // },

    /**
     * Runs when the bond-visibility button is pressed. DEPRECIATED, but keep
     * commented out in case you bring it back in the future.
     * @returns void
     */
    // "onBondVisChange"(): void {
    //     this.$store.commit("setVar", {
    //         name: "bondVisible",
    //         val: !this.$store.state["bondVisible"]
    //     });

    //     this["updateHighlight"]();
    // },

    /**
     * Runs when the save button is pressed.
     * @returns void
     */
    "onSaveFiles"(): void {
        let getJSZip = import(
            /* webpackChunkName: "JSZip" */ 
            /* webpackMode: "lazy" */
            '../../../node_modules/jszip/lib/index'
        ).then((mod) => {
            // @ts-ignore
            return Promise.resolve(mod.default);
        });

        let getBinana = import(
            /* webpackChunkName: "binana" */ 
            /* webpackMode: "lazy" */
            '../../binanajs/binana'
        );

        Promise.all([getJSZip, getBinana]).then((mods) => {
            let JSZip;
            let binana;
            [JSZip, binana] = mods;

            var zip = new JSZip();
            let dataURI = viewer.pngURI();
            let pngBlob = Utils.dataURIToBlob(dataURI);
    
            zip["folder"]("binana_output")["file"]
                // TODO: was receptor.txt. Why?
                ("receptor.pdb", this.$store.state["receptorContents"]
            );
    
            zip["folder"]("binana_output")["file"](
                // TODO: was ligand.txt. Why?
                "ligand.pdb", this.$store.state["ligandContents"]
            );
    
            zip["folder"]("binana_output")["file"](
                "binana.json", this.$store.state["filesToSave"]["output.json"]
            );
    
            zip["folder"]("binana_output")["file"](
                "binana.csv", this.$store.state["filesToSave"]["output.csv"]
            );
    
            zip["folder"]("binana_output")["file"](
                "log.txt", this.$store.state["filesToSave"]["log.txt"]
            );
    
            for (let flnm in this.$store.state["filesToSave"]) {
                zip["folder"]("binana_output")["file"](
                    "vmd/" + flnm, this.$store.state["filesToSave"][flnm]
                );
            }
    
            zip["folder"]("binana_output")["file"](
                "image.png", pngBlob
            );
            zip["generateAsync"]({["type"]:"blob"}).then(
                function (blob) {
                    FileSaver["saveAs"](blob, "binana_output.zip");
                }
            );
        });
    },

    /**
     * Determines whether all form values are valid.
     * @param  {boolean=true} modalWarning  Whether to show a modal if
     *                                      they are not valid.
     * @returns boolean  True if they are valid, false otherwise.
     */
    "validate"(modalWarning: boolean=true): boolean {
        let validations = this.$store.state["validation"];

        let pass = true;

        const paramName = Object.keys(validations);
        const paramNameLen = paramName.length;
        let badParams: string[] = [];
        for (let i = 0; i < paramNameLen; i++) {
            const name = paramName[i];

            if (name === "output") {
                // This one isn't part of the validation.
                continue;
            }

            const valid = validations[name];
            if (valid === false) {
                pass = false;
                badParams.push(name);
            }
        }

        if (pass === false) {
            if (modalWarning === true) {
                this.$store.commit("openModal", {
                    title: "Invalid Parameters!",
                    body: "<p>Please correct the following parameter(s) before continuing: <code>" + badParams.join(" ") + "</code></p>"
                });
            }
        }

        this.$store.commit("setVar", {
            name: "binanaParamsValidates",
            val: pass
        })

        return pass;
    },

    "getInteractionVisibility"(interactionID: string): boolean {
        let interactionVisibilityStatus = JSON.parse(this.interactionVisibilityStatus);
        if (interactionVisibilityStatus[interactionID] === undefined) {
            return false;
        }
        return interactionVisibilityStatus[interactionID];
    },

    "onError"(msg: IFileLoadError) {
        this.$store.commit("openModal", {
            title: msg.title,
            body: `${msg.body}`
        });
    },

    "onReceptorFileReady"(fileInfo: IFileInfo) {
        this.$store.commit("setVar", {
            name: "receptorContents",
            val: fileInfo.fileContents,
        });
        this.$store.commit("updateFileName", {
            type: "receptor",
            filename: fileInfo.filename,
        });
    },

    "onLigandFileReady"(fileInfo: IFileInfo) {
        this.$store.commit("setVar", {
            name: "ligandContents",
            val: fileInfo.fileContents,
        });
        this.$store.commit("updateFileName", {
            type: "ligand",
            filename: fileInfo.filename,
        });
    },

    "onExtractReceptorAtomsToLigand"(residueInfo: IResidueInfo): void {
        // Get the existing ligand contents
        let ligContents = residueInfo.residuePdbLines;
        let ligFilename = residueInfo.residueId.filter(r => [undefined, ""].indexOf(r) === -1).join("-") + ".pdb";

        this.$refs["ligandMolLoader"]["loadMolFromExternal"](
            ligFilename, ligContents
        );
    },

    /**
     * Shows more details about how the interactions are detected.
     * @returns void
     */
    "moreDetails"(): void {
        let getInteractionsMD = fetch("INTERACTIONS.md")
            .then((response) => response.text())
            .then((data) => Promise.resolve(data));

        let getMarkdownIt = import(
            /* webpackChunkName: "MarkdownIt" */ 
            /* webpackMode: "lazy" */
            'markdown-it'
        ).then((mod) => {
            // @ts-ignore
            let MarkdownIt = mod.default;
            return Promise.resolve(MarkdownIt);
        });

        Promise.all([getInteractionsMD, getMarkdownIt]).then((payload) => {
            let interactions: string;
            let MarkdownIt: any;
            [interactions, MarkdownIt] = payload;
            let md = new MarkdownIt();
            var result = md.render(interactions);
            this.$store.commit("openModal", {
                title: "Detecting Intramolecular Interactions",
                body: result
                    .replace(/h1\>/g, "h5>")
                    .replace(/\<a /g, '<a target="_blank" ')
                    .replace(/\<table/g, '<table style="margin-bottom:8px;"')
                    .replace(/\<td/g, '<td style="min-width:45px;font-size:80%;padding:4px;"')
                    .replace(/\<th/g, '<th style="min-width:45px;font-size:80%;padding:4px;"')
            });
        })
    }
}

/**
 * The vue-component mounted function.
 * @returns void
 */
function mountedFunction(): void {}

/**
 * Setup the binana-params Vue commponent.
 * @returns void
 */
export function setup(): void {
    Vue.component('binana-params', {
        "template": /* html */ `
            <div>
                <sub-section
                    v-if="$store.state.receptorContents === '' || $store.state.ligandContents === ''"
                >
                    <div role="tablist">
                        <b-card no-body class="mb-1">
                            <b-card-header header-tag="header" class="p-1" role="tab">
                                <b-button block href="#" v-b-toggle.accordion-3 variant="default">Advanced Parameters</b-button>
                            </b-card-header>
                            <b-collapse id="accordion-3" role="tabpanel">
                                <b-card-body>
                                    <b-card class="mb-2 text-center" style="margin-bottom:1.4rem !important;">
                                        <b-card-text>Parameters used to identify close contacts.</b-card-text>
                                        <numeric-input
                                            label="Closest Contacts Dist1 Cutoff"
                                            id="close_contacts_dist1_cutoff"
                                            description="Ligand/protein atoms that come within this number of
                                            angstroms are &quot;closest contacts.&quot;" placeholder="$store.state.close_contacts_dist1_cutoff"
                                        ></numeric-input>
                                        <numeric-input
                                            label="Close Contacts Dist2 Cutoff"
                                            id="close_contacts_dist2_cutoff"
                                            description="Ligand/protein atoms that come within this number of
                                            angstroms are &quot;close contacts.&quot;" placeholder="$store.state.close_contacts_dist2_cutoff"
                                        ></numeric-input>
                                        <div class="learnMoreLink"><b-link href="#" @click="moreDetails">(Learn more about advanced parameters)</b-link></div>
                                    </b-card>
                                    <!-- <numeric-input
                                        label="Electrostatic Dist Cutoff"
                                        id="electrostatic_dist_cutoff"
                                        description="<b>???</b>" placeholder="$store.state.electrostatic_dist_cutoff"
                                    ></numeric-input> -->
                                    <!-- <numeric-input
                                        label="Active Site Flexibility Dist Cutoff"
                                        id="active_site_flexibility_dist_cutoff"
                                        description="<b>???</b>" placeholder="$store.state.active_site_flexibility_dist_cutoff"
                                    ></numeric-input> -->

                                    <b-card class="mb-2 text-center" style="margin-bottom:1.4rem !important;">
                                        <b-card-text>Parameters used to identify hydrogen and halogen bonds.</b-card-text>
                                        <numeric-input
                                            label="Hydrogen Bond Dist Cutoff"
                                            id="hydrogen_bond_dist_cutoff"
                                            description="A hydrogen bond is identified if the hydrogen-bond
                                            donor comes within this number of angstroms of the hydrogen-bond
                                            acceptor." placeholder="$store.state.hydrogen_bond_dist_cutoff"
                                        ></numeric-input>
                                        <numeric-input
                                            label="Hydrogen and Halogen Bond Angle Cutoff"
                                            id="hydrogen_halogen_bond_angle_cutoff"
                                            description="A hydrogen or halogen bond is identified if the angle formed
                                            between the donor, the hydrogen/halide atom, and the acceptor is no
                                            greater than this number of degrees." placeholder="$store.state.hydrogen_halogen_bond_angle_cutoff"
                                        ></numeric-input>
                                        <numeric-input
                                            label="Halogen Bond Dist Cutoff"
                                            id="halogen_bond_dist_cutoff"
                                            description="A halogen bond is identified if the halogen-bond
                                            donor comes within this number of angstroms of the halogen-bond
                                            acceptor." placeholder="$store.state.halogen_bond_dist_cutoff"
                                        ></numeric-input>
                                        <div class="learnMoreLink"><b-link href="#" @click="moreDetails">(Learn more about advanced parameters)</b-link></div>
                                    </b-card>

                                    <b-card class="mb-2 text-center" style="margin-bottom:1.4rem !important;">
                                        <b-card-text>
                                            <div style='text-align:left;'>
                                                Parameters used to identify interactions between
                                                aromatic rings. Once an aromatic ring is identified, a plane is
                                                defined that passes through three ring atoms. The center of
                                                the ring is the average of all ring-atom coordinates,
                                                and the radius is the maximum distance between the center and
                                                any of those atoms. A ring disk is centered on the ring center
                                                point, oriented along the ring plane.
                                            </div>
                                        </b-card-text>

                                        <numeric-input
                                            label="π Padding Dist"
                                            id="pi_padding_dist"
                                            description="The radius of the ring disk is equal to that of the
                                            ring plus a small buffer (this number of angstroms)." placeholder="$store.state.pi_padding_dist"
                                        ></numeric-input>
                                        <numeric-input
                                            label="π-π Interacting Dist Cutoff"
                                            id="pi_pi_interacting_dist_cutoff"
                                            description="A π-π or T-stacking interaction is identified
                                            if the centers of two aromatic rings are within this number of
                                            angstroms." placeholder="$store.state.pi_pi_interacting_dist_cutoff"
                                        ></numeric-input>
                                        <numeric-input
                                            label="π-Stacking Angle Tolerance"
                                            id="pi_stacking_angle_tolerance"
                                            description="A π-π stacking interaction is identified if the
                                            angle between the normal vectors of two aromatic rings is less
                                            than this number of degrees." placeholder="$store.state.pi_stacking_angle_tolerance"
                                        ></numeric-input>
                                        <numeric-input
                                            label="T-Stacking Angle Tolerance"
                                            id="T_stacking_angle_tolerance"
                                            description="A T-stacking interaction is identified if the
                                            angle between the normal vectors of two aromatic rings is within
                                            this number of degrees of being perpendicular." placeholder="$store.state.T_stacking_angle_tolerance"
                                        ></numeric-input>
                                        <numeric-input
                                            label="T-Stacking Closest Dist Cutoff"
                                            id="T_stacking_closest_dist_cutoff"
                                            description="A T-stacking interaction is identified if two aromatic
                                            rings are within this number of angstroms at their nearest point (see
                                            also -pi_pi_interacting_dist_cutoff parameter above)." placeholder="$store.state.T_stacking_closest_dist_cutoff"
                                        ></numeric-input>
                                        <numeric-input
                                            label="Cation-π Dist Cutoff"
                                            id="cation_pi_dist_cutoff"
                                            description="A Cation-π interaction is identified if a charged functional
                                            group comes within this distance of an aromaic-ring center." placeholder="$store.state.cation_pi_dist_cutoff"
                                        ></numeric-input>
                                        <div class="learnMoreLink"><b-link href="#" @click="moreDetails">(Learn more about advanced parameters)</b-link></div>
                                    </b-card>

                                    <b-card class="mb-2 text-center" style="margin-bottom:1.4rem !important;">
                                        <b-card-text>Parameters used to identify other notable interactions.</b-card-text>
                                        <numeric-input
                                            label="Salt Bridge Dist Cutoff"
                                            id="salt_bridge_dist_cutoff"
                                            description="Charged functional groups that come within this
                                            number of angstroms participate in &quot;electrostatic
                                            interactions.&quot;" placeholder="$store.state.salt_bridge_dist_cutoff"
                                        ></numeric-input>
                                        <numeric-input
                                            label="Hydrophobic Dist Cutoff"
                                            id="hydrophobic_dist_cutoff"
                                            description="Ligand/receptor carbon atoms that come within this
                                            number of angstroms participate in &quot;hydrophobic
                                            contacts.&quot;" placeholder="$store.state.hydrophobic_dist_cutoff"
                                        ></numeric-input>
                                        <numeric-input
                                            label="Metal Coordination Dist Cutoff"
                                            id="metal_coordination_dist_cutoff"
                                            description="Atoms such as nitrogens and oxygens that come within this
                                            number of angstroms of a metal cation participate in &quot;metal coordination
                                            contacts.&quot;" placeholder="$store.state.metal_coordination_dist_cutoff"
                                        ></numeric-input>
                                        <div class="learnMoreLink"><b-link href="#" @click="moreDetails">(Learn more about advanced parameters)</b-link></div>
                                    </b-card>
                                </b-card-body>
                            </b-collapse>
                        </b-card>
                    </div>
                </sub-section>

                <sub-section title="Input Files" v-if="showFileInputs">
                    <mol-loader
                        :allowDeleteHeteroAtoms="true"
                        :allowExtractHeteroAtoms="true"
                        :multipleFiles="false"
                        :fileLoaderPlugins="['pdb-id-input', 'file-loader-input']"
                        label="Receptor"
                        description="Formats: PDB, PDBQT. Consider first (1) adding polar hydrogen atoms if necessary and (2) removing any ligands from the file."
                        extraDescription=""
                        accept=".pdb, .pdbqt"
                        convert=""
                        :required="true"
                        @onError="onError"
                        @onFileReady="onReceptorFileReady"
                        @onExtractAtoms="onExtractReceptorAtomsToLigand"
                    ></mol-loader>
                    <!-- , 'url-input']" -->

                    <mol-loader
                        ref="ligandMolLoader"
                        :allowDeleteHeteroAtoms="false"
                        :allowExtractHeteroAtoms="false"
                        :multipleFiles="false"
                        :fileLoaderPlugins="['file-loader-input']"
                        label="Ligand"
                        description="Formats: PDB, PDBQT, SDF. Consider first adding polar hydrogen atoms if necessary."
                        extraDescription=""
                        accept=".pdb, .pdbqt, .sdf"
                        convert=""
                        :required="true"
                        @onError="onError"
                        @onFileReady="onLigandFileReady"
                    ></mol-loader>
                    <!-- , 'url-input']" -->

                    <form-button @click.native="useExampleInputFiles" cls="float-right">Use Example Files</form-button>  <!-- variant="default" -->
                    <form-button @click.native="videoTutorial" cls="float-right mr-2">Video Tutorial</form-button>  <!-- variant="default" -->
                </sub-section>

                <sub-section title="Molecular Viewer">
                    <form-group
                        label=""
                        id="input-group-receptor-3dmol"
                        description=""
                    >
                        <div class="bv-example-row container-fluid">
                            <b-row>
                                <b-col style="padding-left: 0; padding-right: 0;">
                                    <threedmol type="receptor"></threedmol>
                                </b-col>
                            </b-row>
                        </div>
                    </form-group>

                    <b-container
                        v-if="($store.state.receptorContents != '') && ($store.state.ligandContents != '')"
                    >
                        <div 
                            v-if="JSON.stringify($store.state.filesToSave) == '{}'"
                            style="font-weight:bold;text-align:center;"
                        >
                            <br /><br />
                            Identifying interactions...
                        </div>
                        <span v-else>
                            <b-row no-gutters>
                                <b-col no-gutters>
                                    <b-dropdown variant="primary" text="Common" block>
                                        <b-dropdown-item @click="updateHighlight('hydrogenBonds');">
                                            <check-mark :value="getInteractionVisibility('hydrogenBonds')">
                                                <div class="centerMenuItem" style="width:115px;">
                                                    Hydrogen Bonds
                                                </div>
                                            </check-mark>
                                        </b-dropdown-item>
                                        <b-dropdown-item @click="updateHighlight('halogenBonds');">
                                            <check-mark :value="getInteractionVisibility('halogenBonds')">
                                                <div class="centerMenuItem" style="width:115px;">
                                                    Halogen Bonds
                                                </div>
                                            </check-mark>
                                        </b-dropdown-item>
                                        <b-dropdown-item @click="updateHighlight('hydrophobicContacts');">
                                            <check-mark :value="getInteractionVisibility('hydrophobicContacts')">
                                                <div class="centerMenuItem" style="width:115px;">
                                                    Hydrophobic
                                                </div>
                                            </check-mark>
                                        </b-dropdown-item>
                                        <b-dropdown-item @click="updateHighlight('saltBridges');">
                                            <check-mark :value="getInteractionVisibility('saltBridges')">
                                                <div class="centerMenuItem" style="width:115px;">
                                                    Salt Bridge
                                                </div>
                                            </check-mark>
                                        </b-dropdown-item>
                                        <b-dropdown-item @click="updateHighlight('metalCoordinations');">
                                            <check-mark :value="getInteractionVisibility('metalCoordinations')">
                                                <div class="centerMenuItem" style="width:115px;">
                                                    Metal Coordination
                                                </div>
                                            </check-mark>
                                        </b-dropdown-item>
                                    </b-dropdown>
                                </b-col>
                                <b-col no-gutters>
                                    <b-dropdown variant="primary" text="Contacts" block>
                                        <b-dropdown-item @click="updateHighlight('closeContacts');">
                                            <check-mark :value="getInteractionVisibility('closeContacts')">
                                                <div class="centerMenuItem" style="width:55px;">
                                                    Close
                                                </div>
                                            </check-mark>
                                        </b-dropdown-item>
                                        <b-dropdown-item @click="updateHighlight('closestContacts');">
                                            <check-mark :value="getInteractionVisibility('closestContacts')">
                                                <div class="centerMenuItem" style="width:55px;">
                                                    Closest
                                                </div>
                                            </check-mark>
                                        </b-dropdown-item>
                                    </b-dropdown>
                                </b-col>
                                <b-col no-gutters>
                                    <b-dropdown variant="primary" text="Aromatic" block>
                                        <b-dropdown-item @click="updateHighlight('piPiStackingInteractions');">
                                            <check-mark :value="getInteractionVisibility('piPiStackingInteractions')">
                                                <div class="centerMenuItem" style="width:95px;">
                                                    π-π Stacking
                                                </div>
                                            </check-mark>
                                        </b-dropdown-item>
                                        <b-dropdown-item @click="updateHighlight('tStackingInteractions');">
                                            <check-mark :value="getInteractionVisibility('tStackingInteractions')">
                                                <div class="centerMenuItem" style="width:95px;">
                                                    T Shaped
                                                </div>
                                            </check-mark>
                                        </b-dropdown-item>
                                        <b-dropdown-item @click="updateHighlight('cationPiInteractions');">
                                            <check-mark :value="getInteractionVisibility('cationPiInteractions')">
                                                <div class="centerMenuItem" style="width:95px;">
                                                    Cation-π
                                                </div>
                                            </check-mark>
                                        </b-dropdown-item>
                                    </b-dropdown>
                                </b-col>
                                <b-col no-gutters>
                                    <b-button variant="primary" @click="clearInteraction();" block>Reset</b-button>
                                </b-col>
                            </b-row>
                            <b-row no-gutters>
                                <!-- 
                                DEPRECIATED, but leave commented out in case you
                                bring it back in the future.
                                <b-col no-gutters @click="updateHighlight();">
                                    <b-button @click="onChangeColor();" block>
                                        {{colorByInteractionBtnTxt}}
                                    </b-button>
                                </b-col>
                                -->
                                <!--
                                DEPRECIATED, but leave comented out in case you
                                bring it back in the future.
                                <b-col no-gutters>
                                    <b-button @click="onBondVisChange();" block v-html="bondVisBtnTxt">
                                    </b-button>
                                </b-col>
                                -->
                                <b-col no-gutters>
                                    <b-button @click="onSaveFiles();" block>
                                        Save
                                    </b-button>
                                </b-col>
                            </b-row>
                            
                            <b-table striped small :items="legendItems">
                                <template #cell(Representation)="data">
                                    <span v-html="data.value"></span>
                                </template>
                                <template #cell(Name)="data">
                                    <span v-html="data.value"></span>
                                </template>
                            </b-table>
                            <div class="learnMoreLink" style="margin-top: -12px;">
                                (<b-link href="#" @click="moreDetails">More details about interaction detection</b-link>)
                            </div>

                            <b-alert show style="margin-top:8px;" variant="warning" v-if="missingHydrogensWarning !== ''">
                                <span v-html="missingHydrogensWarning"></span>

                                <br /><br />

                                You may also get this warning if one or more of your files is
                                improperly formatted.
                            </b-alert>

                            <!--
                            DEPRECIATED IN FAVOR OF TABLE DECRIPTION, but leave this 
                            commented in case you want to bring it back.
                            <b-row v-if="this.$store.state.colorMessage !== ''" no-gutters>
                                <b-col no-gutters>
                                    <p style="text-align:center;">({{this.$store.state.colorMessage}})</p>
                                </b-col>
                            </b-row>
                            -->
                        </span>
                    </b-container>
                </sub-section>

                <span style="display:none;">{{validate(false)}}</span>  <!-- Hackish. Just to make reactive. -->
            </div>
        `,
        "props": {},
        "computed": computedFunctions,

        /**
         * Get the data associated with this component.
         * @returns any  The data.
         */
        "data"() {
            return {
                "showFileInputs": true,
                lastInteractionNameUsed: undefined,
                "forceLigandFileName": null,
                "nonProteinResidues": ""
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

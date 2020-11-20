// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2020 Jacob D. Durrant.


import * as Utils from "../../Utils";
import * as BINANAInterface from "../../BINANAInterface";

declare var Vue;
declare var BINANA;
declare var jQuery;

/** An object containing the vue-component computed functions. */
let computedFunctions = {
    /**
     * Whether to hide the vina docking-box parameters.
     * @returns boolean  True if they should be hidden, false otherwise.
     */
    // "hideDockingBoxParams"(): boolean {
    //     return this.$store.state.hideDockingBoxParams;
    // },

    /** Whether to show the keep-protein-only link. Has both a getter and a setter. */
    "showKeepProteinOnlyLink": {
        get(): number {
            return this.$store.state["showKeepProteinOnlyLink"];
        },

        set(val: number): void {
            this.$store.commit("setVar", {
                name: "showKeepProteinOnlyLink",
                val: val
            });
        }
    },

    /**
     * Gets text describing the current interaction coloring scheme.
     * @returns string  The text.
     */
    "colorByInteractionBtnTxt"(): string {
        if (this.$store.state["colorByInteraction"]) {
            return "Current Coloring Scheme: Interaction";
        } else {
            return "Current Coloring Scheme: Molecule";
        }
    }
}

/** An object containing the vue-component methods functions. */
let methodsFunctions = {
    /**
     * Runs when user indicates theye want to use example vina input files,
     * rather than provide their own.
     * @returns void
     */
    "useExampleVinaInputFiles"(): void {
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
            // this.$store.commit("setVar", {
            //     name: "crystalContents",
            //     val: this.$store.state["crystalContentsExample"]
            // });
            // this.$store.commit("setBinanaParam", {
            //     name: "center_x",
            //     val: 41.03
            // });
            // this.$store.commit("setBinanaParam", {
            //     name: "center_y",
            //     val: 18.98
            // });
            // this.$store.commit("setBinanaParam", {
            //     name: "center_z",
            //     val: 14.03
            // });
            // this.$store.commit("setBinanaParam", {
            //     name: "size_x",
            //     val: 20.00
            // });
            // this.$store.commit("setBinanaParam", {
            //     name: "size_y",
            //     val: 20.00
            // });
            // this.$store.commit("setBinanaParam", {
            //     name: "size_z",
            //     val: 20.00
            // });

            // Also update file names so example vina command line is valid.
            this.$store.commit("updateFileName", { type: "ligand", filename: "ligand_example.pdbqt" });
            this.$store.commit("updateFileName", { type: "receptor", filename: "receptor_example.pdbqt" });

            // These values should now validate.
            let validateVars = [
                "receptor", "ligand",
                // "center_x", "center_y", "center_z",
                // "size_x", "size_y", "size_z"
            ];
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
     * Highlights interactions in the 3Dmoljs viewer.
     * @param  {string} interactionName  The name of the interaction type to
     *                                   highlight.
     * @returns void
     */
    "highlight"(interactionName: string): void {
        if (interactionName === undefined) {
            interactionName = this.lastInteractionNameUsed;
        } else {
            this.lastInteractionNameUsed = interactionName;
        }

        if (interactionName !== undefined) {
            BINANAInterface.highlight(interactionName);
        }
    },

    /**
     * Clears the interactions currently displayed in the 3Dmoljs viewer.
     * @returns void
     */
    "clearInteraction"(): void {
        BINANAInterface.clearInteraction();
    },

    /**
     * Fires when the user indicates s/he would like to change the color
     * scheme.
     * @returns void
     */
    "onChangeColor"(): void {
        this.$store.commit("setVar", {
            name: "colorByInteraction",
            val: !this.$store.state["colorByInteraction"]
        });

        this["highlight"]();
    },

    /**
     * Runs when the user presses the submit button.
     * @returns void
     */
    // "onSubmitClick"(): void {
    //     if (this["validate"]() === true) {
    //         this.$store.commit("disableTabs", {
    //             "parametersTabDisabled": true,
    //             "existingVinaOutputTabDisabled": true,
    //             "runningTabDisabled": false,
    //         });

    //         jQuery("body").addClass("waiting");

    //         Vue.nextTick(() => {
    //             this.$store.commit("setVar", {
    //                 name: "tabIdx",
    //                 val: 2
    //             });

    //             Vue.nextTick(() => {
    //                 // setTimeout(() => {
    //                 //     this.afterWASM(this["testVinaOut"], this["testStdOut"]);
    //                 // }, 1000);

    //                 // Keep track of start time
    //                 this.$store.commit("setVar", {
    //                     name: "time",
    //                     val: new Date().getTime()
    //                 });

    //                 setTimeout(() => {
    //                     BINANA.start(
    //                         this.$store.state["binanaParams"],
    //                         this.$store.state["receptorContents"],
    //                         this.$store.state["ligandContents"],

    //                         // onDone
    //                         (outPdbqtFileTxt: string, stdOut: string, stdErr: string) => {
    //                             this.$store.commit("setVar", {
    //                                 name: "time",
    //                                 val: Math.round((new Date().getTime() - this.$store.state["time"]) / 100) / 10
    //                             });

    //                             this.afterWASM(outPdbqtFileTxt, stdOut, stdErr);
    //                         },

    //                         // onError
    //                         (errObj: any) => {
    //                             // Disable some tabs
    //                             this.$store.commit("disableTabs", {
    //                                 "parametersTabDisabled": true,
    //                                 "existingVinaOutputTabDisabled": true,
    //                                 "runningTabDisabled": true,
    //                                 "outputTabDisabled": true,
    //                                 "startOverTabDisabled": false
    //                             });

    //                             this.showWebinaError(errObj["message"]);
    //                         },
    //                         Utils.curPath() + "Webina/"
    //                     )
    //                 }, 15000);

    //             });
    //         });
    //     }
    // },

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
            name: "vinaParamsValidates",
            val: pass
        })

        return pass;
    },

    // /**
    //  * Runs after the Vina WASM file is complete.
    //  * @param  {string} outPdbqtFileTxt  The contents of the Vina output pdbqt file.
    //  * @param  {string} stdOut           The contents of the Vina standard output.
    //  * @param  {string} stdErr           The contents of the Vina standard error.
    //  * @returns void
    //  */
    // afterWASM(outPdbqtFileTxt: string, stdOut: string, stdErr: string): void {
    //     // Disable some tabs
    //     this.$store.commit("disableTabs", {
    //         "parametersTabDisabled": true,
    //         "existingVinaOutputTabDisabled": true,
    //         "runningTabDisabled": true,
    //         "outputTabDisabled": false,
    //         "startOverTabDisabled": false
    //     });

    //     // Switch to output tab.
    //     this.$store.commit("setVar", {
    //         name: "tabIdx",
    //         val: 3
    //     });

    //     this.$store.commit("setVar", {
    //         name: "stdOut",
    //         val: stdOut
    //     });
    //     this.$store.commit("setVar", {
    //         name: "outputContents",
    //         val: outPdbqtFileTxt
    //     });

    //     if (stdErr !== "") {
    //         this.showWebinaError(stdErr);
    //     }

    //     // Process the standard output (extract scores and rmsds) and
    //     // frames.
    //     this.$store.commit("outputToData");

    //     jQuery("body").removeClass("waiting");
    // },

    // /**
    //  * Shows a Webina error.
    //  * @param  {string} message  The error message.
    //  * @returns void
    //  */
    // showWebinaError(message: string): void {
    //     this.$store.commit("openModal", {
    //         title: "Webina Error!",
    //         body: "<p>Webina returned the following error: <code>" + message + "</code></p>"
    //     });
    // }
}

/**
 * The vue-component mounted function.
 * @returns void
 */
function mountedFunction(): void {
    this["webAssemblyAvaialble"] = Utils.webAssemblySupported();
}

/**
 * Setup the vina-params Vue commponent.
 * @returns void
 */
export function setup(): void {
    Vue.component('vina-params', {
        "template": `
            <div>
                <b-form v-if="webAssemblyAvaialble">
                    <!-- <b-card
                        class="mb-2 text-center"
                        style="margin-bottom:1.4rem !important;"
                    >
                        <b-card-text>
                            Use this tab to setup a analysis in your browser.
                            Specify the input files and BINANA parameters below.
                        </b-card-text>
                    </b-card> -->

                    <sub-section
                        v-if="$store.state.receptorContents === '' || $store.state.ligandContents === ''"
                    >
                        <!-- title="Advanced Parameters"> -->
                        <div role="tablist">
                            <b-card no-body class="mb-1">
                                <b-card-header header-tag="header" class="p-1" role="tab">
                                    <b-button block href="#" v-b-toggle.accordion-3 variant="default">Advanced Parameters</b-button>
                                </b-card-header>
                                <b-collapse id="accordion-3" role="tabpanel">
                                    <b-card-body>
                                        <!-- <b-card
                                            class="mb-2 text-center"
                                            style="margin-bottom:1.4rem !important;"
                                        >
                                            <b-card-text>
                                                Advanced parameters that are best left unmodified.
                                            </b-card-text>
                                        </b-card> -->

                                        <b-card class="mb-2 text-center" style="margin-bottom:1.4rem !important;">
                                            <b-card-text>Parameters used to identify close contacts.</b-card-text>

                                            <numeric-input
                                                label="Close Contacts Dist1 Cutoff"
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
                                            <b-card-text>Parameters used to identify hydrogen bonds.</b-card-text>

                                            <numeric-input
                                                label="Hydrogen Bond Dist Cutoff"
                                                id="hydrogen_bond_dist_cutoff"
                                                description="A hydrogen bond is identified if the hydrogen-bond
                                                donor comes within this number of angstroms of the hydrogen-bond
                                                acceptor." placeholder="$store.state.hydrogen_bond_dist_cutoff"
                                            ></numeric-input>
                                            <numeric-input
                                                label="Hydrogen Bond Angle Cutoff"
                                                id="hydrogen_bond_angle_cutoff"
                                                description="A hydrogen bond is identified if the angle formed
                                                between the donor, the hydrogen atom, and the acceptor is no
                                                greater than this number of degrees." placeholder="$store.state.hydrogen_bond_angle_cutoff"
                                            ></numeric-input>
                                        </b-card>


                                        <b-card class="mb-2 text-center" style="margin-bottom:1.4rem !important;">
                                            <b-card-text>
                                                <div style='text-align:left;'>
                                                    Parameters used to identify interactions between
                                                    atomatic rings. Once an aromatic ring is identified, a plane is
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
                                        </b-card>
                                    </b-card-body>
                                </b-collapse>
                            </b-card>
                        </div>
                    </sub-section>

                    <sub-section title="Input Files" v-if="showFileInputs">
                        <file-input
                            label="Receptor"
                            id="receptor"

                            description="Formats: PDB, SDF, XYZ, MOL2. Be sure to add polar hydrogen atoms if necessary."
                            accept=".pdb, .sdf, .xyz, .mol2"
                        >
                            <template v-slot:extraDescription>
                                <span v-else>
                                    <b>(Removed all non-protein atoms!)</b>
                                </span>
                            </template>
                        </file-input>

                        <file-input
                            label="Ligand"
                            id="ligand"
                            description="Formats: PDB, SDF, XYZ, MOL2. Be sure to add polar hydrogen atoms if necessary."
                            accept=".pdb, .sdf, .xyz, .mol2"
                        >
                        </file-input>

                        <form-button @click.native="useExampleVinaInputFiles" cls="float-right">Use Example Files</form-button>  <!-- variant="default" -->
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
                            v-if="$store.state.receptorContents != '' && $store.state.ligandContents != ''"
                        >
                            <b-row no-gutters>
                                <b-col no-gutters>
                                    <b-dropdown variant="primary" text="Common" block>
                                        <b-dropdown-item @click="highlight('hydrogenBonds');">Hydrogen Bonds</b-dropdown-item>
                                        <b-dropdown-item @click="highlight('hydrophobicContacts');">Hydrophobic</b-dropdown-item>
                                        <b-dropdown-item @click="highlight('saltBridges');">Salt Bridge</b-dropdown-item>
                                    </b-dropdown>
                                </b-col>
                                <b-col no-gutters>
                                    <b-dropdown variant="primary" text="Contacts" block>
                                        <b-dropdown-item @click="highlight('contactsWithin2.5A');">Closest</b-dropdown-item>
                                        <b-dropdown-item @click="highlight('contactsWithin4.0A');">Close</b-dropdown-item>
                                    </b-dropdown>
                                </b-col>
                                <b-col no-gutters>
                                    <b-dropdown variant="primary" text="Aromatic" block>
                                        <b-dropdown-item @click="highlight('piPiStackingInteractions');">π-π Stacking</b-dropdown-item>
                                        <b-dropdown-item @click="highlight('tStackingInteractions');">T Stacking</b-dropdown-item>
                                        <b-dropdown-item @click="highlight('cationPiInteractions');">Cation-π</b-dropdown-item>
                                    </b-dropdown>
                                </b-col>
                                <b-col no-gutters>
                                    <b-button variant="primary" @click="clearInteraction();" block>Clear</b-button>
                                </b-col>
                            </b-row>
                            <b-row no-gutters>
                                <b-col no-gutters @click="highlight();">
                                    <b-button @click="onChangeColor();" block>
                                        {{colorByInteractionBtnTxt}}
                                    </b-button>
                                </b-col>
                            </b-row>
                            <b-row v-if="this.$store.state.colorMessage !== ''" no-gutters>
                                <b-col no-gutters>
                                    <p style="text-align:center;">({{this.$store.state.colorMessage}})</p>
                                </b-col>
                            </b-row>
                        </b-container>
                    </sub-section>

                    <span style="display:none;">{{validate(false)}}</span>  <!-- Hackish. Just to make reactive. -->
                    <!-- <form-button @click.native="onSubmitClick" variant="primary" cls="float-right mb-4">Start BINANA</form-button> -->

                </b-form>
                <div v-else>
                    <p>Unfortunately, your browser does not support WebAssembly.
                    Please <a href='https://developer.mozilla.org/en-US/docs/WebAssembly#Browser_compatibility'
                    target='_blank'>switch to a browser that does</a> (e.g., Google Chrome).</p>

                    <p>Note that you can still use the "Existing Vina Output" option
                    (see menu on the left) even without WebAssembly.</p>
                </div>
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
                "webAssemblyAvaialble": true,
                lastInteractionNameUsed: undefined
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

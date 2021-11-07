// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2020 Jacob D. Durrant.


import * as NumericInput from "../UI/Forms/NumericInput";
import * as FileInput from "../UI/Forms/FileInput";
import * as BINANAParams from "../UI/Tabs/BINANAParams";
import * as StartOver from "../UI/Tabs/StartOver";
import * as FormGroup from "../UI/Forms/FormGroup";
import * as ThreeDMol from "../UI/ThreeDMol";
import * as OpenModal from "../UI/Modal/OpenModal";
import * as SubSection from "../UI/SubSection";
import * as FormButton from "../UI/Forms/FormButton";
import * as CheckMark from "../UI/CheckMark";

declare var Vue;
declare var Vuex;
declare var BootstrapVue;

/**
 * Load and setup all Vue components.
 * @returns void
 */
export function setup(): void {
    Vue.use(BootstrapVue)
    Vue.use(Vuex)

    CheckMark.setup();
    SubSection.setup();
    FormButton.setup();
    OpenModal.setup();
    FormGroup.setup();
    ThreeDMol.setup();
    NumericInput.setup();
    FileInput.setup();
    BINANAParams.setup();
    StartOver.setup();
}

import { addCSS } from '../../../Common/Utils';
/**
 * The vue-component mounted function.
 * @returns void
 */
 export function fileLoaderInputMountedFunction(): void {
    // Make default validation entry.
    // if (this.$store.state["validation"][this["id"]] === undefined) {
    //     this.$emit("onValidationChange", false);
    // }

    // Add some CSS
    addCSS(`.form-file-text { color: #878e95 }`);

    // If it's not required, automatically validate.
    // this.$refs["fileInput"].$el.querySelector(".form-file-text").color = "#878e95";

    // console.log(this.$refs["fileInput"]);
    // debugger
    // if (this["required"] === false) {
    //     // this.$emit("onValidationChange", true);

    //     debugger;

    //     jQuery("." + this["id"])
    //         .find("input")
    //         .removeClass("is-invalid");

    // } else {
    //     // this.$emit("onValidationChange", false);
    // }
}

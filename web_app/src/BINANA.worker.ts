import * as binana from "./binana/binana";

self.onmessage = function(e) {

    // import * as binana from './binana/binana.js';

    let pdbtxt = e.data[0];
    let ligtxt = e.data[1];
    let binanaParams = e.data[2];

    // Save to the fake file system
    binana["save_to_fake_fs"]("receptor.pdb", pdbtxt);
    binana["save_to_fake_fs"]("ligand.pdb", ligtxt);

    let params = ["-receptor", "receptor.pdb", "-ligand", "ligand.pdb"];

    const binanaParamNames = Object.keys(binanaParams);
    const binanaParamNamesLen = binanaParamNames.length;
    for (let i = 0; i < binanaParamNamesLen; i++) {
        const binanaParamName = binanaParamNames[i];
        const paramVal = binanaParams[binanaParamName];
        params.push("-" + binanaParamName);
        params.push(paramVal);
    }

    binana["run"](params);

    // Get the json output.
    let json = binana["load_from_fake_fs"]("./ligand_receptor_output.json");

    // @ts-ignore
    postMessage(json);
}

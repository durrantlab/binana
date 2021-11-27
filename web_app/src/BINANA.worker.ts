// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2021 Jacob D. Durrant.

import * as binana from "./binanajs/binana";

self.onmessage = function(e) {
    let pdbtxt = e.data[0];
    let ligtxt = e.data[1];
    let binanaParams = e.data[2];

    // Save to the fake file system

    binana["fs"]["save_file"]("receptor.pdb", pdbtxt);
    binana["fs"]["save_file"]("ligand.pdb", ligtxt);

    let params = [
        "-receptor", "receptor.pdb", "-ligand", "ligand.pdb",
        "-output_dir", "/vmd/"
        // "-output_json", "ligand_receptor_output.json"
    ];

    const binanaParamNames = Object.keys(binanaParams);
    const binanaParamNamesLen = binanaParamNames.length;
    for (let i = 0; i < binanaParamNamesLen; i++) {
        const binanaParamName = binanaParamNames[i];
        const paramVal = binanaParams[binanaParamName];
        params.push("-" + binanaParamName);
        params.push(paramVal);
    }

    binana["run"](params);

    // Get the output.
    let fakeFS = binana["fs"]["shim"]["fake_fs"];
    let newFS = {};
    for (let flnm of Object.keys(fakeFS)) {
        // if (["/vmd/output.json", "/vmd/log.txt"].indexOf(flnm) !== -1) {
        if (flnm.startsWith("/vmd/")) {
            let content = fakeFS[flnm];
            flnm = flnm.slice(5);
            newFS[flnm] = content;
        }
    }

    // @ts-ignore
    postMessage(newFS);
}

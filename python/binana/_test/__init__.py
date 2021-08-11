# This file is part of BINANA, released under the Apache 2.0 License. See
# LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
# details. Copyright 2020 Jacob D. Durrant.

# Not putting shim here because should only be run from commandline/python (not
# javascript).

import os
from binana import _start
import binana
import glob
import re


def _remove_lines_with_pass(txt):
    for val in [
        "ligand",
        "output_dir",
        "output_file",
        "output_json",
        "receptor",
        "test",
    ]:
        txt = re.sub(r"^REMARK +?" + val + r".+?\n", "", txt, flags=re.M | re.S)
        txt = re.sub(r"^ +?" + val + r".+?\n", "", txt, flags=re.M | re.S)
    return txt


def _run_test(cmd_params):
    cur_dir = os.path.dirname(__file__) + os.sep
    lig = cur_dir + "input" + os.sep + "ligand.pdbqt"
    rec = cur_dir + "input" + os.sep + "receptor.pdbqt"

    out_dir = cur_dir + "output" + os.sep
    out_expected_dir = cur_dir + "expected_output" + os.sep

    if not os.path.exists(out_dir):
        os.mkdir(out_dir)

    # Modify the parameters in preparation or the test.
    cmd_params.params["receptor"] = rec
    cmd_params.params["ligand"] = lig
    cmd_params.params["test"] = False
    cmd_params.params["output_dir"] = out_dir

    args = []
    for arg in cmd_params.params:
        if arg == "test":
            continue
        args.append("-" + arg)
        args.append(cmd_params.params[arg])

    binana.run(args)

    for out_file in glob.glob(out_dir + "*"):
        expect_file = out_expected_dir + os.path.basename(out_file)

        out_txt = open(out_file).read()
        expect_txt = open(expect_file).read()

        out_txt = _remove_lines_with_pass(out_txt)
        expect_txt = _remove_lines_with_pass(expect_txt)

        if out_txt == expect_txt:
            print("PASS: " + os.path.basename(out_file))
        else:
            print("FAIL: " + os.path.basename(out_file))
            print("    Contents different:")
            print("        " + out_file)
            print("        " + expect_file)

    # Delete output files (clean up)
    for ext in [".pdb", "state.vmd", "output.json", "log.txt"]:
        for fl in glob.glob(out_dir + "*" + ext):
            os.unlink(fl)

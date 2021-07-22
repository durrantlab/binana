# Make file to save all output.

import binana

# __pragma__ ('skip')
# Python
import os
import textwrap
import sys
from math import fabs

# __pragma__ ('noskip')

"""?
# Transcrypt
os = binana.os
textwrap = binana.shim
sys = binana.sys
from binana.shim import fabs
?"""


def write_all_output(
    parameters,
    ligand,
    receptor,
    closest,
    close,
    hydrogen_bonds,
    hydrophobics,
    pi_pi,
    salt_bridges,
    ligand_atom_types,
    electrostatic_energies,
    flexibility,
    pi_cat,
):
    # if an output directory is specified, and it doesn't exist, create it
    if parameters.params["output_dir"] != "" and not os.path.exists(
        parameters.params["output_dir"]
    ):
        os.mkdir(parameters.params["output_dir"])

    # call json_file
    # have it return the dictionary and dump to a json file
    json_output = binana.output.json_out.json_file(
        closest["labels"],
        close["labels"],
        hydrogen_bonds["labels"],
        hydrophobics["labels"],
        pi_pi["labels"]["pi_stacking"],
        pi_pi["labels"]["T_stacking"],
        pi_cat["labels"],
        salt_bridges["labels"],
        ligand.filename,
        receptor.filename,
    )

    print("json output:")
    print(json_output)

    output = binana.output.log.make_log(
        parameters,
        ligand,
        ligand_atom_types["counts"],
        closest["counts"],
        closest["labels"],
        close["counts"],
        close["labels"],
        electrostatic_energies["counts"],
        flexibility["counts"],
        hydrogen_bonds["counts"],
        hydrogen_bonds["labels"],
        hydrophobics["counts"],
        hydrophobics["labels"],
        pi_pi["counts"],
        pi_pi["labels"]["pi_stacking"],
        pi_pi["labels"]["T_stacking"],
        pi_cat["labels"],
        salt_bridges["counts"],
        salt_bridges["labels"],
    )

    closest["mol"].set_resname("CCN")
    close["mol"].set_resname("CON")
    flexibility["mols"]["alpha_helix"].set_resname("ALP")
    flexibility["mols"]["beta_sheet"].set_resname("BET")
    flexibility["mols"]["other_2nd_structure"].set_resname("OTH")
    flexibility["mols"]["back_bone"].set_resname("BAC")
    flexibility["mols"]["side_chain"].set_resname("SID")
    hydrophobics["mol"].set_resname("HYD")
    hydrogen_bonds["mol"].set_resname("HBN")
    pi_pi["mols"]["pi_stacking"].set_resname("PIS")
    pi_pi["mols"]["T_stacking"].set_resname("PIT")
    pi_cat["mol"].set_resname("PIC")
    salt_bridges["mol"].set_resname("SAL")
    ligand.set_resname("LIG")

    if parameters.params["output_dir"] != "":
        binana.output.dir.pdbs.output_dir_pdbs(
            closest["mol"],
            parameters,
            close["mol"],
            flexibility["mols"]["alpha_helix"],
            flexibility["mols"]["beta_sheet"],
            flexibility["mols"]["other_2nd_structure"],
            flexibility["mols"]["back_bone"],
            flexibility["mols"]["side_chain"],
            hydrophobics["mol"],
            hydrogen_bonds["mol"],
            pi_pi["mols"]["pi_stacking"],
            pi_pi["mols"]["T_stacking"],
            pi_cat["mol"],
            salt_bridges["mol"],
            ligand,
            receptor,
        )
        binana.output.dir.vmd_state.vmd_state_file(parameters)

    if parameters.params["output_file"] != "":
        binana.output.single_file.make_single_file(
            parameters,
            receptor,
            ligand,
            closest["mol"],
            close["mol"],
            flexibility["mols"]["alpha_helix"],
            flexibility["mols"]["beta_sheet"],
            flexibility["mols"]["other_2nd_structure"],
            flexibility["mols"]["back_bone"],
            flexibility["mols"]["side_chain"],
            hydrophobics["mol"],
            hydrogen_bonds["mol"],
            pi_pi["mols"]["pi_stacking"],
            pi_pi["mols"]["T_stacking"],
            pi_cat["mol"],
            salt_bridges["mol"],
            output,
        )
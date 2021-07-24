from binana.output._directory import pdbs
from binana.output._directory import vmd_state
import binana

# __pragma__ ('skip')
# Python
import os
# __pragma__ ('noskip')

"""?
# Transcrypt
os = binana.os
?"""

def make_directory_output(
    parameters,
    closest,
    close,
    flexibility,
    hydrophobics,
    hydrogen_bonds,
    pi_pi,
    pi_cat,
    salt_bridges,
    ligand,
    receptor,
):

    # if an output directory is specified, and it doesn't exist, create it
    if not os.path.exists(parameters.params["output_dir"]):
        os.mkdir(parameters.params["output_dir"])

    # Save pdb files to the directory
    binana.output._directory.pdbs.output_dir_pdbs(
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

    # Save vmd state file to directory
    binana.output._directory.vmd_state.vmd_state_file(parameters)

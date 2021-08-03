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
    active_site_flexibility,
    hydrophobics,
    hydrogen_bonds,
    pi_pi,
    cat_pi,
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
        active_site_flexibility["mols"]["alpha_helix"],
        active_site_flexibility["mols"]["beta_sheet"],
        active_site_flexibility["mols"]["other_2nd_structure"],
        active_site_flexibility["mols"]["back_bone"],
        active_site_flexibility["mols"]["side_chain"],
        hydrophobics["mol"],
        hydrogen_bonds["mol"],
        pi_pi["mols"]["pi_stacking"],
        pi_pi["mols"]["T_stacking"],
        cat_pi["mol"],
        salt_bridges["mol"],
        ligand,
        receptor,
    )

    # Save vmd state file to directory
    binana.output._directory.vmd_state.vmd_state_file(parameters)

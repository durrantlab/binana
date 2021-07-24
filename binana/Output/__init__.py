"""A few functions to output BINANA analysis."""

from binana.output import _directory
from binana.output import dictionary
from binana.output import log
from binana.output import single_pdb_file
import binana

# __pragma__ ('skip')
# Python, just alias open
_openFile = open
import json
# __pragma__ ('noskip')

"""?
# Transcrypt
import binana._utils.shim as json
from binana._utils.shim import OpenFile
_openFile = OpenFile
?"""

def write(
    parameters,
    ligand,
    receptor,
    closest,
    close,
    hydrophobics,
    hydrogen_bonds,
    salt_bridges,
    pi_pi,
    pi_cat,
    electrostatic_energies,
    flexibility,
    ligand_atom_types,
):
    """The main function for writing BINANA output to the disk (or the 
    in-memory "fake" file system if using the JavaScript library). Output
    depends on the values in the ``parameters`` object (see
    :py:func:`~binana.run`).
    
    To write output files to a directory (and to create the VMD state file and
    supporting files required for VMD visualization)::

        -output_dir ./output_for_vmd/

    To write to a single PDB file::

        -output_file test.pdb
    
    To save data to a JSON file::
        
        -output_json test.json

    Args:
        parameters (binana._cli_params.get_params.CommandLineParameters): An
            object containing the user-specified parameters. See
            :py:func:`~binana.run`.
        ligand (binana._structure.mol.Mol): The ligand object.
        receptor (binana._structure.mol.Mol): The receptor object.
        closest (dict): A dictionary containing information about the closest
            protein/ligand interactions.
        close (dict): A dictionary containing information about the close
            protein/ligand interactions.
        hydrophobics (dict): A dictionary containing information about the
            hydrophobic protein/ligand interactions.
        hydrogen_bonds (dict): A dictionary containing information about the
            hydrogen bonds between the protein and ligand.
        salt_bridges (dict): A dictionary containing information about the
            salt-bridges protein/ligand interactions.
        pi_pi (dict): A dictionary containing information about the pi-pi
            (stacking and T-shaped) protein/ligand interactions.
        pi_cat (dict): A dictionary containing information about the pi-cation
            protein/ligand interactions.
        electrostatic_energies (dict): A dictionary containing information
            about the electrostatic energies between protein and ligand atoms.
        flexibility (dict): A dictionary containing information about the
            flexibility of ligand-adjacent protein atoms.
        ligand_atom_types (dict): A dictionary containing information about
            the ligand atom types.
    """

    # call json_file have it return the dictionary and dump to a json file.
    # You'll use this regardless of directory or single file output.

    json_output = binana.output.dictionary.collect(
        ligand.filename,
        receptor.filename,
        closest["labels"],
        close["labels"],
        hydrophobics["labels"],
        hydrogen_bonds["labels"],
        salt_bridges["labels"],
        pi_pi["labels"],
        pi_cat["labels"],
    )

    # Get the log text. You'll also use this regardless of single file or
    # directory output.
    log_output = binana.output.log.collect(
        parameters,
        ligand,
        closest,
        close,
        hydrophobics,
        hydrogen_bonds,
        salt_bridges,
        pi_pi,
        pi_cat,
        electrostatic_energies,
        flexibility,
        ligand_atom_types,
        json_output,
    )

    # Set the resname on the various molecules to be able to distinguish between
    # them easily.
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

    if parameters.params["output_file"] != "":
        binana.output.single_pdb_file.write(
            parameters,
            ligand,
            receptor,
            closest,
            close,
            hydrophobics,
            hydrogen_bonds,
            salt_bridges,
            pi_pi,
            pi_cat,
            flexibility,
            log_output,
        )

    if parameters.params["output_json"] != "":
        f = _openFile(parameters.params["output_json"], "w")
        f.write(json.dumps(json_output, indent=2))
        f.close()

    if parameters.params["output_dir"] != "":
        _directory.make_directory_output(
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
        )

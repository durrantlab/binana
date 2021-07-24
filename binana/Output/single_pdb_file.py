# __pragma__ ('skip')
# Python
import textwrap
# __pragma__ ('noskip')

"""?
# Transcrypt
import binana
import binana._utils
textwrap = binana._utils.shim
?"""

# __pragma__ ('skip')
# Python, just alias open
_openFile = open
# __pragma__ ('noskip')

"""?
# Transcrypt
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
    flexibility,
    log_output="",
    as_str=False
):
    """Writes a single PDB file containing the ligand, receptor, and atoms that
    participate in various iteractions (with distinct resnames).

    Args:
        parameters (binana._cli_params.get_params.CommandLineParameters): An
            object containing the user-specified parameters. See 
            :py:func:`~binana.run`.
        ligand (binana._structure.mol.Mol): The ligand object. Used for
            counting the number of rotatable bonds (if PDBQT formatted).
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
        flexibility (dict): A dictionary containing information about the
            flexibility of ligand-adjacent protein atoms.
        log_output (str, optional): The log text, returned from
            :py:func:`~binana.output.log.collect`. Defaults to ``""``.
        as_str (bool, optional): Whether to save the file to the disk (or fake
            disk in case of JavaScript), or to return the contents as a string.
            Defaults to False.

    Returns:
        str: The contents of the PDB file if ``as_str`` is ``True``. Otherwise,
        ``""``.
    """

    # so it's writing to a single file.

    # first, make an explaination.

    explain = (
        'The residue named "CCN" illustrates close contacts where the protein and ligand atoms come within '
        + str(parameters.params["close_contacts_dist1_cutoff"])
        + ' of each other. "CON" illustrates close contacts where the protein and ligand atoms come within '
        + str(parameters.params["close_contacts_dist2_cutoff"])
        + ' of each other. "ALP", "BET", and "OTH" illustrates receptor contacts whose respective protein residues have the alpha-helix, beta-sheet, or "other" secondary structure. "BAC" and "SID" illustrate receptor contacts that are part of the protein backbone and sidechain, respectively. "HYD" illustrates hydrophobic contacts between the protein and ligand. "HBN" illustrates hydrogen bonds. "SAL" illustrates salt bridges. "PIS" illustrates pi-pi stacking interactions, "PIT" illustrates T-stacking interactions, and "PIC" illustrates cation-pi interactions. Protein residue names are unchanged, but the ligand residue is now named "LIG".'
    )

    log_output = log_output + "REMARK\n"

    lines = textwrap.wrap(explain, 71)
    for line in lines:
        log_output = log_output + "REMARK " + line + "\n"

    log_output = log_output + "REMARK\n"

    log_output = (
        log_output
        + receptor.save_pdb_string()
        + "TER\n"
        + ligand.save_pdb_string()
        + "TER\n"
        + closest["mol"].save_pdb_string()
        + "TER\n"
    )
    log_output = (
        log_output
        + close["mol"].save_pdb_string()
        + "TER\n"
        + flexibility["mols"]["alpha_helix"].save_pdb_string()
        + "TER\n"
        + flexibility["mols"]["beta_sheet"].save_pdb_string()
        + "TER\n"
    )
    log_output = (
        log_output
        + flexibility["mols"]["other_2nd_structure"].save_pdb_string()
        + "TER\n"
        + flexibility["mols"]["back_bone"].save_pdb_string()
        + "TER\n"
        + flexibility["mols"]["side_chain"].save_pdb_string()
        + "TER\n"
    )
    log_output = (
        log_output
        + hydrophobics["mol"].save_pdb_string()
        + "TER\n"
        + hydrogen_bonds["mol"].save_pdb_string()
        + "TER\n"
        + pi_pi["mols"]["pi_stacking"].save_pdb_string()
        + "TER\n"
        + pi_pi["mols"]["T_stacking"].save_pdb_string()
        + "TER\n"
    )
    log_output = (
        log_output
        + pi_cat["mol"].save_pdb_string()
        + "TER\n"
        + salt_bridges["mol"].save_pdb_string()
        + "TER\n"
    )

    if as_str:
        return log_output

    f = _openFile(parameters.params["output_file"], "w")
    f.write(log_output)
    f.close()
    
    return ""

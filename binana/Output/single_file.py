# __pragma__ ('skip')
# Python
import textwrap
# __pragma__ ('noskip')

"""?
# Transcrypt
import binana
textwrap = binana.shim
?"""

# __pragma__ ('skip')
# Python, just alias open
openFile = open
# __pragma__ ('noskip')

"""?
# Transcrypt
openFile = binana.shim.OpenFile
?"""

def make_single_file(
    parameters,
    receptor,
    ligand,
    pdb_closest_contacts,
    pdb_close_contacts,
    pdb_contacts_alpha_helix,
    pdb_contacts_beta_sheet,
    pdb_contacts_other_2nd_structure,
    pdb_back_bone,
    pdb_side_chain,
    pdb_hydrophobic,
    pdb_hbonds,
    pdb_pistack,
    pdb_pi_T,
    pdb_pi_cat,
    pdb_salt_bridges,
    output,
):
    # so it's writing to a single file.

    # first, make an explaination.

    explain = (
        'The residue named "CCN" illustrates close contacts where the protein and ligand atoms come within '
        + str(parameters.params["close_contacts_dist1_cutoff"])
        + ' of each other. "CON" illustrates close contacts where the protein and ligand atoms come within '
        + str(parameters.params["close_contacts_dist2_cutoff"])
        + ' of each other. "ALP", "BET", and "OTH" illustrates receptor contacts whose respective protein residues have the alpha-helix, beta-sheet, or "other" secondary structure. "BAC" and "SID" illustrate receptor contacts that are part of the protein backbone and sidechain, respectively. "HYD" illustrates hydrophobic contacts between the protein and ligand. "HBN" illustrates hydrogen bonds. "SAL" illustrates salt bridges. "PIS" illustrates pi-pi stacking interactions, "PIT" illustrates T-stacking interactions, and "PIC" illustrates cation-pi interactions. Protein residue names are unchanged, but the ligand residue is now named "LIG".'
    )

    output = output + "REMARK\n"

    lines = textwrap.wrap(explain, 71)
    for line in lines:
        output = output + "REMARK " + line + "\n"

    output = output + "REMARK\n"

    output = (
        output
        + receptor.save_pdb_string()
        + "TER\n"
        + ligand.save_pdb_string()
        + "TER\n"
        + pdb_closest_contacts.save_pdb_string()
        + "TER\n"
    )
    output = (
        output
        + pdb_close_contacts.save_pdb_string()
        + "TER\n"
        + pdb_contacts_alpha_helix.save_pdb_string()
        + "TER\n"
        + pdb_contacts_beta_sheet.save_pdb_string()
        + "TER\n"
    )
    output = (
        output
        + pdb_contacts_other_2nd_structure.save_pdb_string()
        + "TER\n"
        + pdb_back_bone.save_pdb_string()
        + "TER\n"
        + pdb_side_chain.save_pdb_string()
        + "TER\n"
    )
    output = (
        output
        + pdb_hydrophobic.save_pdb_string()
        + "TER\n"
        + pdb_hbonds.save_pdb_string()
        + "TER\n"
        + pdb_pistack.save_pdb_string()
        + "TER\n"
        + pdb_pi_T.save_pdb_string()
        + "TER\n"
    )
    output = (
        output
        + pdb_pi_cat.save_pdb_string()
        + "TER\n"
        + pdb_salt_bridges.save_pdb_string()
        + "TER\n"
    )
    """# call json_file
    # have it return the dictionary and dump to a json file
    json_output = self.json_file(closest_contacts_labels, close_contacts_labels, hbonds_labels, hydrophobic_labels, pi_stacking_labels, T_stacking_labels, pi_cat_labels, salt_bridge_labels)
    print(json_output)"""

    f = openFile(parameters.params["output_file"], "w")
    f.write(output)
    f.close()

from binana.cli_params.defaults import ACTIVE_SITE_FLEXIBILITY_DIST_CUTOFF
import binana
from binana.load import get_ligand_receptor_dists
from binana.utils import hashtable_entry_add_one, list_alphebetize_and_combine


def calculate_flexibility(ligand, receptor, cutoff=ACTIVE_SITE_FLEXIBILITY_DIST_CUTOFF):
    active_site_flexibility = {}
    pdb_contacts_alpha_helix = binana.Mol()
    pdb_contacts_beta_sheet = binana.Mol()
    pdb_contacts_other_2nd_structure = binana.Mol()
    pdb_back_bone = binana.Mol()
    pdb_side_chain = binana.Mol()

    # close_contacts_labels = []

    # Calculate the distances.
    ligand_receptor_dists = get_ligand_receptor_dists(ligand, receptor)

    # Now get statistics to judge active-site flexibility
    for ligand_atom, receptor_atom, dist in ligand_receptor_dists:
        if dist < cutoff:
            # first can be sidechain or backbone, second back be alpha,
            # beta, or other, so six catagories
            flexibility_key = (
                receptor_atom.side_chain_or_backbone()
                + "_"
                + receptor_atom.structure
            )
            if receptor_atom.structure == "ALPHA":
                pdb_contacts_alpha_helix.add_new_atom(receptor_atom.copy_of())
            elif receptor_atom.structure == "BETA":
                pdb_contacts_beta_sheet.add_new_atom(receptor_atom.copy_of())
            elif receptor_atom.structure == "OTHER":
                pdb_contacts_other_2nd_structure.add_new_atom(
                    receptor_atom.copy_of()
                )

            if receptor_atom.side_chain_or_backbone() == "BACKBONE":
                pdb_back_bone.add_new_atom(receptor_atom.copy_of())
            elif receptor_atom.side_chain_or_backbone() == "SIDECHAIN":
                pdb_side_chain.add_new_atom(receptor_atom.copy_of())

            hashtable_entry_add_one(active_site_flexibility, flexibility_key)


    return {
        "counts": active_site_flexibility,
        "mols": {
            "alpha_helix": pdb_contacts_alpha_helix,
            "beta_sheet": pdb_contacts_beta_sheet,
            "other_2nd_structure": pdb_contacts_other_2nd_structure,
            "back_bone": pdb_back_bone,
            "side_chain": pdb_side_chain,
        },
        # "labels": close_contacts_labels,
    }

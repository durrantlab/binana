from binana.cli_params.defaults import ELECTROSTATIC_DIST_CUTOFF
import binana
from binana.load import get_ligand_receptor_dists
from binana.utils import hashtable_entry_add_one, list_alphebetize_and_combine


def calculate_electrostatic_energies(ligand, receptor, cutoff=ELECTROSTATIC_DIST_CUTOFF):
    ligand_receptor_atom_type_pairs_electrostatic = {}
    # pdb_close_contacts = binana.Mol()
    # close_contacts_labels = []

    # Calculate the distances.
    ligand_receptor_dists = get_ligand_receptor_dists(ligand, receptor)

    # calculate electrostatic energies for all less than 4 A
    for ligand_atom, receptor_atom, dist in ligand_receptor_dists:
        if dist < cutoff:
            # calculate electrostatic energies for all less than 4 A
            ligand_charge = ligand_atom.charge
            receptor_charge = receptor_atom.charge
            # to convert into J/mol # might be nice to double check this
            coulomb_energy = (
                ligand_charge * receptor_charge / dist
            ) * 138.94238460104697e4
            list_ligand_atom = [ligand_atom.atom_type, receptor_atom.atom_type]
            hashtable_entry_add_one(
                ligand_receptor_atom_type_pairs_electrostatic,
                list_alphebetize_and_combine(list_ligand_atom),
                coulomb_energy,
            )

    return {
        "counts": ligand_receptor_atom_type_pairs_electrostatic,
        # "mol": pdb_close_contacts,
        # "labels": close_contacts_labels,
    }

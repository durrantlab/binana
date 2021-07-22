from binana.cli_params.defaults import SALT_BRIDGE_DIST_CUTOFF
import binana
from binana.load import get_ligand_receptor_dists
from binana.utils import hashtable_entry_add_one, list_alphebetize_and_combine


def calculate_salt_bridges(ligand, receptor, cutoff=SALT_BRIDGE_DIST_CUTOFF):
    salt_bridges = {}
    pdb_salt_bridges = binana.Mol()
    salt_bridge_labels = []

    for receptor_charge in receptor.charges:
        for ligand_charge in ligand.charges:
            if ligand_charge.positive != receptor_charge.positive and (
                ligand_charge.coordinates.dist_to(receptor_charge.coordinates) < cutoff
            ):
                # so they have oppositve charges 4 is good cutoff for salt
                # bridges according to "Close-Range Electrostatic Interactions
                # in Proteins", but looking at complexes, I decided to go with
                # 5.5 A
                structure = receptor.all_atoms[receptor_charge.indices[0]].structure
                if structure == "":
                    # since it could be interacting with a cofactor or something
                    structure = "OTHER"

                key = "SALT-BRIDGE_" + structure

                for index in receptor_charge.indices:
                    pdb_salt_bridges.add_new_atom(receptor.all_atoms[index].copy_of())
                for index in ligand_charge.indices:
                    pdb_salt_bridges.add_new_atom(ligand.all_atoms[index].copy_of())

                hashtable_entry_add_one(salt_bridges, key)

                salt_bridge_labels.append(
                    (
                        "["
                        + " / ".join(
                            [
                                ligand.all_atoms[index].string_id()
                                for index in ligand_charge.indices
                            ]
                        )
                        + "]",
                        "["
                        + " / ".join(
                            [
                                receptor.all_atoms[index].string_id()
                                for index in receptor_charge.indices
                            ]
                        )
                        + "]",
                    )
                )

    return {
        "counts": salt_bridges,
        "mol": pdb_salt_bridges,
        "labels": salt_bridge_labels,
    }

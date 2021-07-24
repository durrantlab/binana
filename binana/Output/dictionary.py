import re

# __pragma__ ('skip')
# Python
import json
from os import sep
from os.path import basename, dirname

# __pragma__ ('noskip')

"""?
# Transcrypt
import binana
import binana._utils.shim as json
from binana._utils.shim import sep
from binana._utils.shim import basename
from binana._utils.shim import dirname
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


def _atom_details_to_dict(details):
    return {
        "chain": details[0].strip(),
        "resID": int(details[2]),
        "resName": details[1],
        "atomName": details[3],
        "atomIndex": int(details[4]),
    }


# takes care of pairwise interactions
# interaction_name: string
# interaction_labels: list containind raw data to be parsed into the dictionary
# returns list
def _get_close_atom_list(interaction_labels):
    # set counter for interaction
    i = 0
    interaction_list = []

    for atom_pairs in interaction_labels:
        # add new dictionary to interaction list
        # json_output[interaction_name].append({})
        interaction_list.append({})
        # parse atom_pairs
        ligand_atom_details = re.split(r"[():]", atom_pairs[0])
        receptor_atom_details = re.split(r"[():]", atom_pairs[1])
        # remove whitespace
        for detail in ligand_atom_details:
            if detail == "":
                ligand_atom_details.remove(detail)
        for detail in receptor_atom_details:
            if detail == "":
                receptor_atom_details.remove(detail)

        # add each detail to the appropriate key in ligand_atoms and receptor_atoms
        # json_output[interaction_name][i] = {

        interaction_list[i] = {
            "ligandAtoms": [_atom_details_to_dict(ligand_atom_details)],
            "receptorAtoms": [_atom_details_to_dict(receptor_atom_details)],
        }
        # increment counter
        i += 1
    return interaction_list


def _collect_hydrogen_bonds(hydrogen_bonds, json_output):
    # reset counter for interaction
    i = 0
    # hydrogen bonds
    for atom_pairs in hydrogen_bonds:
        # add new dictionary to hydrogen_bonds list
        json_output["hydrogenBonds"].append({})
        # parse atom_trios
        ligand_and_receptor = [
            re.split(r"[():]", atom_pairs[0]),  # Ligand
            re.split(r"[():]", atom_pairs[1]),  # hydrogen (Ligand or receptor)
            re.split(r"[():]", atom_pairs[2]),  # receptor
        ]

        # put atoms in appropriate group
        ligand_atom_details = [ligand_and_receptor[0]]
        receptor_atom_details = [ligand_and_receptor[2]]
        if atom_pairs[3] == "RECEPTOR":
            receptor_atom_details.append(ligand_and_receptor[1])
        else:
            ligand_atom_details.append(ligand_and_receptor[1])

        # for atom in ligand_and_receptor:
        #     if len(atom[0]) > 1: # ligand ("ATP")
        #         ligand_atom_details.append(atom)
        #     else: # receptor ("A")
        #         receptor_atom_details.append(atom)

        # remove whitespace
        for atom in ligand_atom_details:
            for detail in atom:
                if detail == "":
                    atom.remove(detail)
        for atom in receptor_atom_details:
            for detail in atom:
                if detail == "":
                    atom.remove(detail)
        # add each detail to the appropriate key in ligand_atoms and receptor_atoms
        # add "ligandAtoms" and "receptorAtoms" keys to dictionary
        json_output["hydrogenBonds"][i] = {"ligandAtoms": [], "receptorAtoms": []}
        for detail in ligand_atom_details:
            json_output["hydrogenBonds"][i]["ligandAtoms"].append(
                _atom_details_to_dict(detail)
            )
        for detail in receptor_atom_details:
            json_output["hydrogenBonds"][i]["receptorAtoms"].append(
                _atom_details_to_dict(detail)
            )
        # increment counter
        i += 1


def _collect_pi_pi(pi_stacking_interactions, json_output):
    # reset counter for interaction
    i = 0
    # pi-pi stacking interactions
    for atom_pair in pi_stacking_interactions:
        # add new dictionary to pi_stacking list
        json_output["piPiStackingInteractions"].append({})
        # parse atom_pairs into individual atoms
        individual_ligand_atoms = atom_pair[0].split("/")
        individual_receptor_atoms = atom_pair[1].split("/")
        # parse individual atoms into details
        individual_ligand_atoms_details = []
        for atom in individual_ligand_atoms:
            if atom != "":
                individual_ligand_atoms_details.append(re.split(r"[\[\]():]", atom))
        individual_receptor_atoms_details = []
        for atom in individual_receptor_atoms:
            if atom != "":
                individual_receptor_atoms_details.append(re.split(r"[\[\]():]", atom))
        # remove whitespace
        for detail_list in individual_ligand_atoms_details:
            for detail in detail_list:
                if detail == "":
                    detail_list.remove(detail)
        for detail_list in individual_receptor_atoms_details:
            for detail in detail_list:
                if detail == "":
                    detail_list.remove(detail)
        # add each detail to the appropriate key in ligand_atoms and receptor_atoms
        # add "ligandAtoms" and "receptorAtoms" keys to dictionary
        json_output["piPiStackingInteractions"][i] = {
            "ligandAtoms": [],
            "receptorAtoms": [],
        }
        for detail in individual_ligand_atoms_details:
            json_output["piPiStackingInteractions"][i]["ligandAtoms"].append(
                _atom_details_to_dict(detail)
            )
        for detail in individual_receptor_atoms_details:
            json_output["piPiStackingInteractions"][i]["receptorAtoms"].append(
                _atom_details_to_dict(detail)
            )
        # increment counter
        i += 1


def _collect_t_stacking(t_stacking_interactions, json_output):
    # reset counter for interaction
    i = 0
    # t stacking interactions
    for atom_pair in t_stacking_interactions:
        # add new dictionary to t_stacking list
        json_output["tStackingInteractions"].append({})
        # parse atom_pairs into individual atoms
        individual_ligand_atoms = atom_pair[0].split("/")
        individual_receptor_atoms = atom_pair[1].split("/")
        # parse individual atoms into details
        individual_ligand_atoms_details = []
        for atom in individual_ligand_atoms:
            if atom != "":
                individual_ligand_atoms_details.append(re.split(r"[\[\]():]", atom))
        individual_receptor_atoms_details = []
        for atom in individual_receptor_atoms:
            if atom != "":
                individual_receptor_atoms_details.append(re.split(r"[\[\]():]", atom))
        # remove whitespace
        for detail_list in individual_ligand_atoms_details:
            for detail in detail_list:
                if detail == "":
                    detail_list.remove(detail)
        for detail_list in individual_receptor_atoms_details:
            for detail in detail_list:
                if detail == "":
                    detail_list.remove(detail)
        # add each detail to the appropriate key in ligand_atoms and receptor_atoms
        # add "ligandAtoms" and "receptorAtoms" keys to dictionary
        json_output["tStackingInteractions"][i] = {
            "ligandAtoms": [],
            "receptorAtoms": [],
        }
        for detail in individual_ligand_atoms_details:
            json_output["tStackingInteractions"][i]["ligandAtoms"].append(
                _atom_details_to_dict(detail)
            )
        for detail in individual_receptor_atoms_details:
            json_output["tStackingInteractions"][i]["receptorAtoms"].append(
                _atom_details_to_dict(detail)
            )
        # increment counter
        i += 1


def _collect_cat_pi(cat_pi_interactions, json_output):
    # reset counter for interaction
    i = 0
    # cat-pi stacking interactions
    for atom_pair in cat_pi_interactions:
        # add new dictionary to cation-pi_stacking list
        json_output["cationPiInteractions"].append({})
        # parse atom_pairs into individual atoms
        individual_ligand_atoms = atom_pair[0].split("/")
        individual_receptor_atoms = atom_pair[1].split("/")
        # parse individual atoms into details
        individual_ligand_atoms_details = []
        for atom in individual_ligand_atoms:
            if atom != "":
                individual_ligand_atoms_details.append(re.split(r"[\[\]():]", atom))
        individual_receptor_atoms_details = []
        for atom in individual_receptor_atoms:
            if atom != "":
                individual_receptor_atoms_details.append(re.split(r"[\[\]():]", atom))
        # remove whitespace
        for detail_list in individual_ligand_atoms_details:
            for detail in detail_list:
                if detail == "":
                    detail_list.remove(detail)
        for detail_list in individual_receptor_atoms_details:
            for detail in detail_list:
                if detail == "":
                    detail_list.remove(detail)
        # add each detail to the appropriate key in ligand_atoms and receptor_atoms
        # add "ligandAtoms" and "receptorAtoms" keys to dictionary
        json_output["cationPiInteractions"][i] = {
            "ligandAtoms": [],
            "receptorAtoms": [],
        }
        for detail in individual_ligand_atoms_details:
            json_output["cationPiInteractions"][i]["ligandAtoms"].append(
                _atom_details_to_dict(detail)
            )
        for detail in individual_receptor_atoms_details:
            json_output["cationPiInteractions"][i]["receptorAtoms"].append(
                _atom_details_to_dict(detail)
            )
        # increment counter
        i += 1


def _collect_salt_bridge(salt_bridge_interactions, json_output):
    # reset counter for interaction
    i = 0
    # salt bridge interactions
    for atom_pair in salt_bridge_interactions:
        # add new dictionary to salt_bridges list
        json_output["saltBridges"].append({})
        # parse atom_pairs into individual atoms
        individual_ligand_atoms = atom_pair[0].split("/")
        individual_receptor_atoms = atom_pair[1].split("/")
        # parse individual atoms into details
        individual_ligand_atoms_details = []
        for atom in individual_ligand_atoms:
            if atom != "":
                individual_ligand_atoms_details.append(re.split(r"[\[\]():]", atom))
        individual_receptor_atoms_details = []
        for atom in individual_receptor_atoms:
            if atom != "":
                individual_receptor_atoms_details.append(re.split(r"[\[\]():]", atom))
        # remove whitespace
        for detail_list in individual_ligand_atoms_details:
            for detail in detail_list:
                if detail == "":
                    detail_list.remove(detail)
        for detail_list in individual_receptor_atoms_details:
            for detail in detail_list:
                if detail == "":
                    detail_list.remove(detail)
        # add each detail to the appropriate key in ligand_atoms and receptor_atoms
        # add "ligandAtoms" and "receptorAtoms" keys to dictionary
        json_output["saltBridges"][i] = {"ligandAtoms": [], "receptorAtoms": []}
        for detail in individual_ligand_atoms_details:
            json_output["saltBridges"][i]["ligandAtoms"].append(
                _atom_details_to_dict(detail)
            )
        for detail in individual_receptor_atoms_details:
            json_output["saltBridges"][i]["receptorAtoms"].append(
                _atom_details_to_dict(detail)
            )
        # increment counter
        i += 1


# json output
def collect(
    ligand_filename,
    receptor_filename,
    closest_labels=None,
    close_labels=None,
    hydrophobics_labels=None,
    hydrogen_bonds_labels=None,
    salt_bridge_labels=None,
    pi_pi_labels=None,
    pi_cat_labels=None,
):
    """Collects all the characterized interactions between the protein and 
    ligand into one dict object, suitable for conversion to JSON.

    Args:
        ligand_filename (str): The filename of the ligand.
        receptor_filename (str): The filename of the receptor.
        closest_labels (list, optional): A list of the corresponding iteraction
            labels. Defaults to None.
        close_labels (list, optional): A list of the corresponding iteraction
            labels. Defaults to None.
        hydrophobics_labels (list, optional): A list of the corresponding
            iteraction labels. Defaults to None.
        hydrogen_bonds_labels (list, optional): A list of the corresponding
            iteraction labels. Defaults to None.
        salt_bridge_labels (list, optional): A list of the corresponding
            iteraction labels. Defaults to None.
        pi_pi_labels (dict, optional): A dictionary containing the pi-pi
            iteraction labels. Key "pi_stacking" contains the labels for the
            pi-pi stacking interactions, and key "T_stacking" contains the
            labels for T-shaped interactions. Defaults to None.
        pi_cat_labels (list, optional): A list of the corresponding iteraction
            labels. Defaults to None.

    Returns:
        dict: A dictionary describing all the detected interactions, suitable
        for conversion to JSON.
    """

    json_output = {}

    # first level keys
    json_output["hydrogenBonds"] = []
    json_output["piPiStackingInteractions"] = []
    json_output["tStackingInteractions"] = []
    json_output["cationPiInteractions"] = []
    json_output["saltBridges"] = []

    # populate the lists of proximity metrics. use helper function to populate
    # lists for pairwise interactions
    if closest_labels is not None:
        json_output["contactsWithin2.5A"] = _get_close_atom_list(closest_labels)
    if close_labels is not None:
        json_output["contactsWithin4.0A"] = _get_close_atom_list(close_labels)
    if hydrophobics_labels is not None:
        json_output["hydrophobicContacts"] = _get_close_atom_list(hydrophobics_labels)

    # Add in the other metrics that are more difficult to calculate.
    if hydrogen_bonds_labels is not None:
        _collect_hydrogen_bonds(hydrogen_bonds_labels, json_output)
    if pi_pi_labels is not None:
        _collect_pi_pi(pi_pi_labels["pi_stacking"], json_output)
        _collect_t_stacking(pi_pi_labels["T_stacking"], json_output)
    if pi_cat_labels is not None:
        _collect_cat_pi(pi_cat_labels, json_output)
    if salt_bridge_labels is not None:
        _collect_salt_bridge(salt_bridge_labels, json_output)

    # dump to json file
    dname = dirname(ligand_filename) if dirname(ligand_filename) != "" else "."
    bname_ligand_filename = basename(ligand_filename)
    bname_receptor_filename = basename(receptor_filename)
    bname_ligand_filename_no_ext = ".".join(bname_ligand_filename.split(".")[:-1])
    bname_receptor_filename_no_ext = ".".join(bname_receptor_filename.split(".")[:-1])

    output_file_name = (
        dname
        + sep
        + (
            bname_ligand_filename_no_ext
            + "_"
            + bname_receptor_filename_no_ext
            + "_output.json"
        )
    )

    # Important not to use 'as f' fopr transcrypt
    jfile = _openFile(output_file_name, "w")
    json.dump(json_output, jfile)
    jfile.close()

    # return json object
    return json_output

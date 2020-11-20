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
import binana.shim as json
sep = binana.shim.sep
from binana.shim import basename
from binana.shim import dirname
?"""

# __pragma__ ('skip')
# Python, just alias open
openFile = open
# __pragma__ ('noskip')

"""?
# Transcrypt
openFile = binana.shim.OpenFile
?"""


def atom_details_to_dict(details):
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
def get_close_atom_list(interaction_labels):
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
            "ligandAtoms": [atom_details_to_dict(ligand_atom_details)],
            "receptorAtoms": [atom_details_to_dict(receptor_atom_details)],
        }
        # increment counter
        i += 1
    return interaction_list


def collect_hydrogen_bonds(hydrogen_bonds, json_output):
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
                atom_details_to_dict(detail)
            )
        for detail in receptor_atom_details:
            json_output["hydrogenBonds"][i]["receptorAtoms"].append(
                atom_details_to_dict(detail)
            )
        # increment counter
        i += 1


def collect_pi_pi(pi_stacking_interactions, json_output):
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
                atom_details_to_dict(detail)
            )
        for detail in individual_receptor_atoms_details:
            json_output["piPiStackingInteractions"][i]["receptorAtoms"].append(
                atom_details_to_dict(detail)
            )
        # increment counter
        i += 1


def collect_t_stacking(t_stacking_interactions, json_output):
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
                atom_details_to_dict(detail)
            )
        for detail in individual_receptor_atoms_details:
            json_output["tStackingInteractions"][i]["receptorAtoms"].append(
                atom_details_to_dict(detail)
            )
        # increment counter
        i += 1


def collect_cat_pi(cat_pi_interactions, json_output):
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
                atom_details_to_dict(detail)
            )
        for detail in individual_receptor_atoms_details:
            json_output["cationPiInteractions"][i]["receptorAtoms"].append(
                atom_details_to_dict(detail)
            )
        # increment counter
        i += 1


def collect_salt_bridge(salt_bridge_interactions, json_output):
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
                atom_details_to_dict(detail)
            )
        for detail in individual_receptor_atoms_details:
            json_output["saltBridges"][i]["receptorAtoms"].append(
                atom_details_to_dict(detail)
            )
        # increment counter
        i += 1


# json output
def json_file(
    close_contact_interactions,
    contact_interactions,
    hydrogen_bonds,
    hydrophobic_interactions,
    pi_stacking_interactions,
    t_stacking_interactions,
    cat_pi_interactions,
    salt_bridge_interactions,
    ligand_filename,
    receptor_filename,
):

    json_output = {}
    # first level keys
    json_output["contactsWithin2.5A"] = []
    json_output["contactsWithin4.0A"] = []
    json_output["hydrogenBonds"] = []
    json_output["hydrophobicContacts"] = []
    json_output["piPiStackingInteractions"] = []
    json_output["tStackingInteractions"] = []
    json_output["cationPiInteractions"] = []
    json_output["saltBridges"] = []

    # populate the lists of proximity metrics.
    # use helper function to populate lists for pairwise interactions
    json_output["contactsWithin2.5A"] = get_close_atom_list(close_contact_interactions)
    json_output["contactsWithin4.0A"] = get_close_atom_list(contact_interactions)
    json_output["hydrophobicContacts"] = get_close_atom_list(hydrophobic_interactions)

    # Add in the other metrics that are more difficult to calculate.
    collect_hydrogen_bonds(hydrogen_bonds, json_output)
    collect_pi_pi(pi_stacking_interactions, json_output)
    collect_t_stacking(t_stacking_interactions, json_output)
    collect_cat_pi(cat_pi_interactions, json_output)
    collect_salt_bridge(salt_bridge_interactions, json_output)

    # dump to json file
    dname = dirname(ligand_filename) if dirname(ligand_filename) != "" else "."
    bname_ligand_filename = basename(ligand_filename)
    bname_receptor_filename = basename(receptor_filename)
    bname_ligand_filename_no_ext = ".".join(bname_ligand_filename.split(".")[:-1])
    bname_receptor_filename_no_ext = ".".join(bname_receptor_filename.split(".")[:-1])

    outputFileName = (
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
    jfile = openFile(outputFileName, "w")
    json.dump(json_output, jfile)
    jfile.close()

    # return json object
    return json_output

// Transcrypt'ed from Python, 2021-08-01 02:57:40
var binana = {};
var re = {};
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {OpenFile} from './binana._utils.shim.js';
import {dirname} from './binana._utils.shim.js';
import {basename} from './binana._utils.shim.js';
import {sep} from './binana._utils.shim.js';
import * as json from './binana._utils.shim.js';
import * as __module_binana__ from './binana.js';
__nest__ (binana, '', __module_binana__);
import * as __module_re__ from './re.js';
__nest__ (re, '', __module_re__);
var __name__ = 'binana.output.dictionary';
export var _openFile = OpenFile;
export var _atom_details_to_dict = function (details) {
	return dict ({'chain': details [0].strip (), 'resID': int (details [2]), 'resName': details [1], 'atomName': details [3], 'atomIndex': int (details [4])});
};
export var _get_close_atom_list = function (interaction_labels) {
	var i = 0;
	var interaction_list = [];
	for (var atom_pairs of interaction_labels) {
		interaction_list.append (dict ({}));
		var ligand_atom_details = re.py_split ('[():]', atom_pairs [0]);
		var receptor_atom_details = re.py_split ('[():]', atom_pairs [1]);
		for (var detail of ligand_atom_details) {
			if (detail == '') {
				ligand_atom_details.remove (detail);
			}
		}
		for (var detail of receptor_atom_details) {
			if (detail == '') {
				receptor_atom_details.remove (detail);
			}
		}
		interaction_list [i] = dict ({'ligandAtoms': [_atom_details_to_dict (ligand_atom_details)], 'receptorAtoms': [_atom_details_to_dict (receptor_atom_details)]});
		i++;
	}
	return interaction_list;
};
export var _collect_hydrogen_bonds = function (hydrogen_bonds, json_output) {
	var i = 0;
	for (var atom_pairs of hydrogen_bonds) {
		json_output ['hydrogenBonds'].append (dict ({}));
		var ligand_and_receptor = [re.py_split ('[():]', atom_pairs [0]), re.py_split ('[():]', atom_pairs [1]), re.py_split ('[():]', atom_pairs [2])];
		var ligand_atom_details = [ligand_and_receptor [0]];
		var receptor_atom_details = [ligand_and_receptor [2]];
		if (atom_pairs [3] == 'RECEPTOR') {
			receptor_atom_details.append (ligand_and_receptor [1]);
		}
		else {
			ligand_atom_details.append (ligand_and_receptor [1]);
		}
		for (var atom of ligand_atom_details) {
			for (var detail of atom) {
				if (detail == '') {
					atom.remove (detail);
				}
			}
		}
		for (var atom of receptor_atom_details) {
			for (var detail of atom) {
				if (detail == '') {
					atom.remove (detail);
				}
			}
		}
		json_output ['hydrogenBonds'] [i] = dict ({'ligandAtoms': [], 'receptorAtoms': []});
		for (var detail of ligand_atom_details) {
			json_output ['hydrogenBonds'] [i] ['ligandAtoms'].append (_atom_details_to_dict (detail));
		}
		for (var detail of receptor_atom_details) {
			json_output ['hydrogenBonds'] [i] ['receptorAtoms'].append (_atom_details_to_dict (detail));
		}
		i++;
	}
};
export var _collect_pi_pi = function (pi_stacking_interactions, json_output) {
	var i = 0;
	for (var atom_pair of pi_stacking_interactions) {
		json_output ['piPiStackingInteractions'].append (dict ({}));
		var individual_ligand_atoms = atom_pair [0].py_split ('/');
		var individual_receptor_atoms = atom_pair [1].py_split ('/');
		var individual_ligand_atoms_details = [];
		for (var atom of individual_ligand_atoms) {
			if (atom != '') {
				individual_ligand_atoms_details.append (re.py_split ('[\\[\\]():]', atom));
			}
		}
		var individual_receptor_atoms_details = [];
		for (var atom of individual_receptor_atoms) {
			if (atom != '') {
				individual_receptor_atoms_details.append (re.py_split ('[\\[\\]():]', atom));
			}
		}
		for (var detail_list of individual_ligand_atoms_details) {
			for (var detail of detail_list) {
				if (detail == '') {
					detail_list.remove (detail);
				}
			}
		}
		for (var detail_list of individual_receptor_atoms_details) {
			for (var detail of detail_list) {
				if (detail == '') {
					detail_list.remove (detail);
				}
			}
		}
		json_output ['piPiStackingInteractions'] [i] = dict ({'ligandAtoms': [], 'receptorAtoms': []});
		for (var detail of individual_ligand_atoms_details) {
			json_output ['piPiStackingInteractions'] [i] ['ligandAtoms'].append (_atom_details_to_dict (detail));
		}
		for (var detail of individual_receptor_atoms_details) {
			json_output ['piPiStackingInteractions'] [i] ['receptorAtoms'].append (_atom_details_to_dict (detail));
		}
		i++;
	}
};
export var _collect_t_stacking = function (t_stacking_interactions, json_output) {
	var i = 0;
	for (var atom_pair of t_stacking_interactions) {
		json_output ['tStackingInteractions'].append (dict ({}));
		var individual_ligand_atoms = atom_pair [0].py_split ('/');
		var individual_receptor_atoms = atom_pair [1].py_split ('/');
		var individual_ligand_atoms_details = [];
		for (var atom of individual_ligand_atoms) {
			if (atom != '') {
				individual_ligand_atoms_details.append (re.py_split ('[\\[\\]():]', atom));
			}
		}
		var individual_receptor_atoms_details = [];
		for (var atom of individual_receptor_atoms) {
			if (atom != '') {
				individual_receptor_atoms_details.append (re.py_split ('[\\[\\]():]', atom));
			}
		}
		for (var detail_list of individual_ligand_atoms_details) {
			for (var detail of detail_list) {
				if (detail == '') {
					detail_list.remove (detail);
				}
			}
		}
		for (var detail_list of individual_receptor_atoms_details) {
			for (var detail of detail_list) {
				if (detail == '') {
					detail_list.remove (detail);
				}
			}
		}
		json_output ['tStackingInteractions'] [i] = dict ({'ligandAtoms': [], 'receptorAtoms': []});
		for (var detail of individual_ligand_atoms_details) {
			json_output ['tStackingInteractions'] [i] ['ligandAtoms'].append (_atom_details_to_dict (detail));
		}
		for (var detail of individual_receptor_atoms_details) {
			json_output ['tStackingInteractions'] [i] ['receptorAtoms'].append (_atom_details_to_dict (detail));
		}
		i++;
	}
};
export var _collect_cat_pi = function (cat_pi_interactions, json_output) {
	var i = 0;
	for (var atom_pair of cat_pi_interactions) {
		json_output ['cationPiInteractions'].append (dict ({}));
		var individual_ligand_atoms = atom_pair [0].py_split ('/');
		var individual_receptor_atoms = atom_pair [1].py_split ('/');
		var individual_ligand_atoms_details = [];
		for (var atom of individual_ligand_atoms) {
			if (atom != '') {
				individual_ligand_atoms_details.append (re.py_split ('[\\[\\]():]', atom));
			}
		}
		var individual_receptor_atoms_details = [];
		for (var atom of individual_receptor_atoms) {
			if (atom != '') {
				individual_receptor_atoms_details.append (re.py_split ('[\\[\\]():]', atom));
			}
		}
		for (var detail_list of individual_ligand_atoms_details) {
			for (var detail of detail_list) {
				if (detail == '') {
					detail_list.remove (detail);
				}
			}
		}
		for (var detail_list of individual_receptor_atoms_details) {
			for (var detail of detail_list) {
				if (detail == '') {
					detail_list.remove (detail);
				}
			}
		}
		json_output ['cationPiInteractions'] [i] = dict ({'ligandAtoms': [], 'receptorAtoms': []});
		for (var detail of individual_ligand_atoms_details) {
			json_output ['cationPiInteractions'] [i] ['ligandAtoms'].append (_atom_details_to_dict (detail));
		}
		for (var detail of individual_receptor_atoms_details) {
			json_output ['cationPiInteractions'] [i] ['receptorAtoms'].append (_atom_details_to_dict (detail));
		}
		i++;
	}
};
export var _collect_salt_bridge = function (salt_bridge_interactions, json_output) {
	var i = 0;
	for (var atom_pair of salt_bridge_interactions) {
		json_output ['saltBridges'].append (dict ({}));
		var individual_ligand_atoms = atom_pair [0].py_split ('/');
		var individual_receptor_atoms = atom_pair [1].py_split ('/');
		var individual_ligand_atoms_details = [];
		for (var atom of individual_ligand_atoms) {
			if (atom != '') {
				individual_ligand_atoms_details.append (re.py_split ('[\\[\\]():]', atom));
			}
		}
		var individual_receptor_atoms_details = [];
		for (var atom of individual_receptor_atoms) {
			if (atom != '') {
				individual_receptor_atoms_details.append (re.py_split ('[\\[\\]():]', atom));
			}
		}
		for (var detail_list of individual_ligand_atoms_details) {
			for (var detail of detail_list) {
				if (detail == '') {
					detail_list.remove (detail);
				}
			}
		}
		for (var detail_list of individual_receptor_atoms_details) {
			for (var detail of detail_list) {
				if (detail == '') {
					detail_list.remove (detail);
				}
			}
		}
		json_output ['saltBridges'] [i] = dict ({'ligandAtoms': [], 'receptorAtoms': []});
		for (var detail of individual_ligand_atoms_details) {
			json_output ['saltBridges'] [i] ['ligandAtoms'].append (_atom_details_to_dict (detail));
		}
		for (var detail of individual_receptor_atoms_details) {
			json_output ['saltBridges'] [i] ['receptorAtoms'].append (_atom_details_to_dict (detail));
		}
		i++;
	}
};
export var collect = function (closest, close, hydrophobics, hydrogen_bonds, salt_bridges, pi_pi, cat_pi, electrostatic_energies, active_site_flexibility, ligand_atom_types, ligand_rotatable_bonds) {
	if (typeof closest == 'undefined' || (closest != null && closest.hasOwnProperty ("__kwargtrans__"))) {;
		var closest = null;
	};
	if (typeof close == 'undefined' || (close != null && close.hasOwnProperty ("__kwargtrans__"))) {;
		var close = null;
	};
	if (typeof hydrophobics == 'undefined' || (hydrophobics != null && hydrophobics.hasOwnProperty ("__kwargtrans__"))) {;
		var hydrophobics = null;
	};
	if (typeof hydrogen_bonds == 'undefined' || (hydrogen_bonds != null && hydrogen_bonds.hasOwnProperty ("__kwargtrans__"))) {;
		var hydrogen_bonds = null;
	};
	if (typeof salt_bridges == 'undefined' || (salt_bridges != null && salt_bridges.hasOwnProperty ("__kwargtrans__"))) {;
		var salt_bridges = null;
	};
	if (typeof pi_pi == 'undefined' || (pi_pi != null && pi_pi.hasOwnProperty ("__kwargtrans__"))) {;
		var pi_pi = null;
	};
	if (typeof cat_pi == 'undefined' || (cat_pi != null && cat_pi.hasOwnProperty ("__kwargtrans__"))) {;
		var cat_pi = null;
	};
	if (typeof electrostatic_energies == 'undefined' || (electrostatic_energies != null && electrostatic_energies.hasOwnProperty ("__kwargtrans__"))) {;
		var electrostatic_energies = null;
	};
	if (typeof active_site_flexibility == 'undefined' || (active_site_flexibility != null && active_site_flexibility.hasOwnProperty ("__kwargtrans__"))) {;
		var active_site_flexibility = null;
	};
	if (typeof ligand_atom_types == 'undefined' || (ligand_atom_types != null && ligand_atom_types.hasOwnProperty ("__kwargtrans__"))) {;
		var ligand_atom_types = null;
	};
	if (typeof ligand_rotatable_bonds == 'undefined' || (ligand_rotatable_bonds != null && ligand_rotatable_bonds.hasOwnProperty ("__kwargtrans__"))) {;
		var ligand_rotatable_bonds = null;
	};
	var json_output = dict ({});
	if (closest !== null) {
		json_output ['closestContacts'] = _get_close_atom_list (closest ['labels']);
	}
	if (close !== null) {
		json_output ['closeContacts'] = _get_close_atom_list (close ['labels']);
	}
	if (hydrophobics !== null) {
		json_output ['hydrophobicContacts'] = _get_close_atom_list (hydrophobics ['labels']);
	}
	if (hydrogen_bonds !== null) {
		json_output ['hydrogenBonds'] = [];
		_collect_hydrogen_bonds (hydrogen_bonds ['labels'], json_output);
	}
	if (pi_pi !== null) {
		json_output ['piPiStackingInteractions'] = [];
		_collect_pi_pi (pi_pi ['labels'] ['pi_stacking'], json_output);
		json_output ['tStackingInteractions'] = [];
		_collect_t_stacking (pi_pi ['labels'] ['T_stacking'], json_output);
	}
	if (cat_pi !== null) {
		json_output ['cationPiInteractions'] = [];
		_collect_cat_pi (cat_pi ['labels'], json_output);
	}
	if (salt_bridges !== null) {
		json_output ['saltBridges'] = [];
		_collect_salt_bridge (salt_bridges ['labels'], json_output);
	}
	if (active_site_flexibility !== null) {
		json_output ['activeSiteFlexibility'] = active_site_flexibility ['counts'];
	}
	if (electrostatic_energies !== null) {
		json_output ['electrostaticEnergies'] = electrostatic_energies ['counts'];
	}
	if (ligand_atom_types !== null) {
		json_output ['ligandAtomTypes'] = ligand_atom_types ['counts'];
	}
	if (ligand_rotatable_bonds !== null) {
		json_output ['ligandRotatableBonds'] = ligand_rotatable_bonds;
	}
	return json_output;
};
export var collect_all = function (all_interactions) {
	return collect (__kwargtrans__ ({closest: all_interactions ['closest'], close: all_interactions ['close'], hydrophobics: all_interactions ['hydrophobics'], hydrogen_bonds: all_interactions ['hydrogen_bonds'], salt_bridges: all_interactions ['salt_bridges'], pi_pi: all_interactions ['pi_pi'], cat_pi: all_interactions ['cat_pi'], electrostatic_energies: all_interactions ['electrostatic_energies'], active_site_flexibility: all_interactions ['active_site_flexibility'], ligand_atom_types: all_interactions ['ligand_atom_types'], ligand_rotatable_bonds: all_interactions ['ligand_rotatable_bonds']}));
};

//# sourceMappingURL=binana.output.dictionary.map
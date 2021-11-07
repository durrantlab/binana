// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2020 Jacob D. Durrant.

// Transcrypt'ed from Python, 2021-11-05 16:24:09
var __future__ = {};
var binana = {};
var math = {};
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {fabs} from './binana._utils.shim.js';
import * as __module_math__ from './math.js';
__nest__ (math, '', __module_math__);
import * as __module___future____ from './__future__.js';
__nest__ (__future__, '', __module___future____);
import {angle_between_three_points} from './binana._utils._math_functions.js';
import {Mol} from './binana._structure.mol.js';
import {hashtable_entry_add_one, list_alphebetize_and_combine} from './binana._utils.utils.js';
import {_get_ligand_receptor_dists} from './binana.load_ligand_receptor.js';
import * as __module_binana__ from './binana.js';
__nest__ (binana, '', __module_binana__);
import {HYDROGEN_HALOGEN_BOND_ANGLE_CUTOFF, HYDROGEN_HALOGEN_BOND_DIST_CUTOFF} from './binana.interactions.default_params.js';
import {_set_default} from './binana._utils.shim.js';
var __name__ = 'binana.interactions._hydrogen_halogen_bonds';
export var max_donor_X_dist = dict ({'H': 1.3, 'I': 2.04 * 1.4, 'BR': 1.86 * 1.4, 'Br': 1.86 * 1.4, 'CL': 1.71 * 1.4, 'Cl': 1.71 * 1.4, 'F': 1.33 * 1.4});
export var get_hydrogen_or_halogen_bonds = function (ligand, receptor, dist_cutoff, angle_cutoff, hydrogen_bond) {
	if (typeof dist_cutoff == 'undefined' || (dist_cutoff != null && dist_cutoff.hasOwnProperty ("__kwargtrans__"))) {;
		var dist_cutoff = null;
	};
	if (typeof angle_cutoff == 'undefined' || (angle_cutoff != null && angle_cutoff.hasOwnProperty ("__kwargtrans__"))) {;
		var angle_cutoff = null;
	};
	if (typeof hydrogen_bond == 'undefined' || (hydrogen_bond != null && hydrogen_bond.hasOwnProperty ("__kwargtrans__"))) {;
		var hydrogen_bond = true;
	};
	var central_atoms = (hydrogen_bond ? ['H'] : ['I', 'BR', 'Br', 'CL', 'Cl', 'F']);
	var dist_cutoff = _set_default (dist_cutoff, HYDROGEN_HALOGEN_BOND_DIST_CUTOFF);
	var angle_cutoff = _set_default (angle_cutoff, HYDROGEN_HALOGEN_BOND_ANGLE_CUTOFF);
	var hbonds = dict ({});
	var pdb_hbonds = Mol ();
	var hbonds_labels = [];
	var ligand_receptor_dists = _get_ligand_receptor_dists (ligand, receptor);
	for (var [ligand_atom, receptor_atom, dist] of ligand_receptor_dists) {
		if (dist < dist_cutoff && __in__ (ligand_atom.element, ['O', 'N']) && __in__ (receptor_atom.element, ['O', 'N'])) {
			var hydrogens = [];
			for (var atm_index of ligand.all_atoms.py_keys ()) {
				var element = ligand.all_atoms [atm_index].element;
				if (__in__ (element, central_atoms)) {
					var dist = ligand.all_atoms [atm_index].coordinates.dist_to (ligand_atom.coordinates);
					if (dist < max_donor_X_dist [element]) {
						ligand.all_atoms [atm_index].comment = 'LIGAND';
						hydrogens.append (ligand.all_atoms [atm_index]);
					}
				}
			}
			for (var atm_index of receptor.all_atoms.py_keys ()) {
				var element = receptor.all_atoms [atm_index].element;
				if (__in__ (element, central_atoms)) {
					var dist = receptor.all_atoms [atm_index].coordinates.dist_to (receptor_atom.coordinates);
					if (dist < max_donor_X_dist [element]) {
						receptor.all_atoms [atm_index].comment = 'RECEPTOR';
						hydrogens.append (receptor.all_atoms [atm_index]);
					}
				}
			}
			for (var hydrogen of hydrogens) {
				if (fabs (180 - (angle_between_three_points (ligand_atom.coordinates, hydrogen.coordinates, receptor_atom.coordinates) * 180.0) / math.pi) <= angle_cutoff) {
					var hbonds_key = (((('HDONOR_' + hydrogen.comment) + '_') + receptor_atom.side_chain_or_backbone ()) + '_') + receptor_atom.structure;
					pdb_hbonds.add_new_atom (ligand_atom.copy_of ());
					pdb_hbonds.add_new_atom (hydrogen.copy_of ());
					pdb_hbonds.add_new_atom (receptor_atom.copy_of ());
					hashtable_entry_add_one (hbonds, hbonds_key);
					hbonds_labels.append (tuple ([ligand_atom.string_id (), hydrogen.string_id (), receptor_atom.string_id (), hydrogen.comment]));
				}
			}
		}
	}
	return dict ({'counts': hbonds, 'mol': pdb_hbonds, 'labels': hbonds_labels});
};

//# sourceMappingURL=binana.interactions._hydrogen_halogen_bonds.map
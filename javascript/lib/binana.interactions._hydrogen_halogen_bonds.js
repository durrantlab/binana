// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2020 Jacob D. Durrant.

// Transcrypt'ed from Python, 2021-11-19 00:20:09
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
export var _get_potential_donors_acceptors = function (ligand, receptor, dist_cutoff) {
	var ligand_receptor_dists = _get_ligand_receptor_dists (ligand, receptor, dist_cutoff, ['O', 'N', 'S']);
	return (function () {
		var __accu0__ = [];
		for (var [ligand_atom, receptor_atom, dist] of ligand_receptor_dists) {
			__accu0__.append ([ligand_atom, receptor_atom]);
		}
		return __accu0__;
	}) ();
};
export var _update_mol_and_data = function (pdb_hbonds, hbonds, hbonds_labels, lig_donor_or_accept, receptor_atom, ligand_atom, center_atom) {
	var comment = (lig_donor_or_accept == 'ACCEPTOR' ? 'RECEPTOR' : 'LIGAND');
	var hbonds_key = (((('HDONOR_' + comment) + '_') + receptor_atom.side_chain_or_backbone ()) + '_') + receptor_atom.structure;
	pdb_hbonds.add_new_atom (ligand_atom.copy_of ());
	pdb_hbonds.add_new_atom (center_atom.copy_of ());
	pdb_hbonds.add_new_atom (receptor_atom.copy_of ());
	hashtable_entry_add_one (hbonds, hbonds_key);
	hbonds_labels.append (tuple ([ligand_atom.string_id (), center_atom.string_id (), receptor_atom.string_id (), comment]));
};
export var _product = function (lst1, lst2) {
	var combos = [];
	for (var l1 of lst1) {
		for (var l2 of lst2) {
			combos.append ([l1, l2]);
		}
	}
	return combos;
};
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
	var hbonds = dict ({});
	var pdb_hbonds = Mol ();
	var hbonds_labels = [];
	var dist_cutoff = _set_default (dist_cutoff, HYDROGEN_HALOGEN_BOND_DIST_CUTOFF);
	var angle_cutoff = _set_default (angle_cutoff, HYDROGEN_HALOGEN_BOND_ANGLE_CUTOFF);
	var lig_and_recep_have_hydrogens = ligand.has_hydrogens && receptor.has_hydrogens;
	var close_donors_acceptors = _get_potential_donors_acceptors (ligand, receptor, dist_cutoff);
	for (var [ligand_atom, receptor_atom] of close_donors_acceptors) {
		var lig_atm_hbond_infs = ligand.is_hbond_donor_acceptor (ligand_atom, hydrogen_bond);
		var recep_atm_hbond_infs = receptor.is_hbond_donor_acceptor (receptor_atom, hydrogen_bond);
		var combos = _product (lig_atm_hbond_infs, recep_atm_hbond_infs);
		for (var [lig_atm_hbond_inf, recep_atm_hbond_inf] of combos) {
			var __left0__ = lig_atm_hbond_inf;
			var lig_donor_or_accept = __left0__ [0];
			var lig_center_atom = __left0__ [1];
			var __left0__ = recep_atm_hbond_inf;
			var recep_donor_or_accept = __left0__ [0];
			var accept_center_atom = __left0__ [1];
			if (lig_donor_or_accept == recep_donor_or_accept) {
				continue;
			}
			var center_atom = (lig_donor_or_accept == 'DONOR' ? lig_center_atom : accept_center_atom);
			if (lig_and_recep_have_hydrogens || !(hydrogen_bond)) {
				var angle = angle_between_three_points (ligand_atom.coordinates, center_atom.coordinates, receptor_atom.coordinates);
				if (fabs (180 - (angle * 180.0) / math.pi) > angle_cutoff) {
					continue;
				}
			}
			_update_mol_and_data (pdb_hbonds, hbonds, hbonds_labels, lig_donor_or_accept, receptor_atom, ligand_atom, center_atom);
			break;
		}
	}
	return dict ({'counts': hbonds, 'mol': pdb_hbonds, 'labels': hbonds_labels});
};

//# sourceMappingURL=binana.interactions._hydrogen_halogen_bonds.map
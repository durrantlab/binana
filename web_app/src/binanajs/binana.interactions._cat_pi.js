// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2020 Jacob D. Durrant.

// Transcrypt'ed from Python, 2021-11-26 23:51:10
var binana = {};
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {project_point_onto_plane} from './binana._utils._math_functions.js';
import {Mol} from './binana._structure.mol.js';
import {hashtable_entry_add_one} from './binana._utils.utils.js';
import * as __module_binana__ from './binana.js';
__nest__ (binana, '', __module_binana__);
import {CATION_PI_DIST_CUTOFF, PI_PADDING_DIST} from './binana.interactions.default_params.js';
import {_set_default} from './binana._utils.shim.js';
var __name__ = 'binana.interactions._cat_pi';
export var _detect_pi_cat = function (mol_with_aromatic, mol_with_pos_charge, cutoff, pi_padding, cat_pi, pdb_pi_cat, cat_pi_labels, name_of_charged) {
	if (typeof name_of_charged == 'undefined' || (name_of_charged != null && name_of_charged.hasOwnProperty ("__kwargtrans__"))) {;
		var name_of_charged = null;
	};
	var name_of_charged = _set_default (name_of_charged, 'RECEPTOR');
	for (var aromatic of mol_with_aromatic.aromatic_rings) {
		for (var charged of mol_with_pos_charge.charges) {
			var charge_ring_dist = charged.coordinates.dist_to (aromatic.center);
			if (charged.positive == true && charge_ring_dist < cutoff) {
				var charge_projected = project_point_onto_plane (charged.coordinates, aromatic.plane_coeff);
				if (charge_projected.dist_to (aromatic.center) < aromatic.radius + pi_padding) {
					var structure = mol_with_aromatic.all_atoms [aromatic.indices [0]].structure;
					if (structure == '') {
						var structure = 'OTHER';
					}
					var key = (('PI-CATION_' + name_of_charged) + '-CHARGED_') + structure;
					for (var index of aromatic.indices) {
						pdb_pi_cat.add_new_atom (mol_with_aromatic.all_atoms [index].copy_of ());
					}
					for (var index of charged.indices) {
						pdb_pi_cat.add_new_atom (mol_with_pos_charge.all_atoms [index].copy_of ());
					}
					hashtable_entry_add_one (cat_pi, key);
					var charged_mol_lbls = ('[' + ' / '.join ((function () {
						var __accu0__ = [];
						for (var index of charged.indices) {
							__accu0__.append (mol_with_pos_charge.all_atoms [index].string_id ());
						}
						return py_iter (__accu0__);
					}) ())) + ']';
					var aromatic_mol_lbls = ('[' + ' / '.join ((function () {
						var __accu0__ = [];
						for (var index of aromatic.indices) {
							__accu0__.append (mol_with_aromatic.all_atoms [index].string_id ());
						}
						return py_iter (__accu0__);
					}) ())) + ']';
					if (name_of_charged == 'LIGAND') {
						cat_pi_labels.append (tuple ([charged_mol_lbls, aromatic_mol_lbls, dict ({'distance': charge_ring_dist})]));
					}
					else {
						cat_pi_labels.append (tuple ([aromatic_mol_lbls, charged_mol_lbls, dict ({'distance': charge_ring_dist})]));
					}
				}
			}
		}
	}
	return tuple ([cat_pi, pdb_pi_cat, cat_pi_labels]);
};
export var get_cation_pi = function (ligand, receptor, cutoff, pi_padding) {
	if (typeof cutoff == 'undefined' || (cutoff != null && cutoff.hasOwnProperty ("__kwargtrans__"))) {;
		var cutoff = null;
	};
	if (typeof pi_padding == 'undefined' || (pi_padding != null && pi_padding.hasOwnProperty ("__kwargtrans__"))) {;
		var pi_padding = null;
	};
	var cutoff = _set_default (cutoff, CATION_PI_DIST_CUTOFF);
	var pi_padding = _set_default (pi_padding, PI_PADDING_DIST);
	var cat_pi = dict ({});
	var pdb_pi_cat = Mol ();
	var cat_pi_labels = [];
	var __left0__ = _detect_pi_cat (receptor, ligand, cutoff, pi_padding, cat_pi, pdb_pi_cat, cat_pi_labels, 'LIGAND');
	var cat_pi = __left0__ [0];
	var pdb_pi_cat = __left0__ [1];
	var cat_pi_labels = __left0__ [2];
	var __left0__ = _detect_pi_cat (ligand, receptor, cutoff, pi_padding, cat_pi, pdb_pi_cat, cat_pi_labels, 'RECEPTOR');
	var cat_pi = __left0__ [0];
	var pdb_pi_cat = __left0__ [1];
	var cat_pi_labels = __left0__ [2];
	return dict ({'counts': cat_pi, 'mol': pdb_pi_cat, 'labels': cat_pi_labels});
};

//# sourceMappingURL=binana.interactions._cat_pi.map
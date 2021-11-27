// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2020 Jacob D. Durrant.

// Transcrypt'ed from Python, 2021-11-23 00:01:21
var binana = {};
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {fabs} from './binana._utils.shim.js';
import {project_point_onto_plane} from './binana._utils._math_functions.js';
import {Mol} from './binana._structure.mol.js';
import {hashtable_entry_add_one, list_alphebetize_and_combine} from './binana._utils.utils.js';
import {_get_ligand_receptor_aromatic_dists} from './binana.load_ligand_receptor.js';
import * as __module_binana__ from './binana.js';
__nest__ (binana, '', __module_binana__);
import {PI_PADDING_DIST, PI_PI_INTERACTING_DIST_CUTOFF, PI_STACKING_ANGLE_TOLERANCE, T_STACKING_ANGLE_TOLERANCE, T_STACKING_CLOSEST_DIST_CUTOFF} from './binana.interactions.default_params.js';
import {_set_default} from './binana._utils.shim.js';
var __name__ = 'binana.interactions._pi_pi';
export var _t_stacking = function (ligand, receptor, ligand_aromatic, receptor_aromatic, dist, angle_between_planes, t_stacking_angle_tol, t_stacking_closest_dist_cutoff, pi_padding, pi_pi_interactions, pdb_pi_t, t_stacking_labels) {
	if (min (fabs (angle_between_planes - 90), fabs (angle_between_planes - 270)) < t_stacking_angle_tol) {
		var min_dist = 100.0;
		for (var ligand_ind of ligand_aromatic.indices) {
			var ligand_at = ligand.all_atoms [ligand_ind];
			for (var receptor_ind of receptor_aromatic.indices) {
				var receptor_at = receptor.all_atoms [receptor_ind];
				var dist = ligand_at.coordinates.dist_to (receptor_at.coordinates);
				if (dist < min_dist) {
					var min_dist = dist;
				}
			}
		}
		if (min_dist <= t_stacking_closest_dist_cutoff) {
			var pt_on_receptor_plane = project_point_onto_plane (ligand_aromatic.center, receptor_aromatic.plane_coeff);
			var pt_on_lignad_plane = project_point_onto_plane (receptor_aromatic.center, ligand_aromatic.plane_coeff);
			if (pt_on_receptor_plane.dist_to (receptor_aromatic.center) <= receptor_aromatic.radius + pi_padding || pt_on_lignad_plane.dist_to (ligand_aromatic.center) <= ligand_aromatic.radius + pi_padding) {
				var structure = receptor.all_atoms [receptor_aromatic.indices [0]].structure;
				if (structure == '') {
					var structure = 'OTHER';
				}
				var key = 'T-SHAPED_' + structure;
				for (var index of ligand_aromatic.indices) {
					pdb_pi_t.add_new_atom (ligand.all_atoms [index].copy_of ());
				}
				for (var index of receptor_aromatic.indices) {
					pdb_pi_t.add_new_atom (receptor.all_atoms [index].copy_of ());
				}
				hashtable_entry_add_one (pi_pi_interactions, key);
				t_stacking_labels.append (_make_pi_pi_interaction_label (ligand, ligand_aromatic, receptor, receptor_aromatic, dict ({'distance': dist, 'angle': min (fabs (angle_between_planes - 0), fabs (angle_between_planes - 180))})));
			}
		}
	}
	return tuple ([pi_pi_interactions, pdb_pi_t, t_stacking_labels]);
};
export var _make_pi_pi_interaction_label = function (ligand, ligand_aromatic, receptor, receptor_aromatic, metric) {
	return tuple ([('[' + ' / '.join ((function () {
		var __accu0__ = [];
		for (var index of ligand_aromatic.indices) {
			__accu0__.append (ligand.all_atoms [index].string_id ());
		}
		return __accu0__;
	}) ())) + ']', ('[' + ' / '.join ((function () {
		var __accu0__ = [];
		for (var index of receptor_aromatic.indices) {
			__accu0__.append (receptor.all_atoms [index].string_id ());
		}
		return __accu0__;
	}) ())) + ']', metric]);
};
export var _pi_pi_detect_by_projecting_all_ring_atoms = function (mol1, mol1_aromatic, mol2_aromatic, pi_padding) {
	for (var mol1_ring_index of mol1_aromatic.indices) {
		var pt_on_mol2_plane = project_point_onto_plane (mol1.all_atoms [mol1_ring_index].coordinates, mol2_aromatic.plane_coeff);
		if (pt_on_mol2_plane.dist_to (mol2_aromatic.center) <= mol2_aromatic.radius + pi_padding) {
			return true;
		}
	}
	return false;
};
export var _pi_stacking = function (ligand, receptor, ligand_aromatic, receptor_aromatic, dist, angle_between_planes, pi_stacking_angle_tol, pi_padding, pi_pi_interactions, pdb_pistack, pi_stacking_labels) {
	var angle = min (fabs (angle_between_planes - 0), fabs (angle_between_planes - 180));
	if (angle < pi_stacking_angle_tol) {
		var pi_pi = _pi_pi_detect_by_projecting_all_ring_atoms (ligand, ligand_aromatic, receptor_aromatic, pi_padding);
		if (!(pi_pi)) {
			var pi_pi = _pi_pi_detect_by_projecting_all_ring_atoms (receptor, receptor_aromatic, ligand_aromatic, pi_padding);
		}
		if (pi_pi) {
			var structure = receptor.all_atoms [receptor_aromatic.indices [0]].structure;
			var structure = (structure == '' ? 'OTHER' : structure);
			var key = 'STACKING_' + structure;
			for (var index of ligand_aromatic.indices) {
				pdb_pistack.add_new_atom (ligand.all_atoms [index].copy_of ());
			}
			for (var index of receptor_aromatic.indices) {
				pdb_pistack.add_new_atom (receptor.all_atoms [index].copy_of ());
			}
			hashtable_entry_add_one (pi_pi_interactions, key);
			pi_stacking_labels.append (_make_pi_pi_interaction_label (ligand, ligand_aromatic, receptor, receptor_aromatic, dict ({'distance': dist, 'angle': angle})));
		}
		var pi_stacking_detected = true;
	}
	else {
		var pi_stacking_detected = false;
	}
	return tuple ([pi_pi_interactions, pdb_pistack, pi_stacking_labels, pi_stacking_detected]);
};
export var get_pi_pi = function (ligand, receptor, pi_pi_general_dist_cutoff, pi_stacking_angle_tol, t_stacking_angle_tol, t_stacking_closest_dist_cutoff, pi_padding) {
	if (typeof pi_pi_general_dist_cutoff == 'undefined' || (pi_pi_general_dist_cutoff != null && pi_pi_general_dist_cutoff.hasOwnProperty ("__kwargtrans__"))) {;
		var pi_pi_general_dist_cutoff = null;
	};
	if (typeof pi_stacking_angle_tol == 'undefined' || (pi_stacking_angle_tol != null && pi_stacking_angle_tol.hasOwnProperty ("__kwargtrans__"))) {;
		var pi_stacking_angle_tol = null;
	};
	if (typeof t_stacking_angle_tol == 'undefined' || (t_stacking_angle_tol != null && t_stacking_angle_tol.hasOwnProperty ("__kwargtrans__"))) {;
		var t_stacking_angle_tol = null;
	};
	if (typeof t_stacking_closest_dist_cutoff == 'undefined' || (t_stacking_closest_dist_cutoff != null && t_stacking_closest_dist_cutoff.hasOwnProperty ("__kwargtrans__"))) {;
		var t_stacking_closest_dist_cutoff = null;
	};
	if (typeof pi_padding == 'undefined' || (pi_padding != null && pi_padding.hasOwnProperty ("__kwargtrans__"))) {;
		var pi_padding = null;
	};
	var pi_pi_general_dist_cutoff = _set_default (pi_pi_general_dist_cutoff, PI_PI_INTERACTING_DIST_CUTOFF);
	var pi_stacking_angle_tol = _set_default (pi_stacking_angle_tol, PI_STACKING_ANGLE_TOLERANCE);
	var t_stacking_angle_tol = _set_default (t_stacking_angle_tol, T_STACKING_ANGLE_TOLERANCE);
	var t_stacking_closest_dist_cutoff = _set_default (t_stacking_closest_dist_cutoff, T_STACKING_CLOSEST_DIST_CUTOFF);
	var pi_padding = _set_default (pi_padding, PI_PADDING_DIST);
	var ligand_receptor_aromatic_dists = _get_ligand_receptor_aromatic_dists (ligand, receptor, pi_pi_general_dist_cutoff);
	var pi_interactions = dict ({});
	var pdb_pistack = Mol ();
	var pdb_pi_t = Mol ();
	var pi_stacking_labels = [];
	var t_stacking_labels = [];
	for (var [ligand_aromatic, receptor_aromatic, dist, angle_between_planes] of ligand_receptor_aromatic_dists) {
		var __left0__ = _pi_stacking (ligand, receptor, ligand_aromatic, receptor_aromatic, dist, angle_between_planes, pi_stacking_angle_tol, pi_padding, pi_interactions, pdb_pistack, pi_stacking_labels);
		var pi_interactions = __left0__ [0];
		var pdb_pistack = __left0__ [1];
		var pi_stacking_labels = __left0__ [2];
		var pi_stacking_detected = __left0__ [3];
		if (!(pi_stacking_detected)) {
			var __left0__ = _t_stacking (ligand, receptor, ligand_aromatic, receptor_aromatic, dist, angle_between_planes, t_stacking_angle_tol, t_stacking_closest_dist_cutoff, pi_padding, pi_interactions, pdb_pi_t, t_stacking_labels);
			var pi_interactions = __left0__ [0];
			var pdb_pi_t = __left0__ [1];
			var t_stacking_labels = __left0__ [2];
		}
	}
	return dict ({'counts': pi_interactions, 'mols': dict ({'pi_stacking': pdb_pistack, 'T_stacking': pdb_pi_t}), 'labels': dict ({'pi_stacking': pi_stacking_labels, 'T_stacking': t_stacking_labels})});
};

//# sourceMappingURL=binana.interactions._pi_pi.map
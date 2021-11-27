// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2020 Jacob D. Durrant.

// Transcrypt'ed from Python, 2021-11-27 01:23:31
var __future__ = {};
var binana = {};
var math = {};
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {fabs} from './binana._utils.shim.js';
import * as shim from './binana._utils.shim.js';
import * as __module_binana__ from './binana.js';
__nest__ (binana, '', __module_binana__);
import * as __module_math__ from './math.js';
__nest__ (math, '', __module_math__);
import {from_files} from './binana.load_ligand_receptor.js';
import {get_all_interactions} from './binana.interactions.js';
import {_write_main} from './binana.output.js';
import * as __module___future____ from './__future__.js';
__nest__ (__future__, '', __module___future____);
var __name__ = 'binana._start';
export var textwrap = shim;
export var VERSION = '2.0';
export var _get_all_interactions = function (parameters) {
	var max_cutoff = max ((function () {
		var __accu0__ = [];
		for (var i of parameters.params.py_items ()) {
			if (__in__ ('dist', i [0]) && __in__ ('cutoff', i [0])) {
				__accu0__.append (i [1]);
			}
		}
		return py_iter (__accu0__);
	}) ()) + 15;
	var __left0__ = from_files (parameters.params ['ligand'], parameters.params ['receptor'], max_cutoff);
	var ligand = __left0__ [0];
	var receptor = __left0__ [1];
	var pi_padding = parameters.params ['pi_padding_dist'];
	var all_interacts = get_all_interactions (ligand, receptor, parameters.params ['close_contacts_dist1_cutoff'], parameters.params ['close_contacts_dist2_cutoff'], parameters.params ['electrostatic_dist_cutoff'], parameters.params ['active_site_flexibility_dist_cutoff'], parameters.params ['hydrophobic_dist_cutoff'], parameters.params ['hydrogen_bond_dist_cutoff'], parameters.params ['hydrogen_halogen_bond_angle_cutoff'], parameters.params ['halogen_bond_dist_cutoff'], parameters.params ['pi_pi_interacting_dist_cutoff'], parameters.params ['pi_stacking_angle_tolerance'], parameters.params ['T_stacking_angle_tolerance'], parameters.params ['T_stacking_closest_dist_cutoff'], parameters.params ['cation_pi_dist_cutoff'], parameters.params ['salt_bridge_dist_cutoff'], parameters.params ['metal_coordination_dist_cutoff'], pi_padding);
	for (var key of all_interacts ['cat_pi'] ['counts'].py_keys ()) {
		all_interacts ['pi_pi'] ['counts'] [key] = all_interacts ['cat_pi'] ['counts'] [key];
	}
	_write_main (parameters, ligand, receptor, all_interacts ['closest'], all_interacts ['close'], all_interacts ['hydrophobics'], all_interacts ['hydrogen_bonds'], all_interacts ['halogen_bonds'], all_interacts ['salt_bridges'], all_interacts ['metal_coordinations'], all_interacts ['pi_pi'], all_interacts ['cat_pi'], all_interacts ['electrostatic_energies'], all_interacts ['active_site_flexibility'], all_interacts ['ligand_atom_types']);
};
export var _intro = function () {
	print ('\n                            [- END INTRO -]\n');
};

//# sourceMappingURL=binana._start.map
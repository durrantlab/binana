// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2020 Jacob D. Durrant.

// Transcrypt'ed from Python, 2021-11-09 23:51:08
var binana = {};
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {Mol} from './binana._structure.mol.js';
import {hashtable_entry_add_one, list_alphebetize_and_combine} from './binana._utils.utils.js';
import {_get_ligand_receptor_dists} from './binana.load_ligand_receptor.js';
import * as __module_binana__ from './binana.js';
__nest__ (binana, '', __module_binana__);
import {SALT_BRIDGE_DIST_CUTOFF} from './binana.interactions.default_params.js';
import {_set_default} from './binana._utils.shim.js';
var __name__ = 'binana.interactions._salt_bridges';
export var get_salt_bridges = function (ligand, receptor, cutoff) {
	if (typeof cutoff == 'undefined' || (cutoff != null && cutoff.hasOwnProperty ("__kwargtrans__"))) {;
		var cutoff = null;
	};
	var cutoff = _set_default (cutoff, SALT_BRIDGE_DIST_CUTOFF);
	var salt_bridges = dict ({});
	var pdb_salt_bridges = Mol ();
	var salt_bridge_labels = [];
	for (var receptor_charge of receptor.charges) {
		for (var ligand_charge of ligand.charges) {
			if (ligand_charge.positive != receptor_charge.positive && ligand_charge.coordinates.dist_to (receptor_charge.coordinates) < cutoff) {
				var structure = receptor.all_atoms [receptor_charge.indices [0]].structure;
				if (structure == '') {
					var structure = 'OTHER';
				}
				var key = 'SALT-BRIDGE_' + structure;
				for (var index of receptor_charge.indices) {
					var idx = int (index);
					var atom = receptor.all_atoms [idx];
					pdb_salt_bridges.add_new_atom (atom.copy_of ());
				}
				for (var index of ligand_charge.indices) {
					var idx = int (index);
					var atom = ligand.all_atoms [idx];
					pdb_salt_bridges.add_new_atom (atom.copy_of ());
				}
				hashtable_entry_add_one (salt_bridges, key);
				salt_bridge_labels.append (tuple ([('[' + ' / '.join ((function () {
					var __accu0__ = [];
					for (var index of ligand_charge.indices) {
						__accu0__.append (ligand.all_atoms [int (index)].string_id ());
					}
					return py_iter (__accu0__);
				}) ())) + ']', ('[' + ' / '.join ((function () {
					var __accu0__ = [];
					for (var index of receptor_charge.indices) {
						__accu0__.append (receptor.all_atoms [int (index)].string_id ());
					}
					return py_iter (__accu0__);
				}) ())) + ']']));
			}
		}
	}
	return dict ({'counts': salt_bridges, 'mol': pdb_salt_bridges, 'labels': salt_bridge_labels});
};

//# sourceMappingURL=binana.interactions._salt_bridges.map
// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2020 Jacob D. Durrant.

// Transcrypt'ed from Python, 2021-11-23 00:01:21
var binana = {};
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {OpenFile as _openFile} from './binana._utils.shim.js';
import * as _json from './binana._utils.shim.js';
import * as __module_binana__ from './binana.js';
__nest__ (binana, '', __module_binana__);
import * as pdb_file from './binana.output.pdb_file.js';
import * as _log from './binana.output._log.js';
import * as csv from './binana.output.csv.js';
import * as dictionary from './binana.output.dictionary.js';
import * as _directory from './binana.output._directory.js';
export {_directory, pdb_file, dictionary, _openFile, _log, csv, _json};
var __name__ = 'binana.output';
export var _write_main = function (parameters, ligand, receptor, closest, close, hydrophobics, hydrogen_bonds, halogen_bonds, salt_bridges, metal_coordinations, pi_pi, cat_pi, electrostatic_energies, active_site_flexibility, ligand_atom_types) {
	var json_output = binana.output.dictionary.collect (closest, close, hydrophobics, hydrogen_bonds, halogen_bonds, salt_bridges, metal_coordinations, pi_pi, cat_pi, electrostatic_energies, active_site_flexibility, ligand_atom_types, __kwargtrans__ ({ligand_rotatable_bonds: ligand.rotatable_bonds_count}));
	var log_output = binana.output._log.collect (parameters, ligand, closest, close, hydrophobics, hydrogen_bonds, halogen_bonds, salt_bridges, metal_coordinations, pi_pi, cat_pi, electrostatic_energies, active_site_flexibility, ligand_atom_types, json_output);
	if (parameters.params ['output_csv'] != '') {
		var csv_txt = csv.collect (json_output);
		var f = _openFile (parameters.params ['output_csv'], 'w');
		f.write (csv_txt);
		f.close ();
	}
	if (parameters.params ['output_json'] != '') {
		var f = _openFile (parameters.params ['output_json'], 'w');
		f.write (_json.dumps (json_output, __kwargtrans__ ({indent: 2, sort_keys: true, separators: tuple ([',', ': '])})));
		f.close ();
	}
	if (parameters.params ['output_file'] != '') {
		binana.output.pdb_file.write (ligand, receptor, closest, close, hydrophobics, hydrogen_bonds, halogen_bonds, salt_bridges, metal_coordinations, pi_pi, cat_pi, active_site_flexibility, log_output, false, parameters.params ['output_file']);
	}
	if (parameters.params ['output_dir'] != '') {
		_directory.make_directory_output (parameters, closest, close, active_site_flexibility, hydrophobics, hydrogen_bonds, halogen_bonds, pi_pi, cat_pi, salt_bridges, metal_coordinations, ligand, receptor);
	}
};

//# sourceMappingURL=binana.output.map
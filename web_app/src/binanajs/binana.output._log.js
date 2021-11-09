// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2020 Jacob D. Durrant.

// Transcrypt'ed from Python, 2021-11-09 00:25:34
var binana = {};
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import * as json from './binana._utils.shim.js';
import {OpenFile} from './binana._utils.shim.js';
import * as __module_binana__ from './binana.js';
__nest__ (binana, '', __module_binana__);
var __name__ = 'binana.output._log';
export var preface = 'REMARK ';
export var openFile = OpenFile;
export var _center = function (string, length) {
	while (len (string) < length) {
		var string = ' ' + string;
		if (len (string) < length) {
			var string = string + ' ';
		}
	}
	return string;
};
export var _get_parameters = function (parameters, output) {
	var output = ((output + preface) + 'Command-line parameters used:') + '\n';
	var output = ((output + preface) + '                 Parameter              |            Value           ') + '\n';
	var output = ((output + preface) + '   -------------------------------------|----------------------------') + '\n';
	for (var key of sorted (list (parameters.params.py_keys ()))) {
		var value = str (parameters.params [key]);
		var output = (((((output + preface) + '   ') + _center (key, 37)) + '| ') + _center (value, 27)) + '\n';
	}
	return output;
};
export var _get_close_contacts_dist1_cutoff = function (parameters, closest, output) {
	var output = (output + preface) + '\n';
	var output = ((((output + preface) + 'Atom-type pair counts within ') + str (parameters.params ['close_contacts_dist1_cutoff'])) + ' angstroms:') + '\n';
	var output = ((output + preface) + '    Atom Type | Atom Type | Count') + '\n';
	var output = ((output + preface) + '   -----------|-----------|-------') + '\n';
	for (var key of sorted (closest ['counts'].py_keys ())) {
		var value = closest ['counts'] [key];
		var key = key.py_split ('_');
		var output = (((((((output + preface) + '   ') + _center (key [0], 11)) + '|') + _center (key [1], 11)) + '|') + _center (str (value), 7)) + '\n';
	}
	var output = (((output + preface) + '\n') + preface) + 'Raw data:\n';
	for (var atom_pairs of closest ['labels']) {
		var output = (((((output + preface) + '     ') + atom_pairs [0]) + ' - ') + atom_pairs [1]) + '\n';
	}
	return output;
};
export var _get_close_contacts_dist2_cutoff = function (parameters, close, output) {
	var output = (output + preface) + '\n';
	var output = ((((output + preface) + 'Atom-type pair counts within ') + str (parameters.params ['close_contacts_dist2_cutoff'])) + ' angstroms:') + '\n';
	var output = ((output + preface) + '    Atom Type | Atom Type | Count') + '\n';
	var output = ((output + preface) + '   -----------|-----------|-------') + '\n';
	for (var key of sorted (close ['counts'].py_keys ())) {
		var value = close ['counts'] [key];
		var key = key.py_split ('_');
		var output = (((((((output + preface) + '   ') + _center (key [0], 11)) + '|') + _center (key [1], 11)) + '|') + _center (str (value), 7)) + '\n';
	}
	var output = (((output + preface) + '\n') + preface) + 'Raw data:\n';
	for (var atom_pairs of close ['labels']) {
		var output = (((((output + preface) + '     ') + atom_pairs [0]) + ' - ') + atom_pairs [1]) + '\n';
	}
	return output;
};
export var _get_ligand_atom_types = function (ligand_atom_types, electrostatic_energies, output) {
	var output = ((output + preface) + '') + '\n';
	var output = ((output + preface) + 'Ligand atom types:') + '\n';
	var output = ((output + preface) + '    Atom Type ') + '\n';
	var output = ((output + preface) + '   -----------') + '\n';
	for (var key of sorted (ligand_atom_types.py_keys ())) {
		var output = (((output + preface) + '   ') + _center (key, 11)) + '\n';
	}
	var output = ((output + preface) + '') + '\n';
	var output = ((output + preface) + 'Summed electrostatic energy by atom-type pair, in J/mol:') + '\n';
	var output = ((output + preface) + '    Atom Type | Atom Type | Energy (J/mol)') + '\n';
	var output = ((output + preface) + '   -----------|-----------|----------------') + '\n';
	for (var key of sorted (electrostatic_energies ['counts'].py_keys ())) {
		var value = electrostatic_energies ['counts'] [key];
		var key = key.py_split ('_');
		var value2 = (value > 0 ? str (value).__getslice__ (0, 13, 1) : str (value).__getslice__ (0, 14, 1));
		var num_decimals = len (value2.py_split ('.') [1]);
		var value3 = round (value, num_decimals);
		var value4 = (value3 > 0 ? str (value3).__getslice__ (0, 13, 1) : str (value3).__getslice__ (0, 14, 1));
		var output = (((((((output + preface) + '   ') + _center (key [0], 11)) + '|') + _center (key [1], 11)) + '|') + _center (value4, 16)) + '\n';
	}
	return output;
};
export var _get_rotateable_bonds_count = function (ligand, output) {
	var output = ((output + preface) + '') + '\n';
	var output = (((output + preface) + 'Number of rotatable bonds in the ligand: ') + str (ligand.rotatable_bonds_count)) + '\n';
	return output;
};
export var _get_active_site_flexibility = function (active_site_flexibility, output) {
	var output = ((output + preface) + '') + '\n';
	var output = ((output + preface) + 'Active-site flexibility:') + '\n';
	var output = ((output + preface) + '    Sidechain/Backbone | Secondary Structure | Count ') + '\n';
	var output = ((output + preface) + '   --------------------|---------------------|-------') + '\n';
	for (var key of sorted (active_site_flexibility ['counts'].py_keys ())) {
		var value = active_site_flexibility ['counts'] [key];
		var key = key.py_split ('_');
		var output = (((((((output + preface) + '   ') + _center (key [0], 20)) + '|') + _center (key [1], 21)) + '|') + _center (str (value), 7)) + '\n';
	}
	return output;
};
export var _get_hbonds = function (hbonds, output, hydrogen_bond) {
	if (typeof hydrogen_bond == 'undefined' || (hydrogen_bond != null && hydrogen_bond.hasOwnProperty ("__kwargtrans__"))) {;
		var hydrogen_bond = true;
	};
	var py_name = (hydrogen_bond ? 'Hydrogen' : 'Halogen');
	var output = ((output + preface) + '') + '\n';
	var output = (((output + preface) + py_name) + ' bonds:') + '\n';
	var output = ((output + preface) + '    Location of Donor | Sidechain/Backbone | Secondary Structure | Count ') + '\n';
	var output = ((output + preface) + '   -------------------|--------------------|---------------------|-------') + '\n';
	for (var key of sorted (hbonds ['counts'].py_keys ())) {
		var value = hbonds ['counts'] [key];
		var key = key.py_split ('_');
		var output = (((((((((output + preface) + '   ') + _center (key [1], 19)) + '|') + _center (key [2], 20)) + '|') + _center (key [3], 21)) + '|') + _center (str (value), 7)) + '\n';
	}
	var output = (((output + preface) + '\n') + preface) + 'Raw data:\n';
	for (var atom_pairs of hbonds ['labels']) {
		var output = (((((((output + preface) + '     ') + atom_pairs [0]) + ' - ') + atom_pairs [1]) + ' - ') + atom_pairs [2]) + '\n';
	}
	return output;
};
export var _get_hydrophobics = function (hydrophobics, output) {
	var output = ((output + preface) + '') + '\n';
	var output = ((output + preface) + 'Hydrophobic contacts (C-C):') + '\n';
	var output = ((output + preface) + '    Sidechain/Backbone | Secondary Structure | Count ') + '\n';
	var output = ((output + preface) + '   --------------------|---------------------|-------') + '\n';
	for (var key of sorted (hydrophobics ['counts'].py_keys ())) {
		var value = hydrophobics ['counts'] [key];
		var key = key.py_split ('_');
		var output = (((((((output + preface) + '   ') + _center (key [0], 20)) + '|') + _center (key [1], 21)) + '|') + _center (str (value), 7)) + '\n';
	}
	var output = (((output + preface) + '\n') + preface) + 'Raw data:\n';
	for (var atom_pairs of hydrophobics ['labels']) {
		var output = (((((output + preface) + '     ') + atom_pairs [0]) + ' - ') + atom_pairs [1]) + '\n';
	}
	return output;
};
export var _get_pi_stacking = function (pi_pi, output) {
	var stacking = [];
	for (var key of sorted (pi_pi ['counts'].py_keys ())) {
		var value = pi_pi ['counts'] [key];
		var together = (key + '_') + str (value);
		if (__in__ ('STACKING', together)) {
			stacking.append (together);
		}
	}
	var output = ((output + preface) + '') + '\n';
	var output = ((output + preface) + 'pi-pi stacking interactions:') + '\n';
	var output = ((output + preface) + '    Secondary Structure | Count ') + '\n';
	var output = ((output + preface) + '   ---------------------|-------') + '\n';
	for (var item of stacking) {
		var item = item.py_split ('_');
		var output = (((((output + preface) + '   ') + _center (item [1], 21)) + '|') + _center (item [2], 7)) + '\n';
	}
	var output = (((output + preface) + '\n') + preface) + 'Raw data:\n';
	for (var atom_pairs of pi_pi ['labels'] ['pi_stacking']) {
		var output = (((((output + preface) + '     ') + atom_pairs [0]) + ' - ') + atom_pairs [1]) + '\n';
	}
	return output;
};
export var _get_t_stacking = function (pi_pi, output) {
	var t_shaped = [];
	for (var key of sorted (pi_pi ['counts'].py_keys ())) {
		var value = pi_pi ['counts'] [key];
		var together = (key + '_') + str (value);
		if (__in__ ('SHAPED', together)) {
			t_shaped.append (together);
		}
	}
	var output = ((output + preface) + '') + '\n';
	var output = ((output + preface) + 'T-stacking (face-to-edge) interactions:') + '\n';
	var output = ((output + preface) + '    Secondary Structure | Count ') + '\n';
	var output = ((output + preface) + '   ---------------------|-------') + '\n';
	for (var item of t_shaped) {
		var item = item.py_split ('_');
		var output = (((((output + preface) + '   ') + _center (item [1], 21)) + '|') + _center (item [2], 7)) + '\n';
	}
	var output = (((output + preface) + '\n') + preface) + 'Raw data:\n';
	for (var atom_pairs of pi_pi ['labels'] ['T_stacking']) {
		var output = (((((output + preface) + '     ') + atom_pairs [0]) + ' - ') + atom_pairs [1]) + '\n';
	}
	return output;
};
export var _get_pi_cation = function (pi_pi, cat_pi, output) {
	var pi_cation = [];
	for (var key of sorted (pi_pi ['counts'].py_keys ())) {
		var value = pi_pi ['counts'] [key];
		var together = (key + '_') + str (value);
		if (__in__ ('CATION', together)) {
			pi_cation.append (together);
		}
	}
	var output = ((output + preface) + '') + '\n';
	var output = ((output + preface) + 'Cation-pi interactions:') + '\n';
	var output = ((output + preface) + '    Which residue is charged? | Secondary Structure | Count ') + '\n';
	var output = ((output + preface) + '   ---------------------------|---------------------|-------') + '\n';
	for (var item of pi_cation) {
		var item = item.py_split ('_');
		var item2 = item [1].py_split ('-');
		var output = (((((((output + preface) + '   ') + _center (item2 [0], 27)) + '|') + _center (item [2], 21)) + '|') + _center (item [3], 7)) + '\n';
	}
	var output = (((output + preface) + '\n') + preface) + 'Raw data:\n';
	for (var atom_pairs of cat_pi ['labels']) {
		var output = (((((output + preface) + '     ') + atom_pairs [0]) + ' - ') + atom_pairs [1]) + '\n';
	}
	return output;
};
export var _get_salt_bridges = function (salt_bridges, output) {
	var output = ((output + preface) + '') + '\n';
	var output = ((output + preface) + 'Salt Bridges:') + '\n';
	var output = ((output + preface) + '    Secondary Structure | Count ') + '\n';
	var output = ((output + preface) + '   ---------------------|-------') + '\n';
	for (var key of sorted (salt_bridges ['counts'].py_keys ())) {
		var value = salt_bridges ['counts'] [key];
		var key = key.py_split ('_');
		var output = (((((output + preface) + '   ') + _center (key [1], 21)) + '|') + _center (str (value), 7)) + '\n';
	}
	var output = (((output + preface) + '\n') + preface) + 'Raw data:\n';
	for (var atom_pairs of salt_bridges ['labels']) {
		var output = (((((output + preface) + '     ') + atom_pairs [0]) + ' - ') + atom_pairs [1]) + '\n';
	}
	return output;
};
export var collect = function (parameters, ligand, closest, close, hydrophobics, hydrogen_bonds, halogen_bonds, salt_bridges, pi_pi, cat_pi, electrostatic_energies, active_site_flexibility, ligand_atom_types, json_output) {
	var output = '';
	var output = _get_parameters (parameters, output);
	var output = _get_close_contacts_dist1_cutoff (parameters, closest, output);
	var output = _get_close_contacts_dist2_cutoff (parameters, close, output);
	var output = _get_ligand_atom_types (ligand_atom_types ['counts'], electrostatic_energies, output);
	var output = _get_rotateable_bonds_count (ligand, output);
	var output = _get_active_site_flexibility (active_site_flexibility, output);
	var output = _get_hbonds (hydrogen_bonds, output, true);
	var output = _get_hbonds (hydrogen_bonds, output, false);
	var output = _get_hydrophobics (hydrophobics, output);
	var output = _get_pi_stacking (pi_pi, output);
	var output = _get_t_stacking (pi_pi, output);
	var output = _get_pi_cation (pi_pi, cat_pi, output);
	var output = _get_salt_bridges (salt_bridges, output);
	var output = (output + preface) + '\n';
	var output = (output + preface) + 'JSON Output:\n';
	var output = (output + preface) + '\n';
	var output = (output + preface) + '\n';
	var output = ((output + preface) + json.dumps (json_output, __kwargtrans__ ({indent: 2, sort_keys: true, separators: tuple ([',', ': '])})).py_replace ('\n', '\n' + preface)) + '\n';
	if (parameters.params ['output_dir'] != '') {
		var f = openFile (parameters.params ['output_dir'] + 'log.txt', 'w');
		f.write (output.py_replace ('REMARK ', ''));
		f.close ();
	}
	if (parameters.params ['output_file'] == '' && parameters.params ['output_dir'] == '') {
		var to_print = output.py_replace ('REMARK ', '');
		print (to_print.py_split ('JSON Output:') [0].strip ());
	}
	return output;
};

//# sourceMappingURL=binana.output._log.map
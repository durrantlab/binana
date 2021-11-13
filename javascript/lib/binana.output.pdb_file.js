// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2020 Jacob D. Durrant.

// Transcrypt'ed from Python, 2021-11-12 01:16:46
var binana = {};
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {OpenFile} from './binana._utils.shim.js';
import {wrap as _wrap} from './binana._utils.shim.js';
import * as __module_binana__utils__ from './binana._utils.js';
__nest__ (binana, '_utils', __module_binana__utils__);
import * as __module_binana__ from './binana.js';
__nest__ (binana, '', __module_binana__);
import {_set_default} from './binana._utils.shim.js';
var __name__ = 'binana.output.pdb_file';
export var _openFile = OpenFile;
export var write = function (ligand, receptor, closest, close, hydrophobics, hydrogen_bonds, halogen_bonds, salt_bridges, pi_pi, cat_pi, active_site_flexibility, log_output, as_str, pdb_filename) {
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
	if (typeof halogen_bonds == 'undefined' || (halogen_bonds != null && halogen_bonds.hasOwnProperty ("__kwargtrans__"))) {;
		var halogen_bonds = null;
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
	if (typeof active_site_flexibility == 'undefined' || (active_site_flexibility != null && active_site_flexibility.hasOwnProperty ("__kwargtrans__"))) {;
		var active_site_flexibility = null;
	};
	if (typeof log_output == 'undefined' || (log_output != null && log_output.hasOwnProperty ("__kwargtrans__"))) {;
		var log_output = null;
	};
	if (typeof as_str == 'undefined' || (as_str != null && as_str.hasOwnProperty ("__kwargtrans__"))) {;
		var as_str = null;
	};
	if (typeof pdb_filename == 'undefined' || (pdb_filename != null && pdb_filename.hasOwnProperty ("__kwargtrans__"))) {;
		var pdb_filename = null;
	};
	var log_output = _set_default (log_output, '');
	var as_str = _set_default (as_str, false);
	var pdb_filename = _set_default (pdb_filename, 'results.pdb');
	var explain = (((((('The residue named "CCN" contains the closest contacts between the protein and receptor. ' + '"CON" indicates close contacts. ') + '"ALP", "BET", and "OTH" indicate receptor contacts whose respective protein residues have the alpha-helix, beta-sheet, or "other" secondary structure. ') + '"BAC" and "SID" indicate receptor contacts that are part of the protein backbone and sidechain, respectively. ') + '"HYD" indicates hydrophobic contacts between the protein and ligand. ') + '"HBN" indicates hydrogen bonds. "HAL" indicates halogen bonds. "SAL" indicates salt bridges. ') + '"PIS" indicates pi-pi stacking interactions, "PIT" indicates T-stacking interactions, and "PIC" indicates cation-pi interactions. ') + 'Protein residue names are unchanged, but the ligand residue is now named "LIG".';
	var log_output = log_output + 'REMARK\n';
	var lines = _wrap (explain, 71);
	for (var line of lines) {
		var log_output = ((log_output + 'REMARK ') + line) + '\n';
	}
	var log_output = log_output + 'REMARK\n';
	ligand.set_resname ('LIG');
	var log_output = (((log_output + receptor.save_pdb_string ()) + 'TER\n') + ligand.save_pdb_string ()) + 'TER\n';
	if (closest !== null) {
		closest ['mol'].set_resname ('CCN');
		var log_output = (log_output + closest ['mol'].save_pdb_string ()) + 'TER\n';
	}
	if (close !== null) {
		close ['mol'].set_resname ('CON');
		var log_output = (log_output + close ['mol'].save_pdb_string ()) + 'TER\n';
	}
	if (active_site_flexibility !== null) {
		active_site_flexibility ['mols'] ['alpha_helix'].set_resname ('ALP');
		active_site_flexibility ['mols'] ['beta_sheet'].set_resname ('BET');
		active_site_flexibility ['mols'] ['other_2nd_structure'].set_resname ('OTH');
		active_site_flexibility ['mols'] ['back_bone'].set_resname ('BAC');
		active_site_flexibility ['mols'] ['side_chain'].set_resname ('SID');
		var log_output = (((((((((log_output + active_site_flexibility ['mols'] ['alpha_helix'].save_pdb_string ()) + 'TER\n') + active_site_flexibility ['mols'] ['beta_sheet'].save_pdb_string ()) + 'TER\n') + active_site_flexibility ['mols'] ['other_2nd_structure'].save_pdb_string ()) + 'TER\n') + active_site_flexibility ['mols'] ['back_bone'].save_pdb_string ()) + 'TER\n') + active_site_flexibility ['mols'] ['side_chain'].save_pdb_string ()) + 'TER\n';
	}
	if (hydrophobics !== null) {
		hydrophobics ['mol'].set_resname ('HYD');
		var log_output = (log_output + hydrophobics ['mol'].save_pdb_string ()) + 'TER\n';
	}
	if (hydrogen_bonds !== null) {
		hydrogen_bonds ['mol'].set_resname ('HBN');
		var log_output = (log_output + hydrogen_bonds ['mol'].save_pdb_string ()) + 'TER\n';
	}
	if (halogen_bonds !== null) {
		halogen_bonds ['mol'].set_resname ('HAL');
		var log_output = (log_output + halogen_bonds ['mol'].save_pdb_string ()) + 'TER\n';
	}
	if (pi_pi !== null) {
		pi_pi ['mols'] ['pi_stacking'].set_resname ('PIS');
		pi_pi ['mols'] ['T_stacking'].set_resname ('PIT');
		var log_output = (((log_output + pi_pi ['mols'] ['pi_stacking'].save_pdb_string ()) + 'TER\n') + pi_pi ['mols'] ['T_stacking'].save_pdb_string ()) + 'TER\n';
	}
	if (cat_pi !== null) {
		cat_pi ['mol'].set_resname ('PIC');
		var log_output = (log_output + cat_pi ['mol'].save_pdb_string ()) + 'TER\n';
	}
	if (salt_bridges !== null) {
		salt_bridges ['mol'].set_resname ('SAL');
		var log_output = (log_output + salt_bridges ['mol'].save_pdb_string ()) + 'TER\n';
	}
	if (as_str) {
		return log_output;
	}
	var f = _openFile (pdb_filename, 'w');
	f.write (log_output);
	f.close ();
	return '';
};
export var write_all = function (ligand, receptor, all_interactions, log_output, as_str, pdb_filename) {
	if (typeof log_output == 'undefined' || (log_output != null && log_output.hasOwnProperty ("__kwargtrans__"))) {;
		var log_output = null;
	};
	if (typeof as_str == 'undefined' || (as_str != null && as_str.hasOwnProperty ("__kwargtrans__"))) {;
		var as_str = null;
	};
	if (typeof pdb_filename == 'undefined' || (pdb_filename != null && pdb_filename.hasOwnProperty ("__kwargtrans__"))) {;
		var pdb_filename = null;
	};
	var log_output = _set_default (log_output, '');
	var as_str = _set_default (as_str, false);
	var pdb_filename = _set_default (pdb_filename, 'results.pdb');
	return write (ligand, receptor, all_interactions ['closest'], all_interactions ['close'], all_interactions ['hydrophobics'], all_interactions ['hydrogen_bonds'], all_interactions ['salt_bridges'], all_interactions ['pi_pi'], all_interactions ['cat_pi'], all_interactions ['active_site_flexibility'], log_output, as_str, pdb_filename);
};

//# sourceMappingURL=binana.output.pdb_file.map
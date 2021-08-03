// Transcrypt'ed from Python, 2021-08-01 02:57:41
var binana = {};
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import * as __module_binana__ from './binana.js';
__nest__ (binana, '', __module_binana__);
import * as vmd_state from './binana.output._directory.vmd_state.js';
import * as pdbs from './binana.output._directory.pdbs.js';
export {pdbs, vmd_state};
var __name__ = 'binana.output._directory';
export var os = binana.os;
export var make_directory_output = function (parameters, closest, close, active_site_flexibility, hydrophobics, hydrogen_bonds, pi_pi, cat_pi, salt_bridges, ligand, receptor) {
	if (!(os.path.exists (parameters.params ['output_dir']))) {
		os.mkdir (parameters.params ['output_dir']);
	}
	binana.output._directory.pdbs.output_dir_pdbs (closest ['mol'], parameters, close ['mol'], active_site_flexibility ['mols'] ['alpha_helix'], active_site_flexibility ['mols'] ['beta_sheet'], active_site_flexibility ['mols'] ['other_2nd_structure'], active_site_flexibility ['mols'] ['back_bone'], active_site_flexibility ['mols'] ['side_chain'], hydrophobics ['mol'], hydrogen_bonds ['mol'], pi_pi ['mols'] ['pi_stacking'], pi_pi ['mols'] ['T_stacking'], cat_pi ['mol'], salt_bridges ['mol'], ligand, receptor);
	binana.output._directory.vmd_state.vmd_state_file (parameters);
};

//# sourceMappingURL=binana.output._directory.map
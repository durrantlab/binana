// This file is part of BINANA, released under the Apache 2.0 License. See
// LICENSE.md or go to https://opensource.org/licenses/Apache-2.0 for full
// details. Copyright 2020 Jacob D. Durrant.

// Transcrypt'ed from Python, 2021-11-20 02:43:22
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
var __name__ = 'binana.output.csv';
export var _sanitize = function (s) {
	return s.py_replace (',', '-').py_replace ('"', '-');
};
export var _recurse = function (pre_commas, data, csv) {
	var py_keys = list (data.py_keys ());
	py_keys.py_sort ();
	for (var key of py_keys) {
		var key = _sanitize (key);
		var val = data [key];
		csv += pre_commas + key;
		try {
			var single_types = [int, float, str, unicode];
		}
		catch (__except0__) {
			var single_types = [int, float, str];
		}
		if (__in__ (py_typeof (val), single_types)) {
			csv += (',' + _sanitize (str (val))) + '\n';
		}
		else if (py_typeof (val) === list) {
			if (len (val) == 0) {
				csv += ',none\n';
			}
			else if (py_typeof (val [0]) === dict) {
				for (var [i, item] of enumerate (val)) {
					csv += '\n';
					if (len (val) > 1) {
						csv += ((((pre_commas + ',') + key) + '.') + str (i + 1)) + '\n';
						var csv = _recurse (pre_commas + ',,', item, csv);
					}
					else {
						var csv = _recurse (pre_commas + ',', item, csv);
					}
				}
			}
			else {
				csv += '\n';
			}
		}
		else if (py_typeof (val) === dict) {
			csv += '\n';
			var csv = _recurse (pre_commas + ',', val, csv);
		}
	}
	return csv;
};
export var collect = function (data) {
	var csv = _recurse ('', data, '');
	while (__in__ ('\n\n', csv)) {
		var csv = csv.py_replace ('\n\n', '\n');
	}
	return csv;
};

//# sourceMappingURL=binana.output.csv.map
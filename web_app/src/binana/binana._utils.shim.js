// Transcrypt'ed from Python, 2021-08-01 02:57:38
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
var __name__ = 'binana._utils.shim';
export var fake_fs = dict ({});
export var argv = [];
export var sep = '/';
export var mkdir = function (d) {
	return ;
};
export var Path =  __class__ ('Path', [object], {
	__module__: __name__,
	get exists () {return __get__ (this, function (self, d) {
		return true;
	});}
});
export var path = Path ();
export var exit = function (n) {
	return ;
};
export var wrap = function (s, _) {
	return [s];
};
export var fabs = function (n) {
	if (n < 0) {
		return -(n);
	}
	return n;
};
export var dump = function (data, open_file) {
	open_file.write (data, true);
};
export var dumps = function (data, indent) {
	if (typeof indent == 'undefined' || (indent != null && indent.hasOwnProperty ("__kwargtrans__"))) {;
		var indent = 2;
	};
	let data_str = JSON.stringify(data, null, indent);
	return data_str;
};
export var r_just = function (s, c) {
	while (len (s) < c) {
		var s = ' ' + s;
	}
	return s;
};
export var dirname = function (path) {
	return '/'.join (path.py_split ('/').__getslice__ (0, -(1), 1));
};
export var basename = function (path) {
	var splt = path.py_split ('/');
	return splt [len (splt) - 1];
};
var sep = '/';
export var OpenFile =  __class__ ('OpenFile', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, flnm, mode) {
		if (typeof mode == 'undefined' || (mode != null && mode.hasOwnProperty ("__kwargtrans__"))) {;
			var mode = 'r';
		};
		self.flnm = flnm;
		self.mode = mode;
		if (mode == 'w') {
			fake_fs [flnm] = '';
		}
	});},
	get write () {return __get__ (this, function (self, s, js) {
		if (typeof js == 'undefined' || (js != null && js.hasOwnProperty ("__kwargtrans__"))) {;
			var js = false;
		};
		if (js) {
			fake_fs [self.flnm] = s;
		}
		else {
			fake_fs [self.flnm] += s;
		}
	});},
	get read () {return __get__ (this, function (self) {
		return fake_fs [self.flnm];
	});},
	get readlines () {return __get__ (this, function (self) {
		return (function () {
			var __accu0__ = [];
			for (var l of fake_fs [self.flnm].py_split ('\n')) {
				__accu0__.append (l + '\n');
			}
			return __accu0__;
		}) ();
	});},
	get close () {return __get__ (this, function (self) {
		return ;
	});}
});

//# sourceMappingURL=binana._utils.shim.map
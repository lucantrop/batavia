var PyObject = require('../core').Object;
var Type = require('../core').Type;
var exceptions = require('../core').exceptions;
var callables = require('../core').callables;
var type_name = require('../core').type_name;

/*************************************************************************
 * A Python map builtin is a type
 *************************************************************************/

function map(args, kwargs) {
    PyObject.call(this);

    if (args.length < 2) {
        throw new exceptions.TypeError("map expected 2 arguments, got " + args.length);
    }
    this._func = args[0];
    this._sequence = args[1];
}

map.prototype = Object.create(PyObject.prototype);
map.prototype.__class__ = new Type('map');
map.prototype.constructor = map;

/**************************************************
 * Javascript compatibility methods
 **************************************************/

map.prototype.toString = function() {
    return this.__str__();
};

/**************************************************
 * Type conversions
 **************************************************/

map.prototype.__iter__ = function() {
    return this;
};

map.prototype.__next__ = function() {
    var builtins = require('../builtins');

    if (!this._iter) {
        this._iter = builtins.iter([this._sequence], null);
    }
    if (!builtins.callable([this._func], null)) {
        throw new exceptions.TypeError(
            type_name(this._func) + "' object is not callable");
    }

    var sval = callables.run_callable(this._iter, this._iter.__next__, [], null);
    return callables.run_callable(false, this._func, [sval], null);
};

map.prototype.__str__ = function() {
    return "<map object at 0x99999999>";
};

/**************************************************
 * Module exports
 **************************************************/

module.exports = map;

var PyObject = require('../core').Object;
var Type = require('../core').Type;
var exceptions = require('../core').exceptions;
var callables = require('../core').callables;
var type_name = require('../core').type_name;

/*************************************************************************
 * A Python Set type, with an underlying Dict.
 *************************************************************************/

function Set(args, kwargs) {
    var types = require('../types');

    PyObject.call(this);

    this.data = new types.Dict();
    if (args) {
        this.update(args);
    }
}

Set.prototype = Object.create(PyObject.prototype);
Set.prototype.__class__ = new Type('set');
Set.prototype.constructor = Set;

/**************************************************
 * Javascript compatibility methods
 **************************************************/

Set.prototype.toString = function() {
    return this.__str__();
}

/**************************************************
 * Type conversions
 **************************************************/

Set.prototype.__bool__ = function() {
    return this.data.__bool__();
}

Set.prototype.__iter__ = function() {
    var types = require('../types');
    return new types.SetIterator(this);
}

Set.prototype.__repr__ = function() {
    return this.__str__();
}

Set.prototype.__str__ = function() {
    var keys = this.data.keys();
    if (keys.length == 0) {
        return "set()";
    }
    return "{" + keys.map(function(x) { return x.__repr__(); }).join(", ") + "}";
}

/**************************************************
 * Comparison operators
 **************************************************/

Set.prototype.__lt__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, [types.Set, types.FrozenSet])) {
        return new types.Bool(this.data.keys().length < other.data.keys().length);
    }
    throw new exceptions.TypeError("unorderable types: set() < " + type_name(other) + "()");
}

Set.prototype.__le__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, [types.Set, types.FrozenSet])) {
        return new types.Bool(this.data.keys().length <= other.data.keys().length);
    }
    throw new exceptions.TypeError("unorderable types: set() <= " + type_name(other) + "()");
}

Set.prototype.__eq__ = function(other) {
    var types = require('../types');
    var builtins = require('../builtins');

    if (!types.isinstance(other, [types.FrozenSet, types.Set])) {
        return new types.Bool(false);
    }
    if (this.data.keys().length != other.data.keys().length) {
        return new types.Bool(false);
    }
    var iterobj = builtins.iter([this], null);
    var equal = true;
    callables.iter_for_each(iterobj, function(val) {
        equal = equal && other.__contains__(val).valueOf();
    });

    return new types.Bool(equal);
}

Set.prototype.__ne__ = function(other) {
    return this.__eq__(other).__not__();
}

Set.prototype.__gt__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, [types.Set, types.FrozenSet])) {
        return new types.Bool(this.data.keys().length > other.data.keys().length);
    }
    throw new exceptions.TypeError("unorderable types: set() > " + type_name(other) + "()");
}

Set.prototype.__ge__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, [types.Set, types.FrozenSet])) {
        return new types.Bool(this.data.keys().length >= other.data.keys().length);
    }
    throw new exceptions.TypeError("unorderable types: set() >= " + type_name(other) + "()");
}

Set.prototype.__contains__ = function(other) {
    return this.data.__contains__(other);
}


/**************************************************
 * Unary operators
 **************************************************/

Set.prototype.__not__ = function() {
    return this.__bool__().__not__();
}

/**************************************************
 * Binary operators
 **************************************************/

Set.prototype.__pow__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for ** or pow(): 'set' and '" + type_name(other) + "'");
}

Set.prototype.__div__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for /: 'set' and '" + type_name(other) + "'");
}

Set.prototype.__floordiv__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, types.Complex)) {
        throw new exceptions.TypeError("can't take floor of complex number.")
    } else {
        throw new exceptions.TypeError("unsupported operand type(s) for //: 'set' and '" + type_name(other) + "'");
    }
}

Set.prototype.__truediv__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for /: 'set' and '" + type_name(other) + "'");
}

Set.prototype.__mul__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, [
        types.Bytearray, types.Bytes, types.List,
        types.Str, types.Tuple
    ])) {
        throw new exceptions.TypeError("can't multiply sequence by non-int of type 'set'");
    } else {
        throw new exceptions.TypeError("unsupported operand type(s) for *: 'set' and '" + type_name(other) + "'");
    }
}

Set.prototype.__mod__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, types.Complex)){
        throw new exceptions.TypeError("can't mod complex numbers.")
    } else {
        throw new exceptions.TypeError("unsupported operand type(s) for %: 'set' and '" + type_name(other) + "'");
    }
}

Set.prototype.__add__ = function(other) {
	throw new exceptions.TypeError("unsupported operand type(s) for +: 'set' and '" + type_name(other) + "'");
}

Set.prototype.__sub__ = function(other) {
    var types = require('../types');
    var builtins = require('../builtins');

    if (types.isinstance(other, [types.FrozenSet, types.Set])){
        var both = [];
        var iterobj1 = builtins.iter([this], null);
        callables.iter_for_each(iterobj1, function(val) {
            if (!(other.__contains__(val).valueOf())) {
                both.push(val);
            }
        });
        return new Set(both);
    }
    throw new exceptions.TypeError("unsupported operand type(s) for -: 'set' and '" + type_name(other) + "'");
}

Set.prototype.__getitem__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, [types.Bool])){
        throw new exceptions.TypeError("'set' object does not support indexing");
    } else if (types.isinstance(other, [types.Int])){
        if (other.val.gt(types.Int.prototype.MAX_INT.val) || other.val.lt(types.Int.prototype.MIN_INT.val)) {
            throw new exceptions.IndexError("cannot fit 'int' into an index-sized integer");
        } else {
            throw new exceptions.TypeError("'set' object does not support indexing");
        }
    }
    throw new exceptions.TypeError("'set' object is not subscriptable");
}

Set.prototype.__lshift__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for <<: 'set' and '" + type_name(other) + "'");
}

Set.prototype.__rshift__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for >>: 'set' and '" + type_name(other) + "'");
}

Set.prototype.__and__ = function(other) {
    var types = require('../types');
    var builtins = require('../builtins');

    if (types.isinstance(other, [types.FrozenSet, types.Set])){
        var both = [];
        var iterobj = builtins.iter([this], null);
        callables.iter_for_each(iterobj, function(val) {
            if (other.__contains__(val).valueOf()) {
                both.push(val);
            }
        });
        return new Set(both);
    }
    throw new exceptions.TypeError("unsupported operand type(s) for &: 'set' and '" + type_name(other) + "'");
}

Set.prototype.__xor__ = function(other) {
    var types = require('../types');
    var builtins = require('../builtins');

    if (types.isinstance(other, [types.FrozenSet, types.Set])){
        var both = [];
        var iterobj1 = builtins.iter([this], null);
        callables.iter_for_each(iterobj1, function(val) {
            if (!(other.__contains__(val).valueOf())) {
                both.push(val);
            }
        });
        var iterobj2 = builtins.iter([other], null);
        callables.iter_for_each(iterobj2, function(val) {
            if (!(this.__contains__(val).valueOf())) {
                both.push(val);
            }
        }.bind(this));
        return new Set(both);
    }
    throw new exceptions.TypeError("unsupported operand type(s) for ^: 'set' and '" + type_name(other) + "'");
}

Set.prototype.__or__ = function(other) {
    var types = require('../types');
    var builtins = require('../builtins');

    if (types.isinstance(other, [types.FrozenSet, types.Set])){
        var both = [];
        var iterobj1 = builtins.iter([this], null);
        callables.iter_for_each(iterobj1, function(val) {
            both.push(val);
        });
        var iterobj2 = builtins.iter([other], null);
        callables.iter_for_each(iterobj2, function(val) {
            both.push(val);
        }.bind(this));
        return new Set(both);
    }
    throw new exceptions.TypeError("unsupported operand type(s) for |: 'set' and '" + type_name(other) + "'");
}

/**************************************************
 * Inplace operators
 **************************************************/

Set.prototype.__ifloordiv__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, types.Complex)) {
        throw new exceptions.TypeError("can't take floor of complex number.")
    } else {
        throw new exceptions.TypeError("unsupported operand type(s) for //=: 'set' and '" + type_name(other) + "'");
    }
}

Set.prototype.__itruediv__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for /=: 'set' and '" + type_name(other) + "'");
}

Set.prototype.__iadd__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for +=: 'set' and '" + type_name(other) + "'");
}

Set.prototype.__isub__ = function(other) {
    var types = require('../types');
    var builtins = require('../builtins');

    if (types.isinstance(other, [types.FrozenSet, types.Set])){
        var both = [];
        var iterobj1 = builtins.iter([this], null);
        callables.iter_for_each(iterobj1, function(val) {
            if (!(other.__contains__(val).valueOf())) {
                both.push(val);
            }
        });
        this.update(both);
        return new Set(both);
    }
    throw new exceptions.TypeError("unsupported operand type(s) for -=: 'set' and '" + type_name(other) + "'");
}

Set.prototype.__imul__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for *=: 'set' and '" + type_name(other) + "'");
}

Set.prototype.__imod__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, types.Complex)){
        throw new exceptions.TypeError("can't mod complex numbers.")
    } else {
        throw new exceptions.TypeError("unsupported operand type(s) for %=: 'set' and '" + type_name(other) + "'");
    }
}

Set.prototype.__ipow__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for ** or pow(): 'set' and '" + type_name(other) + "'");
}

Set.prototype.__ilshift__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for <<=: 'set' and '" + type_name(other) + "'");
}

Set.prototype.__irshift__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for >>=: 'set' and '" + type_name(other) + "'");
}

Set.prototype.__iand__ = function(other) {
    var types = require('../types');
    var builtins = require('../builtins');

    if (types.isinstance(other, [types.FrozenSet, types.Set])) {
        var intersection = new Set();
        var iterobj = builtins.iter([this], null);
        callables.iter_for_each(iterobj, function(val) {
            if (other.__contains__(val).valueOf()) {
                intersection.add(val);
            }
        });
        return intersection;
    }
    throw new exceptions.TypeError("unsupported operand type(s) for &=: 'set' and '" + type_name(other) + "'");
}

Set.prototype.__ixor__ = function(other) {
    var types = require('../types');
    var builtins = require('../builtins');

    if (types.isinstance(other, [types.FrozenSet, types.Set])){
        var both = [];
        var iterobj1 = builtins.iter([this], null);
        callables.iter_for_each(iterobj1, function(val) {
            if (!(other.__contains__(val).valueOf())) {
                both.push(val);
            }
        });
        var iterobj2 = builtins.iter([other], null);
        callables.iter_for_each(iterobj2, function(val) {
            if (!(this.__contains__(val).valueOf())) {
                both.push(val);
            }
        }.bind(this));
        this.update(both);
        return new Set(both);
    }
    throw new exceptions.TypeError("unsupported operand type(s) for ^=: 'set' and '" + type_name(other) + "'");
}

Set.prototype.__ior__ = function(other) {
    var types = require('../types');
    var builtins = require('../builtins');

    if (types.isinstance(other, [types.FrozenSet, types.Set])){
        var both = [];
        var iterobj1 = builtins.iter([this], null);
        callables.iter_for_each(iterobj1, function(val) {
            both.push(val);
        });
        var iterobj2 = builtins.iter([other], null);
        callables.iter_for_each(iterobj2, function(val) {
            both.push(val);
        }.bind(this));
        this.update(both);
        return new Set(both);
    }
    throw new exceptions.TypeError("unsupported operand type(s) for |=: 'set' and '" + type_name(other) + "'");
}

/**************************************************
 * Methods
 **************************************************/

Set.prototype.add = function(v) {
    this.data.__setitem__(v, v);
}

Set.prototype.copy = function() {
    return new Set(this);
}

Set.prototype.remove = function(v) {
    this.data.__delitem__(v);
}

Set.prototype.update = function(args) {
    var types = require('../types');
    var builtins = require('../builtins');

    var new_args = types.js2py(args);
    if (types.isinstance(new_args, [types.FrozenSet, types.List, types.Set, types.Str, types.Tuple])) {
        var iterobj = builtins.iter([new_args], null);
        var self = this;
        callables.iter_for_each(iterobj, function(val) {
            self.data.__setitem__(val, val);
        });
    } else {
        throw new exceptions.TypeError("'" + type_name(new_args) + "' object is not iterable");
    }
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = Set;

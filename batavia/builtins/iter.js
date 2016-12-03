var exceptions = require('../core').exceptions;
var callables = require('../core').callables;
var type_name = require('../core').type_name;
var None = require('../core').None;


function iter(args, kwargs) {
    var types = require('../types');

    if (arguments.length != 2) {
        throw new exceptions.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError("iter() doesn't accept keyword arguments");
    }
    if (!args || args.length === 0) {
        throw new exceptions.TypeError("iter() expected at least 1 arguments, got 0");
    }
    if (args.length == 2) {
        throw new exceptions.NotImplementedError("Builtin Batavia function 'iter' with callable/sentinel not implemented");
    }
    if (args.length > 2) {
        throw new exceptions.TypeError("iter() expected at most 2 arguments, got 3");
    }
    var iterobj = args[0];
    if (iterobj !== None && typeof iterobj === 'object' && !iterobj.__class__) {
        // this is a plain JS object, wrap it in a JSDict
        iterobj = new types.JSDict(iterobj);
    }

    if (iterobj !== None && iterobj.__iter__) {
        //needs to work for __iter__ in JS impl (e.g. Map/Filter) and python ones
        return callables.run_callable(iterobj, iterobj.__iter__, [], null);
    } else {
        throw new exceptions.TypeError("'" + type_name(iterobj) + "' object is not iterable");
    }
}
iter.__doc__ = 'iter(iterable) -> iterator\niter(callable, sentinel) -> iterator\n\nGet an iterator from an object.  In the first form, the argument must\nsupply its own iterator, or be a sequence.\nIn the second form, the callable is called until it returns the sentinel.';

module.exports = iter;

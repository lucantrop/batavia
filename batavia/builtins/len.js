var exceptions = require('../core').exceptions;
var types = require('../types');


function len(args, kwargs) {
    if (!args || args.length !== 1 || args[0] === undefined) {
        throw new exceptions.TypeError("len() takes exactly one argument (" + args.length + " given)");
    }

    //if (args[0].hasOwnProperty("__len__")) {
        //TODO: Fix context of python functions calling with proper vm
        //throw new exceptions.NotImplementedError('Builtin Batavia len function is not supporting __len__ implemented.');
        //return args[0].__len__.apply(vm);
    //}

    return new types.Int(args[0].length);
}
len.__doc__ = 'len(object)\n\nReturn the number of items of a sequence or collection.';

module.exports = len;

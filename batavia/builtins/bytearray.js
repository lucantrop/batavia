var exceptions = require('../core').exceptions;
var types = require('../types');


function bytearray(args, kwargs) {
//    bytearray(string, encoding[, errors]) -> bytearray
//    bytearray(bytes_or_buffer) -> mutable copy of bytes_or_buffer
//    bytearray(iterable_of_ints) -> bytearray
//    bytearray(int) -> bytes array of size given by the parameter initialized with null bytes
//    bytearray() -> empty bytes array

    if (arguments.length != 2) {
        throw new exceptions.BataviaError("Batavia calling convention not used.");
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError("<fn>() doesn't accept keyword arguments.");
    }


    if (args.length == 1 && types.isinstance(args[0], types.Bytes)) {
        // bytearray(bytes_or_buffer) -> mutable copy of bytes_or_buffer
        return new types.Bytearray(args[0]);
    } else {
        throw new exceptions.NotImplementedError(
            "Not implemented"
        );
    }
}
bytearray.__doc__ = 'bytearray(iterable_of_ints) -> bytearray\nbytearray(string, encoding[, errors]) -> bytearray\nbytearray(bytes_or_buffer) -> mutable copy of bytes_or_buffer\nbytearray(int) -> bytes array of size given by the parameter initialized with null bytes\nbytearray() -> empty bytes array\n\nConstruct an mutable bytearray object from:\n  - an iterable yielding integers in range(256)\n  - a text string encoded using the specified encoding\n  - a bytes or a buffer object\n  - any object implementing the buffer API.\n  - an integer';

module.exports = bytearray;

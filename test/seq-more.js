'use strict';

var assert = require('assert');
var larr = require('..');
var positiveNumbers = require('./utils/positiveNumbers');

// Operating on a lazy sequence using the higher level methods that depend on
// the base seq API: first, rest and cons.
describe('seq-more', function () {
    var lseq;

    beforeEach(function () {
        lseq = positiveNumbers(10);
    });

    describe('second', function () {
        it('fetches the second result', function () {
            assert.strictEqual(larr.second(lseq), 11);
        });
    });

    describe('nth', function () {
        it('fetches the nth result', function () {
            assert.strictEqual(larr.nth(lseq, 20), 30);
        });
    });

    describe('take', function () {
        it('returns a lazy array with the length capped', function () {
            var t = larr.take(10, lseq);
            assert.strictEqual(larr.nth(t, 5), 15);
            assert.strictEqual(larr.nth(t, 9), 19);
            assert.strictEqual(larr.nth(t, 11), undefined);
        });

        it('taking from an empty array yields an empty array', function () {
            var t = larr.take(5, []);
            assert.strictEqual(larr.nth(t, 2), undefined);
        });

        it('plays well with drop', function () {
            var nums = positiveNumbers(1);
            var res = larr.all(larr.take(3, larr.drop(5, nums)));
            assert.deepEqual(res, [6, 7, 8]);
        });
    });

    describe('drop', function () {
        it('returns a lazy array with n dropped', function () {
            var t = larr.all(larr.take(5, larr.drop(10, lseq)));
            assert.deepEqual(t, [20, 21, 22, 23, 24]);
        });

        it('dropping from an empty array yields and empty array', function () {
            var t = larr.all(larr.drop(5, []));
            assert.deepEqual(t, []);
        });
    });

    describe('all', function () {
        it('resolves all possible values', function () {
            var t = larr.take(5, lseq);
            assert.deepEqual(larr.all(t), [10, 11, 12, 13, 14]);
        });

        it('resolves normal arrays to normal arrays', function () {
            assert.deepEqual(larr.all([0, 1, 2]), [0, 1, 2]);
        });
    });

    describe('last', function () {
        it('fetches the last value', function () {
            var t = larr.take(5, lseq);
            assert.strictEqual(larr.last(t), 14);
        });

        it('returns undefined if the sequence is empty', function () {
            assert.strictEqual(larr.last([]), undefined);
        });
    });

    describe('map', function () {
        it('maps a sequence over a function', function () {
            function inc(n) {
                return n + 1;
            }

            assert.deepEqual(larr.all(larr.map(inc, [0, 1, 2])), [1, 2, 3]);
        });
    });

    describe('filter', function () {
        it('removes values that do not pass a predicate', function () {
            function even(n) {
                return n % 2 === 0;
            }

            function f(n) {
                return larr.all(larr.filter(even, n));
            }

            assert.deepEqual(f([2, 3, 4]), [2, 4]);
            assert.deepEqual(f([1, 2, 3, 4, 5, 6]), [2, 4, 6]);
            assert.deepEqual(f([2, 2, 3, 2]), [2, 2, 2]);
            assert.deepEqual(f([5]), []);
            assert.deepEqual(f([]), []);
        });
    });

    describe('reduce', function () {
        it('can reduce a sequence to a value', function () {
            function add(a, b) {
                return a + b;
            }

            function f(n) {
                return larr.reduce(add, 0, n);
            }

            assert.strictEqual(f([1, 2, 3, 4, 5]), 15);
        });
    });
});

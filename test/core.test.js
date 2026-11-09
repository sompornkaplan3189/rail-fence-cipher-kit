import test from 'node:test';
import assert from 'node:assert/strict';
import { encode, decode } from '../src/index.js';

test('encode basic example', () => {
  // "WEAREDISCOVEREDFLEEATONCE" with 3 rails -> "WECRLTEERDSOEEFEAOCAIVDEN"
  assert.equal(encode('WEAREDISCOVEREDFLEEATONCE', 3), 'WECRLTEERDSOEEFEAOCAIVDEN');
});

test('decode basic example', () => {
  assert.equal(decode('WECRLTEERDSOEEFEAOCAIVDEN', 3), 'WEAREDISCOVEREDFLEEATONCE');
});

test('encode with 1 rail is identity', () => {
  assert.equal(encode('HELLO WORLD', 1), 'HELLOWORLD');
});

test('decode with 1 rail is identity', () => {
  assert.equal(decode('HELLOWORLD', 1), 'HELLOWORLD');
});

test('encode with more rails than characters', () => {
  // 2 characters, 5 rails: pattern is [0,1], rows: row0='A', row1='B', others empty.
  // Reading rows in order gives 'AB'.
  assert.equal(encode('AB', 5), 'AB');
});

test('decode with more rails than characters', () => {
  assert.equal(decode('AB', 5), 'AB');
});

test('encode strips non-letters and uppercases', () => {
  assert.equal(encode('Hello, World! 123', 3), encode('HELLOWORLD', 3));
});

test('decode strips non-letters and uppercases', () => {
  assert.equal(decode('wec rlte erds oee fea oc aiv den', 3), 'WEAREDISCOVEREDFLEEATONCE');
});

test('encode empty string', () => {
  assert.equal(encode('', 3), '');
});

test('decode empty string', () => {
  assert.equal(decode('', 3), '');
});

test('encode with rails less than 1 throws RangeError', () => {
  assert.throws(() => encode('HELLO', 0), RangeError);
  assert.throws(() => encode('HELLO', -1), RangeError);
});

test('decode with rails less than 1 throws RangeError', () => {
  assert.throws(() => decode('HELLO', 0), RangeError);
  assert.throws(() => decode('HELLO', -1), RangeError);
});

test('encode with non-integer rails throws TypeError', () => {
  assert.throws(() => encode('HELLO', 2.5), TypeError);
  assert.throws(() => encode('HELLO', '3'), TypeError);
});

test('decode with non-integer rails throws TypeError', () => {
  assert.throws(() => decode('HELLO', 2.5), TypeError);
  assert.throws(() => decode('HELLO', '3'), TypeError);
});

test('round-trip encode then decode', () => {
  const plain = 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG';
  const cipher = encode(plain, 4);
  assert.equal(decode(cipher, 4), plain.replace(/[^A-Z]/g, ''));
});

# rail-fence-cipher-kit

A tiny, dependency-free implementation of the Rail Fence cipher for Node.js.

## Usage

```js
import { encode, decode } from 'rail-fence-cipher-kit';

const ciphertext = encode('WEAREDISCOVEREDFLEEATONCE', 3);
// => 'WECRLTEERDSOEEFEAOCAIVDEN'

const plaintext = decode(ciphertext, 3);
// => 'WEAREDISCOVEREDFLEEATONCE'
```

## Why this exists

The Rail Fence cipher is a simple transposition cipher: you write the message in a
zigzag pattern across a number of "rails" and then read off each rail from top to
bottom. There are many implementations online, but most either depend on a framework
or leave edge cases (like non-letter characters) undefined.

This library makes one clear decision: **only uppercase letters A–Z are meaningful.**
All other characters are stripped before encoding or decoding, and the result is
always uppercase. This matches the classical cipher's behaviour and keeps the
implementation predictable. If you need to preserve case or punctuation, you must
handle that outside this library.

## Edge cases

- **Rails less than 1** throws a `RangeError`.
- **Non-integer rails** throws a `TypeError`.
- **Empty input** returns an empty string.
- **More rails than characters** is allowed; the extra rails simply stay empty.
- **Non-letter characters** are removed, so `encode('Hello!', 3)` is the same as
  `encode('HELLO', 3)`.

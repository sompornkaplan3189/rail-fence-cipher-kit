const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Normalizes text for rail fence cipher operations. The cipher is traditionally
 * applied to uppercase letters only, so we strip everything else. This makes
 * the encoding and decoding symmetric and avoids needing to transmit which
 * characters were kept.
 */
function normalize(text) {
  return text.toUpperCase().replace(/[^A-Z]/g, '');
}

/**
 * Validates that rails is a positive integer.
 *
 * @param {number} rails
 * @throws {TypeError|RangeError}
 */
function validateRails(rails) {
  if (typeof rails !== 'number' || !Number.isInteger(rails)) {
    throw new TypeError('rails must be an integer');
  }
  if (rails < 1) {
    throw new RangeError('rails must be at least 1');
  }
}

/**
 * Builds the zigzag pattern of rail indices for a given length and number of rails.
 * The pattern goes down from 0 to rails-1, then up from rails-2 to 1, repeating.
 *
 * @param {number} length
 * @param {number} rails
 * @returns {number[]} Array of rail indices, one per character position.
 */
function buildPattern(length, rails) {
  if (rails === 1) {
    return new Array(length).fill(0);
  }
  const pattern = [];
  let rail = 0;
  let direction = 1; // 1 = down, -1 = up
  for (let i = 0; i < length; i++) {
    pattern.push(rail);
    rail += direction;
    if (rail === rails - 1) {
      direction = -1;
    } else if (rail === 0) {
      direction = 1;
    }
  }
  return pattern;
}

/**
 * Enciphers text using the rail fence cipher.
 *
 * @param {string} text - The plaintext.
 * @param {number} rails - Number of rails (must be >= 1).
 * @returns {string} The ciphertext (uppercase letters only).
 */
export function encode(text, rails) {
  validateRails(rails);
  const normalized = normalize(text);
  if (normalized.length === 0) {
    return '';
  }
  const pattern = buildPattern(normalized.length, rails);
  const rows = Array.from({ length: rails }, () => []);
  for (let i = 0; i < normalized.length; i++) {
    rows[pattern[i]].push(normalized[i]);
  }
  return rows.map(row => row.join('')).join('');
}

/**
 * Deciphers text encoded with the rail fence cipher.
 *
 * @param {string} ciphertext - The ciphertext.
 * @param {number} rails - Number of rails (must be >= 1).
 * @returns {string} The plaintext (uppercase letters only).
 */
export function decode(ciphertext, rails) {
  validateRails(rails);
  const normalized = normalize(ciphertext);
  if (normalized.length === 0) {
    return '';
  }
  const pattern = buildPattern(normalized.length, rails);

  // Count how many characters belong to each rail.
  const counts = new Array(rails).fill(0);
  for (const rail of pattern) {
    counts[rail]++;
  }

  // Split the ciphertext into rows according to the counts.
  const rows = [];
  let pos = 0;
  for (let r = 0; r < rails; r++) {
    rows.push(normalized.slice(pos, pos + counts[r]));
    pos += counts[r];
  }

  // Reconstruct the plaintext by reading characters from the rows in pattern order.
  const rowIndices = new Array(rails).fill(0);
  const result = [];
  for (const rail of pattern) {
    result.push(rows[rail][rowIndices[rail]]);
    rowIndices[rail]++;
  }
  return result.join('');
}

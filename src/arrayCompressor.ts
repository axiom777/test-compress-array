/**
 * Array Compressor - TypeScript Implementation
 * 
 * Compresses arrays of integers (1-300) using combinatorial encoding with Base94.
 * Supports arrays of length 5-1000.
 */

// === CONSTANTS ===

/**
 * Base94 alphabet containing ASCII characters 33-126
 */
export const ALPHABET: string = Array.from({ length: 94 }, (_, i) => String.fromCharCode(i + 33)).join('');

/**
 * Reverse mapping from characters to their BigInt values
 */
export const CHAR_MAP: Record<string, bigint> = (() => {
  const map: Record<string, bigint> = {};
  for (let i = 0; i < ALPHABET.length; i++) {
    map[ALPHABET[i]] = BigInt(i);
  }
  return map;
})();

/**
 * Base number for encoding (94)
 */
export const BASE: bigint = 94n;

/**
 * Maximum value allowed in arrays (300)
 */
export const MAX_VAL: bigint = 300n;

/**
 * Minimum array length (5)
 */
export const MIN_LEN: bigint = 5n;

// === MATH FUNCTIONS ===

/**
 * Calculate binomial coefficient nCr (n choose k)
 * 
 * @param n - Total number of items
 * @param k - Number of items to choose
 * @returns The binomial coefficient as a BigInt
 */
export function nCr(n: bigint, k: bigint): bigint {
  if (k < 0n || k > n) return 0n;
  if (k === 0n || k === n) return 1n;
  if (k > n - k) k = n - k;
  
  let res = 1n;
  for (let i = 0n; i < k; i++) {
    res = (res * (n - i)) / (i + 1n);
  }
  return res;
}

/**
 * Calculate the size of a bucket for arrays of length n
 * 
 * @param n - Length of the array
 * @returns The bucket size as a BigInt
 */
export function getBucketSize(n: bigint): bigint {
  return nCr(MAX_VAL + n - 1n, n);
}

// === SERIALIZATION ===

/**
 * Serialize an array of numbers to a compressed Base94 string
 * 
 * @param nums - Array of numbers to serialize (values 1-300, length 5-1000)
 * @returns Compressed Base94 string representation
 */
export function serialize(nums: number[]): string {
  if (!nums || nums.length === 0) return "";
  
  const sorted = [...nums].sort((a, b) => a - b);
  const n = BigInt(sorted.length);

  // 1. Calculate offset for arrays >= MIN_LEN (5)
  let offset = 0n;
  // Loop from MIN_LEN (5) to n-1
  for (let k = MIN_LEN; k < n; k++) {
    offset += getBucketSize(k);
  }

  // 2. Calculate index within the bucket
  let index = 0n;
  for (let i = 0n; i < n; i++) {
    const val = BigInt(sorted[Number(i)]);
    const k = i + 1n;
    const top = val + i - 1n;
    if (top >= k) {
      index += nCr(top, k);
    }
  }

  let fullIndex = offset + index;

  // 3. Convert to Base94 string
  if (fullIndex === 0n) return ALPHABET[0];
  
  let res = "";
  while (fullIndex > 0n) {
    res = ALPHABET[Number(fullIndex % BASE)] + res;
    fullIndex /= BASE;
  }
  
  return res;
}

// === DESERIALIZATION ===

/**
 * Deserialize a Base94 string back to an array of numbers
 * 
 * @param s - Base94 string to deserialize
 * @returns Array of numbers (sorted, values 1-300)
 */
export function deserialize(s: string): number[] {
  if (!s) return [];

  // Parse Base94 string to BigInt
  let fullIndex = 0n;
  for (const char of s) {
    fullIndex = fullIndex * BASE + CHAR_MAP[char];
  }

  // 1. Determine array length by finding the correct bucket
  let n = MIN_LEN;
  let offset = 0n;
  let size = getBucketSize(n);
  
  // While the number is greater than the current bucket, jump to the next
  while (fullIndex >= offset + size) {
    offset += size;
    n++;
    size = getBucketSize(n);
  }

  let index = fullIndex - offset;
  const nums: number[] = [];

  // 2. Decode numbers using binary search
  for (let i = n; i >= 1n; i--) {
    let low = i - 1n;
    let high = MAX_VAL + i;
    let bestK = low;
    
    while (low <= high) {
      const mid = (low + high) >> 1n;
      const c = nCr(mid, i);
      if (c <= index) {
        bestK = mid;
        low = mid + 1n;
      } else {
        high = mid - 1n;
      }
    }
    
    const a_i = bestK - i + 2n;
    nums.push(Number(a_i));
    index -= nCr(bestK, i);
  }

  return nums.sort((a, b) => a - b);
}

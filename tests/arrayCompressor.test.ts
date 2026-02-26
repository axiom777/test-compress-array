/**
 * Comprehensive Jest Test Suite for Array Compressor
 * 
 * Tests the serialization and deserialization of arrays of integers (1-300)
 * using combinatorial encoding with Base94.
 * 
 * Goal: Achieve 2x compression ratio for all possible inputs.
 */

import { serialize, deserialize } from '../src/arrayCompressor';

// === HELPER FUNCTIONS ===

/**
 * Generate a random array of numbers within the valid range (1-300)
 * 
 * @param size - Size of the array to generate
 * @returns Random array of numbers
 */
function createRandomArray(size: number): number[] {
  const arr: number[] = [];
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * 300) + 1);
  }
  return arr;
}

/**
 * Verify that serialization and deserialization produce the original array
 * 
 * @param arr - Original array to verify
 * @returns True if round-trip is successful
 */
function verifyRoundTrip(arr: number[]): boolean {
  const serialized = serialize(arr);
  const deserialized = deserialize(serialized);
  const sortedOriginal = [...arr].sort((a, b) => a - b);
  const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
  
  return JSON.stringify(sortedOriginal) === JSON.stringify(sortedDeserialized);
}

/**
 * Run a compression test with detailed logging
 * 
 * @param name - Name of the test
 * @param arr - Array to test compression on
 */
function testCompression(name: string, arr: number[]): void {
  test(name, () => {
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    // Calculate original length (number of characters in JSON representation)
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    // Verify round-trip - both should be sorted
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    
    // Log detailed results
    console.log(`  Array size: ${arr.length}`);
    console.log(`  Original length: ${originalLength} chars`);
    console.log(`  Compressed length: ${compressedLength} chars`);
    console.log(`  Compression ratio: ${compressionRatio.toFixed(4)}`);
    console.log(`  Serialized: "${serialized}"`);
    
    // Assertions
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });
}

// === TEST SUITES ===

describe('Array Compressor - Simple Short Tests', () => {
  
  test('Minimum array: [1, 2, 3, 4, 5]', () => {
    const arr = [1, 2, 3, 4, 5];
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Array size: ${arr.length}`);
    console.log(`  Original length: ${originalLength} chars`);
    console.log(`  Compressed length: ${compressedLength} chars`);
    console.log(`  Compression ratio: ${compressionRatio.toFixed(4)}`);
    console.log(`  Serialized: "${serialized}"`);
    
    // Compare sorted arrays since the implementation sorts during serialization/deserialization
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });

  test('User example: [1, 1, 1, 300, 300]', () => {
    const arr = [1, 1, 1, 300, 300];
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Array size: ${arr.length}`);
    console.log(`  Original length: ${originalLength} chars`);
    console.log(`  Compressed length: ${compressedLength} chars`);
    console.log(`  Compression ratio: ${compressionRatio.toFixed(4)}`);
    console.log(`  Serialized: "${serialized}"`);
    
    // Compare sorted arrays since the implementation sorts during serialization/deserialization
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });

  test('Small array with all same values: [5, 5, 5, 5, 5]', () => {
    const arr = [5, 5, 5, 5, 5];
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Array size: ${arr.length}`);
    console.log(`  Original length: ${originalLength} chars`);
    console.log(`  Compressed length: ${compressedLength} chars`);
    console.log(`  Compression ratio: ${compressionRatio.toFixed(4)}`);
    console.log(`  Serialized: "${serialized}"`);
    
    // Compare sorted arrays since the implementation sorts during serialization/deserialization
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });

  test('Small array with consecutive values: [10, 11, 12, 13, 14]', () => {
    const arr = [10, 11, 12, 13, 14];
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Array size: ${arr.length}`);
    console.log(`  Original length: ${originalLength} chars`);
    console.log(`  Compressed length: ${compressedLength} chars`);
    console.log(`  Compression ratio: ${compressionRatio.toFixed(4)}`);
    console.log(`  Serialized: "${serialized}"`);
    
    // Compare sorted arrays since the implementation sorts during serialization/deserialization
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });

  test('Small array with maximum spread: [1, 150, 300, 200, 50]', () => {
    const arr = [1, 150, 300, 200, 50];
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Array size: ${arr.length}`);
    console.log(`  Original length: ${originalLength} chars`);
    console.log(`  Compressed length: ${compressedLength} chars`);
    console.log(`  Compression ratio: ${compressionRatio.toFixed(4)}`);
    console.log(`  Serialized: "${serialized}"`);
    
    // Compare sorted arrays since the implementation sorts during serialization/deserialization
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });
});

describe('Array Compressor - Random Tests', () => {
  
  testCompression('50 random numbers', createRandomArray(50));
  
  testCompression('100 random numbers', createRandomArray(100));
  
  testCompression('500 random numbers', createRandomArray(500));
  
  testCompression('1000 random numbers', createRandomArray(1000));
});

describe('Array Compressor - Boundary Tests', () => {
  
  test('All single-digit numbers (1-9, repeated)', () => {
    const arr: number[] = [];
    for (let i = 1; i <= 9; i++) {
      arr.push(i, i, i); // Each number appears 3 times
    }
    
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Array size: ${arr.length}`);
    console.log(`  Original length: ${originalLength} chars`);
    console.log(`  Compressed length: ${compressedLength} chars`);
    console.log(`  Compression ratio: ${compressionRatio.toFixed(4)}`);
    console.log(`  Serialized: "${serialized}"`);
    
    // Compare sorted arrays since the implementation sorts during serialization/deserialization
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });

  test('All two-digit numbers (10-99, repeated)', () => {
    const arr: number[] = [];
    for (let i = 10; i <= 99; i++) {
      arr.push(i, i, i); // Each number appears 3 times
    }
    
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Array size: ${arr.length}`);
    console.log(`  Original length: ${originalLength} chars`);
    console.log(`  Compressed length: ${compressedLength} chars`);
    console.log(`  Compression ratio: ${compressionRatio.toFixed(4)}`);
    console.log(`  Serialized: "${serialized}"`);
    
    // Compare sorted arrays since the implementation sorts during serialization/deserialization
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });

  test('All three-digit numbers (100-300, repeated)', () => {
    const arr: number[] = [];
    for (let i = 100; i <= 300; i++) {
      arr.push(i, i, i); // Each number appears 3 times
    }
    
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Array size: ${arr.length}`);
    console.log(`  Original length: ${originalLength} chars`);
    console.log(`  Compressed length: ${compressedLength} chars`);
    console.log(`  Compression ratio: ${compressionRatio.toFixed(4)}`);
    console.log(`  Serialized: "${serialized}"`);
    
    // Compare sorted arrays since the implementation sorts during serialization/deserialization
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });

  test('Each number appears 3 times (900 numbers total)', () => {
    const arr: number[] = [];
    for (let i = 1; i <= 300; i++) {
      arr.push(i, i, i); // Each number appears 3 times
    }
    
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Array size: ${arr.length}`);
    console.log(`  Original length: ${originalLength} chars`);
    console.log(`  Compressed length: ${compressedLength} chars`);
    console.log(`  Compression ratio: ${compressionRatio.toFixed(4)}`);
    console.log(`  Serialized: "${serialized}"`);
    
    // Compare sorted arrays since the implementation sorts during serialization/deserialization
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });
});

describe('Array Compressor - Edge Cases', () => {
  
  test('Array with many duplicates', () => {
    const arr: number[] = [];
    for (let i = 0; i < 200; i++) {
      arr.push(42); // Same number 200 times
    }
    
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Array size: ${arr.length}`);
    console.log(`  Original length: ${originalLength} chars`);
    console.log(`  Compressed length: ${compressedLength} chars`);
    console.log(`  Compression ratio: ${compressionRatio.toFixed(4)}`);
    console.log(`  Serialized: "${serialized}"`);
    
    // Compare sorted arrays since the implementation sorts during serialization/deserialization
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });

  test('Array with consecutive numbers', () => {
    const arr: number[] = [];
    for (let i = 1; i <= 100; i++) {
      arr.push(i);
    }
    
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Array size: ${arr.length}`);
    console.log(`  Original length: ${originalLength} chars`);
    console.log(`  Compressed length: ${compressedLength} chars`);
    console.log(`  Compression ratio: ${compressionRatio.toFixed(4)}`);
    console.log(`  Serialized: "${serialized}"`);
    
    // Compare sorted arrays since the implementation sorts during serialization/deserialization
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });

  test('Array with maximum spread (1 and 300)', () => {
    const arr: number[] = [];
    for (let i = 0; i < 50; i++) {
      arr.push(1);
      arr.push(300);
    }
    
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Array size: ${arr.length}`);
    console.log(`  Original length: ${originalLength} chars`);
    console.log(`  Compressed length: ${compressedLength} chars`);
    console.log(`  Compression ratio: ${compressionRatio.toFixed(4)}`);
    console.log(`  Serialized: "${serialized}"`);
    
    // Compare sorted arrays since the implementation sorts during serialization/deserialization
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });

  test('Reverse order (should handle sorting)', () => {
    const arr: number[] = [];
    for (let i = 100; i >= 1; i--) {
      arr.push(i);
    }
    
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Array size: ${arr.length}`);
    console.log(`  Original length: ${originalLength} chars`);
    console.log(`  Compressed length: ${compressedLength} chars`);
    console.log(`  Compression ratio: ${compressionRatio.toFixed(4)}`);
    console.log(`  Serialized: "${serialized}"`);
    
    // Compare sorted arrays since the implementation sorts during serialization/deserialization
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });

  test('Empty array', () => {
    const arr: number[] = [];
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    console.log(`  Array size: ${arr.length}`);
    console.log(`  Serialized: "${serialized}"`);
    
    expect(deserialized).toEqual(arr);
  });

  test('Array with minimum valid length (5)', () => {
    const arr = [1, 2, 3, 4, 5];
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Array size: ${arr.length}`);
    console.log(`  Original length: ${originalLength} chars`);
    console.log(`  Compressed length: ${compressedLength} chars`);
    console.log(`  Compression ratio: ${compressionRatio.toFixed(4)}`);
    console.log(`  Serialized: "${serialized}"`);
    
    // Compare sorted arrays since the implementation sorts during serialization/deserialization
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });

  test('Array with maximum valid length (1000)', () => {
    const arr = createRandomArray(1000);
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Array size: ${arr.length}`);
    console.log(`  Original length: ${originalLength} chars`);
    console.log(`  Compressed length: ${compressedLength} chars`);
    console.log(`  Compression ratio: ${compressionRatio.toFixed(4)}`);
    console.log(`  Serialized: "${serialized}"`);
    
    // Compare sorted arrays since the implementation sorts during serialization/deserialization
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });

  test('Array with only minimum values (1)', () => {
    const arr: number[] = [];
    for (let i = 0; i < 100; i++) {
      arr.push(1);
    }
    
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Array size: ${arr.length}`);
    console.log(`  Original length: ${originalLength} chars`);
    console.log(`  Compressed length: ${compressedLength} chars`);
    console.log(`  Compression ratio: ${compressionRatio.toFixed(4)}`);
    console.log(`  Serialized: "${serialized}"`);
    
    // Compare sorted arrays since the implementation sorts during serialization/deserialization
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });

  test('Array with only maximum values (300)', () => {
    const arr: number[] = [];
    for (let i = 0; i < 100; i++) {
      arr.push(300);
    }
    
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Array size: ${arr.length}`);
    console.log(`  Original length: ${originalLength} chars`);
    console.log(`  Compressed length: ${compressedLength} chars`);
    console.log(`  Compression ratio: ${compressionRatio.toFixed(4)}`);
    console.log(`  Serialized: "${serialized}"`);
    
    // Compare sorted arrays since the implementation sorts during serialization/deserialization
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });
});

describe('Array Compressor - Round-Trip Verification', () => {
  
  test('Verify round-trip for various arrays', () => {
    const testArrays = [
      [1, 2, 3, 4, 5],
      [1, 1, 1, 300, 300],
      createRandomArray(50),
      createRandomArray(100),
      createRandomArray(500),
      createRandomArray(1000),
    ];
    
    testArrays.forEach((arr, index) => {
      const roundTripSuccess = verifyRoundTrip(arr);
      console.log(`  Test array ${index + 1}: ${roundTripSuccess ? 'PASS' : 'FAIL'}`);
      expect(roundTripSuccess).toBe(true);
    });
  });
});

describe('Array Compressor - Helper Function Tests', () => {
  
  test('createRandomArray generates valid arrays', () => {
    const sizes = [5, 10, 50, 100, 500, 1000];
    
    sizes.forEach(size => {
      const arr = createRandomArray(size);
      expect(arr).toHaveLength(size);
      
      arr.forEach(num => {
        expect(num).toBeGreaterThanOrEqual(1);
        expect(num).toBeLessThanOrEqual(300);
      });
    });
  });

  test('verifyRoundTrip correctly identifies success/failure', () => {
    const validArray = [1, 2, 3, 4, 5];
    expect(verifyRoundTrip(validArray)).toBe(true);
    
    // Test with various array sizes
    const randomArray = createRandomArray(100);
    expect(verifyRoundTrip(randomArray)).toBe(true);
  });
});

describe('Array Compressor - Compression Ratio Analysis', () => {
  
  test('Analyze compression ratios across different array sizes', () => {
    const sizes = [5, 10, 50, 100, 200, 500, 1000];
    const ratios: number[] = [];
    
    sizes.forEach(size => {
      const arr = createRandomArray(size);
      const serialized = serialize(arr);
      const deserialized = deserialize(serialized);
      
      const originalLength = JSON.stringify(arr).length;
      const compressedLength = serialized.length;
      const compressionRatio = compressedLength / originalLength;
      
      ratios.push(compressionRatio);
      
      console.log(`  Size ${size}: ratio = ${compressionRatio.toFixed(4)}`);
      
      // Compare sorted arrays since the implementation sorts during serialization/deserialization
      const sortedOriginal = [...arr].sort((a, b) => a - b);
      const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
      expect(sortedDeserialized).toEqual(sortedOriginal);
      expect(compressionRatio).toBeLessThan(0.5);
    });
    
    // Verify all ratios are below 0.5
    ratios.forEach(ratio => {
      expect(ratio).toBeLessThan(0.5);
    });
  });
});

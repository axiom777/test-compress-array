/**
 * Комплексный набор тестов Jest для Сжатия Массивов
 * 
 * Тестирует сериализацию и десериализацию массивов целых чисел (1-300)
 * с использованием комбинаторного кодирования в Base94.
 * 
 * Цель: Достичь коэффициента сжатия 2x для всех возможных входных данных.
 */

import { serialize, deserialize } from '../src/arrayCompressor';

// === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===

/**
 * Генерирует случайный массив чисел в допустимом диапазоне (1-300)
 * 
 * @param size - Размер генерируемого массива
 * @returns Случайный массив чисел
 */
function createRandomArray(size: number): number[] {
  const arr: number[] = [];
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * 300) + 1);
  }
  return arr;
}

/**
 * Генерирует массив с повторяющимися значениями
 * 
 * @param start - Начало диапазона
 * @param end - Конец диапазона
 * @param repeatCount - Количество повторений каждого числа
 * @returns Массив с повторяющимися значениями
 */
function createRepeatedArray(start: number, end: number, repeatCount: number = 3): number[] {
  const arr: number[] = [];
  for (let i = start; i <= end; i++) {
    for (let j = 0; j < repeatCount; j++) {
      arr.push(i);
    }
  }
  return arr;
}

/**
 * Генерирует массив с одним повторяющимся значением
 * 
 * @param value - Значение для повторения
 * @param count - Количество повторений
 * @returns Массив с повторяющимся значением
 */
function createUniformArray(value: number, count: number): number[] {
  return Array(count).fill(value);
}

/**
 * Генерирует массив с чередующимися значениями
 * 
 * @param values - Значения для чередования
 * @param repeatCount - Количество повторений пары
 * @returns Массив с чередующимися значениями
 */
function createAlternatingArray(values: number[], repeatCount: number): number[] {
  const arr: number[] = [];
  for (let i = 0; i < repeatCount; i++) {
    values.forEach(v => arr.push(v));
  }
  return arr;
}

/**
 * Выполняет тест сжатия с логированием
 * 
 * @param name - Имя теста
 * @param arr - Массив для тестирования
 * @param checkCompression - Проверять ли коэффициент сжатия
 */
function runCompressionTest(name: string, arr: number[], checkCompression: boolean = true): void {
  const serialized = serialize(arr);
  const deserialized = deserialize(serialized);
  
  const originalLength = JSON.stringify(arr).length;
  const compressedLength = serialized.length;
  const compressionRatio = compressedLength / originalLength;
  
  const sortedOriginal = [...arr].sort((a, b) => a - b);
  const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
  
  console.log(`  Тест: ${name}`);
  console.log(`  Размер массива: ${arr.length}`);
  console.log(`  Исходная длина: ${originalLength} символов`);
  console.log(`  Сжатая длина: ${compressedLength} символов`);
  console.log(`  Коэффициент сжатия: ${compressionRatio.toFixed(4)}`);
  console.log(`  Сериализовано: "${serialized}"`);
  
  expect(sortedDeserialized).toEqual(sortedOriginal);
  if (checkCompression && arr.length > 0) {
    expect(compressionRatio).toBeLessThan(0.5);
  }
}

// === НАБОРЫ ТЕСТОВ ===

describe('Сжатие Массивов - Простые Короткие Тесты', () => {
  test.each([
    ['Минимальный массив', [1, 2, 3, 4, 5]],
    ['Пример пользователя', [1, 1, 1, 300, 300]],
    ['Одинаковые значения', [5, 5, 5, 5, 5]],
    ['Последовательные значения', [10, 11, 12, 13, 14]],
    ['Максимальный разброс', [1, 150, 300, 200, 50]],
  ])('%s', (name, arr) => {
    runCompressionTest(name, arr);
  });
});

describe('Сжатие Массивов - Случайные Тесты', () => {
  test.each([
    ['50 случайных чисел', 50],
    ['100 случайных чисел', 100],
    ['500 случайных чисел', 500],
    ['1000 случайных чисел', 1000],
  ])('%s', (name, size) => {
    runCompressionTest(name, createRandomArray(size));
  });
});

describe('Сжатие Массивов - Граничные Тесты', () => {
  test.each([
    ['Все однозначные числа (1-9)', createRepeatedArray(1, 9, 3)],
    ['Все двузначные числа (10-99)', createRepeatedArray(10, 99, 3)],
    ['Все трёхзначные числа (100-300)', createRepeatedArray(100, 300, 3)],
    ['Каждое число 3 раза (всего 900)', createRepeatedArray(1, 300, 3)],
  ])('%s', (name, arr) => {
    runCompressionTest(name, arr);
  });
});

describe('Сжатие Массивов - Краевые Случаи', () => {
  test.each([
    ['Множество дубликатов', createUniformArray(42, 200)],
    ['Последовательные числа', Array.from({ length: 100 }, (_, i) => i + 1)],
    ['Максимальный разброс (1 и 300)', createAlternatingArray([1, 300], 50)],
    ['Обратный порядок', Array.from({ length: 100 }, (_, i) => 100 - i)],
    ['Минимальная длина (5)', [1, 2, 3, 4, 5]],
    ['Максимальная длина (1000)', createRandomArray(1000)],
    ['Только минимальные значения (1)', createUniformArray(1, 100)],
    ['Только максимальные значения (300)', createUniformArray(300, 100)],
  ])('%s', (name, arr) => {
    runCompressionTest(name, arr);
  });

  test('Пустой массив', () => {
    const arr: number[] = [];
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    console.log(`  Размер массива: ${arr.length}`);
    console.log(`  Сериализовано: "${serialized}"`);
    
    expect(deserialized).toEqual(arr);
  });
});

describe('Сжатие Массивов - Тесты Производительности', () => {
  test('Множественные операции сериализации/десериализации', () => {
    const arr = createRandomArray(100);
    const iterations = 1000;
    
    const startTime = Date.now();
    for (let i = 0; i < iterations; i++) {
      const serialized = serialize(arr);
      const deserialized = deserialize(serialized);
      const sortedOriginal = [...arr].sort((a, b) => a - b);
      const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
      expect(sortedDeserialized).toEqual(sortedOriginal);
    }
    const endTime = Date.now();
    
    const avgTime = (endTime - startTime) / iterations;
    console.log(`  Среднее время операции: ${avgTime.toFixed(2)} мс`);
    console.log(`  Общее время для ${iterations} операций: ${endTime - startTime} мс`);
    
    expect(avgTime).toBeLessThan(10);
  });

  test('Сжатие большого массива', () => {
    runCompressionTest('Большой массив (1000 элементов)', createRandomArray(1000));
  });
});

describe('Сжатие Массивов - Тесты Корректности', () => {
  test('Проверка сохранения количества элементов', () => {
    const testSizes = [5, 10, 50, 100, 500, 1000];
    
    testSizes.forEach(size => {
      const arr = createRandomArray(size);
      const serialized = serialize(arr);
      const deserialized = deserialize(serialized);
      
      expect(deserialized.length).toBe(arr.length);
    });
  });

  test('Проверка диапазона значений', () => {
    const arr = createRandomArray(100);
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    
    sortedDeserialized.forEach(num => {
      expect(num).toBeGreaterThanOrEqual(1);
      expect(num).toBeLessThanOrEqual(300);
    });
    
    expect(sortedDeserialized).toEqual(sortedOriginal);
  });

  test('Проверка идентичности множеств', () => {
    const arr = createRandomArray(100);
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalSet = new Set([...arr].sort((a, b) => a - b));
    const deserializedSet = new Set([...deserialized].sort((a, b) => a - b));
    
    expect(originalSet.size).toBe(deserializedSet.size);
    
    originalSet.forEach(num => {
      expect(deserializedSet.has(num)).toBe(true);
    });
  });

  test('Проверка детерминизма сериализации', () => {
    const arr = createRandomArray(100);
    
    const serialized1 = serialize(arr);
    const serialized2 = serialize(arr);
    const serialized3 = serialize(arr);
    
    expect(serialized1).toBe(serialized2);
    expect(serialized2).toBe(serialized3);
  });

  test('Проверка детерминизма десериализации', () => {
    const arr = createRandomArray(100);
    const serialized = serialize(arr);
    
    const deserialized1 = deserialize(serialized);
    const deserialized2 = deserialize(serialized);
    const deserialized3 = deserialize(serialized);
    
    const sorted1 = [...deserialized1].sort((a, b) => a - b);
    const sorted2 = [...deserialized2].sort((a, b) => a - b);
    const sorted3 = [...deserialized3].sort((a, b) => a - b);
    
    expect(sorted1).toEqual(sorted2);
    expect(sorted2).toEqual(sorted3);
  });
});

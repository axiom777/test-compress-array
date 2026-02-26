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
 * Проверяет, что сериализация и десериализация дают исходный массив
 * 
 * @param arr - Исходный массив для проверки
 * @returns True, если полный цикл успешен
 */
function verifyRoundTrip(arr: number[]): boolean {
  const serialized = serialize(arr);
  const deserialized = deserialize(serialized);
  const sortedOriginal = [...arr].sort((a, b) => a - b);
  const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
  
  return JSON.stringify(sortedOriginal) === JSON.stringify(sortedDeserialized);
}

/**
 * Запускает тест сжатия с детальным логированием
 * 
 * @param name - Имя теста
 * @param arr - Массив для тестирования сжатия
 */
function testCompression(name: string, arr: number[]): void {
  test(name, () => {
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    // Вычисляем исходную длину (количество символов в JSON представлении)
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    // Проверяем полный цикл - оба массива должны быть отсортированы
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    
    // Логируем детальные результаты
    console.log(`  Размер массива: ${arr.length}`);
    console.log(`  Исходная длина: ${originalLength} символов`);
    console.log(`  Сжатая длина: ${compressedLength} символов`);
    console.log(`  Коэффициент сжатия: ${compressionRatio.toFixed(4)}`);
    console.log(`  Сериализовано: "${serialized}"`);
    
    // Утверждения
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });
}

// === НАБОРЫ ТЕСТОВ ===

describe('Сжатие Массивов - Простые Короткие Тесты', () => {
  
  test('Минимальный массив: [1, 2, 3, 4, 5]', () => {
    const arr = [1, 2, 3, 4, 5];
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Размер массива: ${arr.length}`);
    console.log(`  Исходная длина: ${originalLength} символов`);
    console.log(`  Сжатая длина: ${compressedLength} символов`);
    console.log(`  Коэффициент сжатия: ${compressionRatio.toFixed(4)}`);
    console.log(`  Сериализовано: "${serialized}"`);
    
    // Сравниваем отсортированные массивы, так как реализация сортирует при сериализации/десериализации
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });

  test('Пример пользователя: [1, 1, 1, 300, 300]', () => {
    const arr = [1, 1, 1, 300, 300];
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Размер массива: ${arr.length}`);
    console.log(`  Исходная длина: ${originalLength} символов`);
    console.log(`  Сжатая длина: ${compressedLength} символов`);
    console.log(`  Коэффициент сжатия: ${compressionRatio.toFixed(4)}`);
    console.log(`  Сериализовано: "${serialized}"`);
    
    // Сравниваем отсортированные массивы, так как реализация сортирует при сериализации/десериализации
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });

  test('Малый массив с одинаковыми значениями: [5, 5, 5, 5, 5]', () => {
    const arr = [5, 5, 5, 5, 5];
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Размер массива: ${arr.length}`);
    console.log(`  Исходная длина: ${originalLength} символов`);
    console.log(`  Сжатая длина: ${compressedLength} символов`);
    console.log(`  Коэффициент сжатия: ${compressionRatio.toFixed(4)}`);
    console.log(`  Сериализовано: "${serialized}"`);
    
    // Сравниваем отсортированные массивы, так как реализация сортирует при сериализации/десериализации
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });

  test('Малый массив с последовательными значениями: [10, 11, 12, 13, 14]', () => {
    const arr = [10, 11, 12, 13, 14];
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Размер массива: ${arr.length}`);
    console.log(`  Исходная длина: ${originalLength} символов`);
    console.log(`  Сжатая длина: ${compressedLength} символов`);
    console.log(`  Коэффициент сжатия: ${compressionRatio.toFixed(4)}`);
    console.log(`  Сериализовано: "${serialized}"`);
    
    // Сравниваем отсортированные массивы, так как реализация сортирует при сериализации/десериализации
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });

  test('Малый массив с максимальным разбросом: [1, 150, 300, 200, 50]', () => {
    const arr = [1, 150, 300, 200, 50];
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Размер массива: ${arr.length}`);
    console.log(`  Исходная длина: ${originalLength} символов`);
    console.log(`  Сжатая длина: ${compressedLength} символов`);
    console.log(`  Коэффициент сжатия: ${compressionRatio.toFixed(4)}`);
    console.log(`  Сериализовано: "${serialized}"`);
    
    // Сравниваем отсортированные массивы, так как реализация сортирует при сериализации/десериализации
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });
});

describe('Сжатие Массивов - Случайные Тесты', () => {
  
  testCompression('50 случайных чисел', createRandomArray(50));
  
  testCompression('100 случайных чисел', createRandomArray(100));
  
  testCompression('500 случайных чисел', createRandomArray(500));
  
  testCompression('1000 случайных чисел', createRandomArray(1000));
});

describe('Сжатие Массивов - Граничные Тесты', () => {
  
  test('Все однозначные числа (1-9, повторяющиеся)', () => {
    const arr: number[] = [];
    for (let i = 1; i <= 9; i++) {
      arr.push(i, i, i); // Каждое число появляется 3 раза
    }
    
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Размер массива: ${arr.length}`);
    console.log(`  Исходная длина: ${originalLength} символов`);
    console.log(`  Сжатая длина: ${compressedLength} символов`);
    console.log(`  Коэффициент сжатия: ${compressionRatio.toFixed(4)}`);
    console.log(`  Сериализовано: "${serialized}"`);
    
    // Сравниваем отсортированные массивы, так как реализация сортирует при сериализации/десериализации
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });

  test('Все двузначные числа (10-99, повторяющиеся)', () => {
    const arr: number[] = [];
    for (let i = 10; i <= 99; i++) {
      arr.push(i, i, i); // Каждое число появляется 3 раза
    }
    
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Размер массива: ${arr.length}`);
    console.log(`  Исходная длина: ${originalLength} символов`);
    console.log(`  Сжатая длина: ${compressedLength} символов`);
    console.log(`  Коэффициент сжатия: ${compressionRatio.toFixed(4)}`);
    console.log(`  Сериализовано: "${serialized}"`);
    
    // Сравниваем отсортированные массивы, так как реализация сортирует при сериализации/десериализации
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });

  test('Все трёхзначные числа (100-300, повторяющиеся)', () => {
    const arr: number[] = [];
    for (let i = 100; i <= 300; i++) {
      arr.push(i, i, i); // Каждое число появляется 3 раза
    }
    
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Размер массива: ${arr.length}`);
    console.log(`  Исходная длина: ${originalLength} символов`);
    console.log(`  Сжатая длина: ${compressedLength} символов`);
    console.log(`  Коэффициент сжатия: ${compressionRatio.toFixed(4)}`);
    console.log(`  Сериализовано: "${serialized}"`);
    
    // Сравниваем отсортированные массивы, так как реализация сортирует при сериализации/десериализации
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });

  test('Каждое число появляется 3 раза (всего 900 чисел)', () => {
    const arr: number[] = [];
    for (let i = 1; i <= 300; i++) {
      arr.push(i, i, i); // Каждое число появляется 3 раза
    }
    
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Размер массива: ${arr.length}`);
    console.log(`  Исходная длина: ${originalLength} символов`);
    console.log(`  Сжатая длина: ${compressedLength} символов`);
    console.log(`  Коэффициент сжатия: ${compressionRatio.toFixed(4)}`);
    console.log(`  Сериализовано: "${serialized}"`);
    
    // Сравниваем отсортированные массивы, так как реализация сортирует при сериализации/десериализации
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });
});

describe('Сжатие Массивов - Краевые Случаи', () => {
  
  test('Массив с множеством дубликатов', () => {
    const arr: number[] = [];
    for (let i = 0; i < 200; i++) {
      arr.push(42); // Одно и то же число 200 раз
    }
    
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Размер массива: ${arr.length}`);
    console.log(`  Исходная длина: ${originalLength} символов`);
    console.log(`  Сжатая длина: ${compressedLength} символов`);
    console.log(`  Коэффициент сжатия: ${compressionRatio.toFixed(4)}`);
    console.log(`  Сериализовано: "${serialized}"`);
    
    // Сравниваем отсортированные массивы, так как реализация сортирует при сериализации/десериализации
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });

  test('Массив с последовательными числами', () => {
    const arr: number[] = [];
    for (let i = 1; i <= 100; i++) {
      arr.push(i);
    }
    
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Размер массива: ${arr.length}`);
    console.log(`  Исходная длина: ${originalLength} символов`);
    console.log(`  Сжатая длина: ${compressedLength} символов`);
    console.log(`  Коэффициент сжатия: ${compressionRatio.toFixed(4)}`);
    console.log(`  Сериализовано: "${serialized}"`);
    
    // Сравниваем отсортированные массивы, так как реализация сортирует при сериализации/десериализации
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });

  test('Массив с максимальным разбросом (1 и 300)', () => {
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
    
    console.log(`  Размер массива: ${arr.length}`);
    console.log(`  Исходная длина: ${originalLength} символов`);
    console.log(`  Сжатая длина: ${compressedLength} символов`);
    console.log(`  Коэффициент сжатия: ${compressionRatio.toFixed(4)}`);
    console.log(`  Сериализовано: "${serialized}"`);
    
    // Сравниваем отсортированные массивы, так как реализация сортирует при сериализации/десериализации
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });

  test('Обратный порядок (должен обрабатывать сортировку)', () => {
    const arr: number[] = [];
    for (let i = 100; i >= 1; i--) {
      arr.push(i);
    }
    
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Размер массива: ${arr.length}`);
    console.log(`  Исходная длина: ${originalLength} символов`);
    console.log(`  Сжатая длина: ${compressedLength} символов`);
    console.log(`  Коэффициент сжатия: ${compressionRatio.toFixed(4)}`);
    console.log(`  Сериализовано: "${serialized}"`);
    
    // Сравниваем отсортированные массивы, так как реализация сортирует при сериализации/десериализации
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });

  test('Пустой массив', () => {
    const arr: number[] = [];
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    console.log(`  Размер массива: ${arr.length}`);
    console.log(`  Сериализовано: "${serialized}"`);
    
    expect(deserialized).toEqual(arr);
  });

  test('Массив с минимальной допустимой длиной (5)', () => {
    const arr = [1, 2, 3, 4, 5];
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Размер массива: ${arr.length}`);
    console.log(`  Исходная длина: ${originalLength} символов`);
    console.log(`  Сжатая длина: ${compressedLength} символов`);
    console.log(`  Коэффициент сжатия: ${compressionRatio.toFixed(4)}`);
    console.log(`  Сериализовано: "${serialized}"`);
    
    // Сравниваем отсортированные массивы, так как реализация сортирует при сериализации/десериализации
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });

  test('Массив с максимальной допустимой длиной (1000)', () => {
    const arr = createRandomArray(1000);
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Размер массива: ${arr.length}`);
    console.log(`  Исходная длина: ${originalLength} символов`);
    console.log(`  Сжатая длина: ${compressedLength} символов`);
    console.log(`  Коэффициент сжатия: ${compressionRatio.toFixed(4)}`);
    console.log(`  Сериализовано: "${serialized}"`);
    
    // Сравниваем отсортированные массивы, так как реализация сортирует при сериализации/десериализации
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });

  test('Массив только с минимальными значениями (1)', () => {
    const arr: number[] = [];
    for (let i = 0; i < 100; i++) {
      arr.push(1);
    }
    
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Размер массива: ${arr.length}`);
    console.log(`  Исходная длина: ${originalLength} символов`);
    console.log(`  Сжатая длина: ${compressedLength} символов`);
    console.log(`  Коэффициент сжатия: ${compressionRatio.toFixed(4)}`);
    console.log(`  Сериализовано: "${serialized}"`);
    
    // Сравниваем отсортированные массивы, так как реализация сортирует при сериализации/десериализации
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
  });

  test('Массив только с максимальными значениями (300)', () => {
    const arr: number[] = [];
    for (let i = 0; i < 100; i++) {
      arr.push(300);
    }
    
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Размер массива: ${arr.length}`);
    console.log(`  Исходная длина: ${originalLength} символов`);
    console.log(`  Сжатая длина: ${compressedLength} символов`);
    console.log(`  Коэффициент сжатия: ${compressionRatio.toFixed(4)}`);
    console.log(`  Сериализовано: "${serialized}"`);
    
    // Сравниваем отсортированные массивы, так как реализация сортирует при сериализации/десериализации
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
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
    
    // Убеждаемся, что среднее время разумное (менее 10 мс на операцию)
    expect(avgTime).toBeLessThan(10);
  });

  test('Сжатие большого массива', () => {
    const arr = createRandomArray(1000);
    const serialized = serialize(arr);
    const deserialized = deserialize(serialized);
    
    const originalLength = JSON.stringify(arr).length;
    const compressedLength = serialized.length;
    const compressionRatio = compressedLength / originalLength;
    
    console.log(`  Размер массива: ${arr.length}`);
    console.log(`  Исходная длина: ${originalLength} символов`);
    console.log(`  Сжатая длина: ${compressedLength} символов`);
    console.log(`  Коэффициент сжатия: ${compressionRatio.toFixed(4)}`);
    console.log(`  Сериализовано: "${serialized}"`);
    
    const sortedOriginal = [...arr].sort((a, b) => a - b);
    const sortedDeserialized = [...deserialized].sort((a, b) => a - b);
    expect(sortedDeserialized).toEqual(sortedOriginal);
    expect(compressionRatio).toBeLessThan(0.5);
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
    
    // Проверяем, что все значения в допустимом диапазоне
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

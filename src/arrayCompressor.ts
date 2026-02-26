/**
 * Array Compressor - Реализация на TypeScript
 * 
 * Сжимает массивы целых чисел (1-300) с использованием комбинаторного кодирования в Base94.
 * Поддерживает массивы длиной от 5 до 1000 элементов.
 */

// === КОНСТАНТЫ ===

/**
 * Алфавит Base94, содержащий ASCII символы 33-126
 */
export const ALPHABET: string = Array.from({ length: 94 }, (_, i) => String.fromCharCode(i + 33)).join('');

/**
 * Обратное отображение символов в их значения BigInt
 */
export const CHAR_MAP: Record<string, bigint> = (() => {
  const map: Record<string, bigint> = {};
  for (let i = 0; i < ALPHABET.length; i++) {
    map[ALPHABET[i]] = BigInt(i);
  }
  return map;
})();

/**
 * Основание системы счисления для кодирования (94)
 */
export const BASE: bigint = 94n;

/**
 * Максимальное допустимое значение в массивах (300)
 */
export const MAX_VAL: bigint = 300n;

/**
 * Минимальная длина массива (5)
 */
export const MIN_LEN: bigint = 5n;

// === МАТЕМАТИЧЕСКИЕ ФУНКЦИИ ===

/**
 * Вычисляет биномиальный коэффициент nCr (n выбрать k)
 * 
 * @param n - Общее количество элементов
 * @param k - Количество выбираемых элементов
 * @returns Биномиальный коэффициент в виде BigInt
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
 * Вычисляет размер корзины для массивов длиной n
 * 
 * @param n - Длина массива
 * @returns Размер корзины в виде BigInt
 */
export function getBucketSize(n: bigint): bigint {
  return nCr(MAX_VAL + n - 1n, n);
}

// === СЕРИАЛИЗАЦИЯ ===

/**
 * Сериализует массив чисел в сжатую строку Base94
 * 
 * @param nums - Массив чисел для сериализации (значения 1-300, длина 5-1000)
 * @returns Сжатое строковое представление в Base94
 */
export function serialize(nums: number[]): string {
  if (!nums || nums.length === 0) return "";
  
  const sorted = [...nums].sort((a, b) => a - b);
  const n = BigInt(sorted.length);

  // 1. Вычисляем смещение для массивов >= MIN_LEN (5)
  let offset = 0n;
  // Цикл от MIN_LEN (5) до n-1
  for (let k = MIN_LEN; k < n; k++) {
    offset += getBucketSize(k);
  }

  // 2. Вычисляем индекс внутри корзины
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

  // 3. Преобразуем в строку Base94
  if (fullIndex === 0n) return ALPHABET[0];
  
  let res = "";
  while (fullIndex > 0n) {
    res = ALPHABET[Number(fullIndex % BASE)] + res;
    fullIndex /= BASE;
  }
  
  return res;
}

// === ДЕСЕРИАЛИЗАЦИЯ ===

/**
 * Десериализует строку Base94 обратно в массив чисел
 * 
 * @param s - Строка Base94 для десериализации
 * @returns Массив чисел (отсортированный, значения 1-300)
 */
export function deserialize(s: string): number[] {
  if (!s) return [];

  // Парсим строку Base94 в BigInt
  let fullIndex = 0n;
  for (const char of s) {
    fullIndex = fullIndex * BASE + CHAR_MAP[char];
  }

  // 1. Определяем длину массива, находя правильную корзину
  let n = MIN_LEN;
  let offset = 0n;
  let size = getBucketSize(n);
  
  // Пока число больше текущей корзины, переходим к следующей
  while (fullIndex >= offset + size) {
    offset += size;
    n++;
    size = getBucketSize(n);
  }

  let index = fullIndex - offset;
  const nums: number[] = [];

  // 2. Декодируем числа с помощью бинарного поиска
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

import { serialize, deserialize } from './arrayCompressor';
import './styles.css';

// DOM элементы
const inputArray = document.getElementById('inputArray') as HTMLTextAreaElement;
const originalOutput = document.getElementById('originalOutput') as HTMLDivElement;
const compressedOutput = document.getElementById('compressedOutput') as HTMLDivElement;
const decompressedOutput = document.getElementById('decompressedOutput') as HTMLDivElement;
const messageDiv = document.getElementById('message') as HTMLDivElement;
const originalLengthEl = document.getElementById('originalLength') as HTMLDivElement;
const compressedLengthEl = document.getElementById('compressedLength') as HTMLDivElement;
const compressionRatioEl = document.getElementById('compressionRatio') as HTMLDivElement;
const compressionPercentageEl = document.getElementById('compressionPercentage') as HTMLDivElement;
const ratioCard = document.getElementById('ratioCard') as HTMLDivElement;
const percentageCard = document.getElementById('percentageCard') as HTMLDivElement;

// Функция отображения сообщения
function showMessage(text: string, type: string): void {
    messageDiv.innerHTML = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
}

// Функция очистки сообщения
function clearMessage(): void {
    messageDiv.style.display = 'none';
}

// Проверяем, что ввод содержит только числовые символы
function validateNumericInput(input: string): string | null {
    // Удаляем все пробелы и запятые для проверки фактического содержимого
    const cleanInput = input.replace(/[\s,]+/g, '');
    
    if (cleanInput === '') {
        return null; // Пустой ввод обрабатывается в другом месте
    }
    
    // Проверяем, содержит ли ввод только цифры (0-9)
    if (!/^\d+$/.test(cleanInput)) {
        // Находим и сообщаем о нечисловых символах
        const nonNumericChars = cleanInput.replace(/\d/g, '');
        const uniqueChars = [...new Set(nonNumericChars.split(''))].join(', ');
        return `❌ Ввод содержит недопустимые символы: "${uniqueChars}". Разрешены только цифры (0-9).`;
    }
    
    return null; // Ввод корректен
}

// Парсим входной массив
function parseInput(input: string): number[] {
    // Разделяем по запятой или пробелу, фильтруем пустые строки
    const numbers = input
        .split(/[,\s]+/)
        .map(s => s.trim())
        .filter(s => s !== '')
        .map(s => parseInt(s, 10));

    return numbers.filter(n => !isNaN(n));
}

// Проверяем входной массив
function validateArray(arr: number[]): string[] {
    const errors: string[] = [];

    if (arr.length === 0) {
        errors.push('❌ Массив пуст. Пожалуйста, введите числа.');
    }

    if (arr.length < 5) {
        errors.push(`❌ Длина массива (${arr.length}) меньше минимальной (5). Нужно ещё ${5 - arr.length} чисел.`);
    }

    if (arr.length > 1000) {
        errors.push(`❌ Длина массива (${arr.length}) превышает максимальную (1000). Удалите ${arr.length - 1000} чисел.`);
    }

    const invalidNumbers = arr.filter(n => n < 1 || n > 300);
    if (invalidNumbers.length > 0) {
        const belowMin = invalidNumbers.filter(n => n < 1);
        const aboveMax = invalidNumbers.filter(n => n > 300);

        if (belowMin.length > 0) {
            errors.push(`❌ Числа меньше минимума (1): ${belowMin.slice(0, 3).join(', ')}${belowMin.length > 3 ? '...' : ''}`);
        }

        if (aboveMax.length > 0) {
            errors.push(`❌ Числа больше максимума (300): ${aboveMax.slice(0, 3).join(', ')}${aboveMax.length > 3 ? '...' : ''}`);
        }
    }

    // Проверяем дубликаты (информационно, не ошибка)
    const uniqueNumbers = new Set(arr);
    if (uniqueNumbers.size < arr.length) {
        errors.push(`ℹ️ Примечание: Массив содержит ${arr.length - uniqueNumbers.size} дубликатов. Дубликаты разрешены.`);
    }

    return errors;
}

// Форматируем массив для отображения
function formatArray(arr: number[]): string {
    if (arr.length === 0) return 'Пустой массив';
    return arr.join(', ');
}

// Обновляем статистику
function updateStatistics(originalStr: string, compressedStr: string): void {
    const originalLen = originalStr.length;
    const compressedLen = compressedStr.length;

    originalLengthEl.textContent = originalLen.toString();
    compressedLengthEl.textContent = compressedLen.toString();

    if (originalLen > 0) {
        const ratio = (originalLen / compressedLen).toFixed(2);
        const percentage = ((1 - compressedLen / originalLen) * 100).toFixed(1);

        compressionRatioEl.textContent = `${ratio}:1`;
        compressionPercentageEl.textContent = `${percentage}%`;

        // Цветовое кодирование на основе сжатия
        if (parseFloat(percentage) > 0) {
            ratioCard.className = 'stat-card good';
            percentageCard.className = 'stat-card good';
        } else {
            ratioCard.className = 'stat-card bad';
            percentageCard.className = 'stat-card bad';
        }
    } else {
        compressionRatioEl.textContent = '0:1';
        compressionPercentageEl.textContent = '0%';
        ratioCard.className = 'stat-card';
        percentageCard.className = 'stat-card';
    }
}

// Сжимаем массив
function compressArray(): void {
    clearMessage();

    const input = inputArray.value;

    // Проверяем, что ввод содержит только числовые символы
    const numericValidationError = validateNumericInput(input);
    if (numericValidationError) {
        showMessage(numericValidationError, 'error');
        return;
    }

    const arr = parseInput(input);

    const messages = validateArray(arr);
    console.log(messages)
    const errors = messages.filter(m => m.startsWith('❌'));
    const infos = messages.filter(m => m.startsWith('ℹ️'));

    if (errors.length > 0) {
        showMessage(errors.join('<br>'), 'error');
        return;
    }

    if (infos.length > 0) {
        showMessage(infos.join('<br>'), 'info');
    }

    try {
        // Сортируем и отображаем оригинал
        const sorted = [...arr].sort((a, b) => a - b);
        originalOutput.textContent = formatArray(sorted);

        // Сжимаем
        const compressed = serialize(arr);
        compressedOutput.textContent = compressed;

        // Очищаем декомпрессированные данные пока
        decompressedOutput.textContent = '';

        // Обновляем статистику
        const originalStr = sorted.join(', ');
        updateStatistics(originalStr, compressed);

        showMessage('✅ Сжатие выполнено успешно!', 'success');
    } catch (error) {
        showMessage('❌ Ошибка сжатия: ' + (error as Error).message, 'error');
        console.error(error);
    }
}

// Декомпрессируем массив
function decompressArray(): void {
    clearMessage();

    const compressed = compressedOutput.textContent.trim();

    if (!compressed) {
        showMessage('❌ Нет данных для распаковки. Пожалуйста, сначала сожмите массив.', 'error');
        return;
    }

    try {
        const decompressed = deserialize(compressed);
        decompressedOutput.textContent = formatArray(decompressed);

        // Проверяем
        const original = parseInput(originalOutput.textContent);
        const match = JSON.stringify(original) === JSON.stringify(decompressed);

        if (match) {
            showMessage('✅ Распаковка выполнена успешно! Данные проверены.', 'success');
        } else {
            showMessage('⚠️ Распаковка завершена, но обнаружено несоответствие данных.', 'info');
        }
    } catch (error) {
        showMessage('❌ Ошибка распаковки: ' + (error as Error).message, 'error');
        console.error(error);
    }
}

// Генерируем случайный массив
function generateRandom(): void {
    const length = Math.floor(Math.random() * 95) + 5; // 5-100
    const arr: number[] = [];

    for (let i = 0; i < length; i++) {
        arr.push(Math.floor(Math.random() * 300) + 1);
    }

    inputArray.value = arr.join(', ');
    showMessage(`🎲 Сгенерирован случайный массив из ${length} элементов`, 'info');
}

// Тест полного цикла
function roundTripTest(): void {
    clearMessage();

    const input = inputArray.value;

    // Проверяем, что ввод содержит только числовые символы
    const numericValidationError = validateNumericInput(input);
    if (numericValidationError) {
        showMessage(numericValidationError, 'error');
        return;
    }

    const arr = parseInput(input);

    const messages = validateArray(arr);
    const errors = messages.filter(m => m.startsWith('❌'));
    const infos = messages.filter(m => m.startsWith('ℹ️'));

    if (errors.length > 0) {
        showMessage(errors.join('<br>'), 'error');
        return;
    }

    if (infos.length > 0) {
        showMessage(infos.join('<br>'), 'info');
    }

    try {
        // Сжимаем
        const compressed = serialize(arr);
        // Декомпрессируем
        const decompressed = deserialize(compressed);

        // Сортируем оба для сравнения
        const sortedOriginal = [...arr].sort((a, b) => a - b);
        const sortedDecompressed = [...decompressed].sort((a, b) => a - b);

        // Отображаем результаты
        originalOutput.textContent = formatArray(sortedOriginal);
        compressedOutput.textContent = compressed;
        decompressedOutput.textContent = formatArray(sortedDecompressed);

        // Обновляем статистику
        const originalStr = sortedOriginal.join(', ');
        updateStatistics(originalStr, compressed);

        // Проверяем
        const match = JSON.stringify(sortedOriginal) === JSON.stringify(sortedDecompressed);

        if (match) {
            showMessage('✅ Тест полного цикла пройден! Исходный и распакованный массивы совпадают.', 'success');
        } else {
            showMessage('❌ Тест полного цикла не пройден! Массивы не совпадают.', 'error');
        }
    } catch (error) {
        showMessage('❌ Ошибка теста полного цикла: ' + (error as Error).message, 'error');
        console.error(error);
    }
}

// Загружаем предустановленные тестовые случаи
function loadPreset(preset: string): void {
    let arr: number[] = [];

    switch (preset) {
        case 'minimal':
            arr = [1, 2, 3, 4, 5];
            break;
        case 'userExample':
            arr = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45];
            break;
        case 'random50':
            for (let i = 0; i < 50; i++) {
                arr.push(Math.floor(Math.random() * 300) + 1);
            }
            break;
        case 'random100':
            for (let i = 0; i < 100; i++) {
                arr.push(Math.floor(Math.random() * 300) + 1);
            }
            break;
        case 'random200':
            for (let i = 0; i < 200; i++) {
                arr.push(Math.floor(Math.random() * 300) + 1);
            }
            break;
        case 'large':
            for (let i = 0; i < 500; i++) {
                arr.push(Math.floor(Math.random() * 300) + 1);
            }
            break;
    }

    inputArray.value = arr.join(', ');
    showMessage(`📋 Загружен пресет: ${preset} (${arr.length} элементов)`, 'info');

    // Очищаем выводы
    originalOutput.textContent = '';
    compressedOutput.textContent = '';
    decompressedOutput.textContent = '';
    originalLengthEl.textContent = '0';
    compressedLengthEl.textContent = '0';
    compressionRatioEl.textContent = '0:1';
    compressionPercentageEl.textContent = '0%';
}

// Инициализация с примером
window.onload = function (): void {
    loadPreset('userExample');
};

// Экспортируем функции в window для HTML onclick обработчиков
(window as any).compressArray = compressArray;
(window as any).decompressArray = decompressArray;
(window as any).generateRandom = generateRandom;
(window as any).roundTripTest = roundTripTest;
(window as any).loadPreset = loadPreset;

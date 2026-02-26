import { serialize, deserialize } from './arrayCompressor';
import './styles.css';

// DOM Elements
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

// Show message function
function showMessage(text: string, type: string): void {
    messageDiv.innerHTML = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
}

// Clear message function
function clearMessage(): void {
    messageDiv.style.display = 'none';
}

// Validate that input contains only numeric characters
function validateNumericInput(input: string): string | null {
    // Remove all whitespace and commas to check the actual content
    const cleanInput = input.replace(/[\s,]+/g, '');
    
    if (cleanInput === '') {
        return null; // Empty input is handled elsewhere
    }
    
    // Check if the input contains only digits (0-9)
    if (!/^\d+$/.test(cleanInput)) {
        // Find and report non-numeric characters
        const nonNumericChars = cleanInput.replace(/\d/g, '');
        const uniqueChars = [...new Set(nonNumericChars.split(''))].join(', ');
        return `❌ Ввод содержит недопустимые символы: "${uniqueChars}". Разрешены только цифры (0-9).`;
    }
    
    return null; // Input is valid
}

// Parse input array
function parseInput(input: string): number[] {
    // Split by comma or space, filter empty strings
    const numbers = input
        .split(/[,\s]+/)
        .map(s => s.trim())
        .filter(s => s !== '')
        .map(s => parseInt(s, 10));

    return numbers.filter(n => !isNaN(n));
}

// Validate input array
function validateArray(arr: number[]): string[] {
    const errors: string[] = [];

    if (arr.length === 0) {
        errors.push('❌ Array is empty. Please enter some numbers.');
    }

    if (arr.length < 5) {
        errors.push(`❌ Array length (${arr.length}) is less than minimum (5). Need at least ${5 - arr.length} more number${5 - arr.length > 1 ? 's' : ''}.`);
    }

    if (arr.length > 1000) {
        errors.push(`❌ Array length (${arr.length}) exceeds maximum (1000). Remove ${arr.length - 1000} number${arr.length - 1000 > 1 ? 's' : ''}.`);
    }

    const invalidNumbers = arr.filter(n => n < 1 || n > 300);
    if (invalidNumbers.length > 0) {
        const belowMin = invalidNumbers.filter(n => n < 1);
        const aboveMax = invalidNumbers.filter(n => n > 300);

        if (belowMin.length > 0) {
            errors.push(`❌ Numbers below minimum (1): ${belowMin.slice(0, 3).join(', ')}${belowMin.length > 3 ? '...' : ''}`);
        }

        if (aboveMax.length > 0) {
            errors.push(`❌ Numbers above maximum (300): ${aboveMax.slice(0, 3).join(', ')}${aboveMax.length > 3 ? '...' : ''}`);
        }
    }

    // Check for duplicates (informational, not an error)
    const uniqueNumbers = new Set(arr);
    if (uniqueNumbers.size < arr.length) {
        errors.push(`ℹ️ Note: Array contains ${arr.length - uniqueNumbers.size} duplicate(s). Duplicates are allowed.`);
    }

    return errors;
}

// Format array for display
function formatArray(arr: number[]): string {
    if (arr.length === 0) return 'Empty array';
    return arr.join(', ');
}

// Update statistics
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

        // Color coding based on compression
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

// Compress array
function compressArray(): void {
    clearMessage();

    const input = inputArray.value;

    // Validate that input contains only numeric characters
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
        // Sort and display original
        const sorted = [...arr].sort((a, b) => a - b);
        originalOutput.textContent = formatArray(sorted);

        // Compress
        const compressed = serialize(arr);
        compressedOutput.textContent = compressed;

        // Clear decompressed for now
        decompressedOutput.textContent = '';

        // Update statistics
        const originalStr = sorted.join(', ');
        updateStatistics(originalStr, compressed);

        showMessage('✅ Compression successful!', 'success');
    } catch (error) {
        showMessage('❌ Compression error: ' + (error as Error).message, 'error');
        console.error(error);
    }
}

// Decompress array
function decompressArray(): void {
    clearMessage();

    const compressed = compressedOutput.textContent.trim();

    if (!compressed) {
        showMessage('❌ No compressed data to decompress. Please compress an array first.', 'error');
        return;
    }

    try {
        const decompressed = deserialize(compressed);
        decompressedOutput.textContent = formatArray(decompressed);

        // Verify
        const original = parseInput(originalOutput.textContent);
        const match = JSON.stringify(original) === JSON.stringify(decompressed);

        if (match) {
            showMessage('✅ Decompression successful! Data verified.', 'success');
        } else {
            showMessage('⚠️ Decompression completed but data mismatch detected.', 'info');
        }
    } catch (error) {
        showMessage('❌ Decompression error: ' + (error as Error).message, 'error');
        console.error(error);
    }
}

// Generate random array
function generateRandom(): void {
    const length = Math.floor(Math.random() * 95) + 5; // 5-100
    const arr: number[] = [];

    for (let i = 0; i < length; i++) {
        arr.push(Math.floor(Math.random() * 300) + 1);
    }

    inputArray.value = arr.join(', ');
    showMessage(`🎲 Generated random array with ${length} elements`, 'info');
}

// Round trip test
function roundTripTest(): void {
    clearMessage();

    const input = inputArray.value;

    // Validate that input contains only numeric characters
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
        // Compress
        const compressed = serialize(arr);
        // Decompress
        const decompressed = deserialize(compressed);

        // Sort both for comparison
        const sortedOriginal = [...arr].sort((a, b) => a - b);
        const sortedDecompressed = [...decompressed].sort((a, b) => a - b);

        // Display results
        originalOutput.textContent = formatArray(sortedOriginal);
        compressedOutput.textContent = compressed;
        decompressedOutput.textContent = formatArray(sortedDecompressed);

        // Update statistics
        const originalStr = sortedOriginal.join(', ');
        updateStatistics(originalStr, compressed);

        // Verify
        const match = JSON.stringify(sortedOriginal) === JSON.stringify(sortedDecompressed);

        if (match) {
            showMessage('✅ Round-trip test passed! Original and decompressed arrays match.', 'success');
        } else {
            showMessage('❌ Round-trip test failed! Arrays do not match.', 'error');
        }
    } catch (error) {
        showMessage('❌ Round-trip test error: ' + (error as Error).message, 'error');
        console.error(error);
    }
}

// Load preset test cases
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
    showMessage(`📋 Loaded preset: ${preset} (${arr.length} elements)`, 'info');

    // Clear outputs
    originalOutput.textContent = '';
    compressedOutput.textContent = '';
    decompressedOutput.textContent = '';
    originalLengthEl.textContent = '0';
    compressedLengthEl.textContent = '0';
    compressionRatioEl.textContent = '0:1';
    compressionPercentageEl.textContent = '0%';
}

// Initialize with example
window.onload = function (): void {
    loadPreset('userExample');
};

// Expose functions to window for HTML onclick handlers
(window as any).compressArray = compressArray;
(window as any).decompressArray = decompressArray;
(window as any).generateRandom = generateRandom;
(window as any).roundTripTest = roundTripTest;
(window as any).loadPreset = loadPreset;

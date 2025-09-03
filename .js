// calculator.js

// Variables to store calculator state
let currentInput = '0';
let calculation = '';
let result = 0;
let memory = 0;
let lastButtonWasOperator = false;
let calculationHistory = [];

// DOM elements
const resultElement = document.getElementById('result');
const calculationElement = document.getElementById('calculation');
const historyContainer = document.getElementById('history-container');

// Initialize calculator
function initCalculator() {
    updateDisplay();
    setupEventListeners();
}

// Update the display
function updateDisplay() {
    resultElement.textContent = formatNumber(currentInput);
    calculationElement.textContent = calculation;
}

// Format number with commas for thousands
function formatNumber(num) {
    if (num === 'Error') return num;
    
    // Check if it's a number
    if (isNaN(num) || !isFinite(num)) return num;
    
    // Convert to string and split integer and decimal parts
    const parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    return parts.join('.');
}

// Append number to current input
function appendNumber(number) {
    if (currentInput === '0' || lastButtonWasOperator) {
        currentInput = number.toString();
        lastButtonWasOperator = false;
    } else {
        // Prevent input from getting too long
        if (currentInput.length < 12) {
            currentInput += number.toString();
        }
    }
    updateDisplay();
}

// Append decimal point
function appendDecimal() {
    if (lastButtonWasOperator) {
        currentInput = '0.';
        lastButtonWasOperator = false;
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

// Append operator to calculation
function appendOperator(op) {
    if (lastButtonWasOperator) {
        // Replace the last operator
        calculation = calculation.slice(0, -1) + op;
    } else {
        calculation += currentInput + op;
        lastButtonWasOperator = true;
    }
    updateDisplay();
}

// Perform calculation
function calculate() {
    if (lastButtonWasOperator) {
        calculation = calculation.slice(0, -1);
    } else {
        calculation += currentInput;
    }
    
    try {
        // Use Function constructor for calculation (safe in this context)
        result = Function('return ' + calculation)();
        
        // Round to avoid floating point precision issues
        result = Math.round(result * 100000000) / 100000000;
        
        // Add to history
        addToHistory(calculation + ' = ' + result);
        
        // Reset for next calculation
        currentInput = result.toString();
        calculation = '';
        lastButtonWasOperator = false;
        updateDisplay();
    } catch (error) {
        showError();
    }
}

// Clear all
function clearAll() {
    currentInput = '0';
    calculation = '';
    lastButtonWasOperator = false;
    updateDisplay();
}

// Clear entry
function clearEntry() {
    currentInput = '0';
    updateDisplay();
}

// Backspace function
function backspace() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

// Memory functions
function memoryStore() {
    memory = parseFloat(currentInput);
}

function memoryRecall() {
    currentInput = memory.toString();
    updateDisplay();
}

function memoryAdd() {
    memory += parseFloat(currentInput);
}

function memorySubtract() {
    memory -= parseFloat(currentInput);
}

function memoryClear() {
    memory = 0;
}

// Percentage function
function calculatePercentage() {
    try {
        const value = parseFloat(currentInput);
        currentInput = (value / 100).toString();
        updateDisplay();
    } catch (error) {
        showError();
    }
}

// Toggle positive/negative
function toggleSign() {
    if (currentInput !== '0') {
        if (currentInput.startsWith('-')) {
            currentInput = currentInput.substring(1);
        } else {
            currentInput = '-' + currentInput;
        }
        updateDisplay();
    }
}

// Add calculation to history
function addToHistory(calculationText) {
    calculationHistory.unshift(calculationText);
    if (calculationHistory.length > 5) {
        calculationHistory.pop();
    }
    
    // Update history display
    updateHistoryDisplay();
}

// Update history display
function updateHistoryDisplay() {
    historyContainer.innerHTML = '';
    calculationHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.textContent = item;
        historyContainer.appendChild(historyItem);
    });
}

// Show error message
function showError() {
    resultElement.textContent = 'Error';
    setTimeout(() => {
        currentInput = '0';
        calculation = '';
        updateDisplay();
    }, 1000);
}

// Keyboard support
function setupEventListeners() {
    document.addEventListener('keydown', function(event) {
        if (/[0-9]/.test(event.key)) {
            appendNumber(parseInt(event.key));
        } else if (event.key === '.') {
            appendDecimal();
        } else if (['+', '-', '*', '/'].includes(event.key)) {
            appendOperator(event.key);
        } else if (event.key === 'Enter' || event.key === '=') {
            calculate();
        } else if (event.key === 'Escape') {
            clearAll();
        } else if (event.key === 'Backspace') {
            backspace();
        } else if (event.key === '%') {
            calculatePercentage();
        } else if (event.key === '_' || event.key === '±') {
            toggleSign();
        }
    });
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', initCalculator);
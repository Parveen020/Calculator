class Calculator {
  // Initialize calculator with DOM elements and memory
  constructor() {
    this.previousOperandElement = document.querySelector(".previous-operand");
    this.currentOperandElement = document.querySelector(".current-operand");
    this.memoryDisplayElement = document.querySelector(".memory-display");
    this.memoryValue = 0;
    this.clear();
    this.setupEventListeners();
  }

  // Reset calculator to initial state
  clear() {
    this.currentOperand = "0";
    this.previousOperand = "";
    this.operation = undefined;
  }

  // Remove last digit from current operand
  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
    if (this.currentOperand === "") this.currentOperand = "0";
  }

  // Add digit or decimal point to current operand
  appendNumber(number) {
    // Prevent multiple decimal points
    if (number === "." && this.currentOperand.includes(".")) return;
    // Replace leading zero unless adding decimal point
    if (this.currentOperand === "0" && number !== ".") {
      this.currentOperand = number;
    } else {
      this.currentOperand = this.currentOperand.toString() + number;
    }
  }

  // Handle basic arithmetic operations
  chooseOperation(operation) {
    if (this.currentOperand === "") return;
    if (this.previousOperand !== "") {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "0";
  }

  // Perform calculation based on selected operation
  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;

    // Handle different arithmetic operations
    switch (this.operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "×":
        computation = prev * current;
        break;
      case "÷":
        if (current === 0) {
          alert("Cannot divide by zero!");
          this.clear();
          return;
        }
        computation = prev / current;
        break;
      default:
        return;
    }

    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = "";
  }

  // Handle special mathematical functions
  calculateSpecialFunction(operation) {
    const current = parseFloat(this.currentOperand);
    if (isNaN(current)) return;

    switch (operation) {
      case "√":
        if (current < 0) {
          alert("Cannot calculate square root of negative number!");
          return;
        }
        this.currentOperand = Math.sqrt(current);
        break;
      case "%":
        this.currentOperand = current / 100;
        break;
      case "x²":
        this.currentOperand = current * current;
        break;
      case "1/x":
        if (current === 0) {
          alert("Cannot divide by zero!");
          return;
        }
        this.currentOperand = 1 / current;
        break;
    }
  }

  // Handle memory operations (MC, MR, M+, M-)
  handleMemory(operation) {
    const current = parseFloat(this.currentOperand);

    switch (operation) {
      case "MC": // Memory Clear
        this.memoryValue = 0;
        break;
      case "MR": // Memory Recall
        this.currentOperand = this.memoryValue.toString();
        break;
      case "M+": // Memory Add
        this.memoryValue += isNaN(current) ? 0 : current;
        break;
      case "M-": // Memory Subtract
        this.memoryValue -= isNaN(current) ? 0 : current;
        break;
    }

    this.memoryDisplayElement.textContent = `Memory: ${this.memoryValue}`;
  }

  // Update calculator display
  updateDisplay() {
    this.currentOperandElement.textContent = this.currentOperand;
    if (this.operation != null) {
      this.previousOperandElement.textContent = `${this.previousOperand} ${this.operation}`;
    } else {
      this.previousOperandElement.textContent = "";
    }
  }

  // Set up event listeners for buttons and keyboard input
  setupEventListeners() {
    // Number button listeners
    document.querySelectorAll(".number").forEach((button) => {
      button.addEventListener("click", () => {
        this.appendNumber(button.textContent);
        this.updateDisplay();
      });
    });

    // Operator button listeners
    document.querySelectorAll(".operator").forEach((button) => {
      button.addEventListener("click", () => {
        this.chooseOperation(button.textContent);
        this.updateDisplay();
      });
    });

    // Function button listeners
    document.querySelectorAll(".function-button").forEach((button) => {
      button.addEventListener("click", () => {
        this.calculateSpecialFunction(button.textContent);
        this.updateDisplay();
      });
    });

    // Memory button listeners
    document.querySelectorAll(".memory-button").forEach((button) => {
      button.addEventListener("click", () => {
        this.handleMemory(button.textContent);
        this.updateDisplay();
      });
    });

    // Equals button listener
    document.querySelector(".equals").addEventListener("click", () => {
      this.compute();
      this.updateDisplay();
    });

    // Clear button listener
    document.querySelector(".clear").addEventListener("click", () => {
      this.clear();
      this.updateDisplay();
    });

    // Delete button listener
    document.querySelector(".delete").addEventListener("click", () => {
      this.delete();
      this.updateDisplay();
    });

    // Keyboard input support
    document.addEventListener("keydown", (e) => {
      // Number and decimal point inputs
      if ((e.key >= "0" && e.key <= "9") || e.key === ".") {
        this.appendNumber(e.key);
      }
      // Basic operators
      else if (e.key === "+" || e.key === "-") {
        this.chooseOperation(e.key);
      }
      // Multiplication
      else if (e.key === "*") {
        this.chooseOperation("×");
      }
      // Division
      else if (e.key === "/") {
        e.preventDefault();
        this.chooseOperation("÷");
      }
      // Enter/equals for computation
      else if (e.key === "Enter" || e.key === "=") {
        this.compute();
      }
      // Backspace for delete
      else if (e.key === "Backspace") {
        this.delete();
      }
      // Escape for clear
      else if (e.key === "Escape") {
        this.clear();
      }
      this.updateDisplay();
    });
  }
}

// Initialize calculator when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const calculator = new Calculator();
});

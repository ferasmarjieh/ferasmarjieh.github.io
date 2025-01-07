/* JavaScript File (script.js) */
function calculate(operation) {
    const num1 = document.getElementById('num1').value.trim(); // Get the value of the first input field and trim whitespace
    const num2 = document.getElementById('num2').value.trim(); // Get the value of the second input field and trim whitespace
    const resultDiv = document.getElementById('result'); // Reference the result div for displaying output

    if (isNaN(num1) || isNaN(num2) || num1 === '' || num2 === '') { // Check if inputs are not valid numbers
        resultDiv.textContent = 'Please enter valid numbers in both fields.'; // Show an error message if inputs are invalid
        return; // Stop the function execution
    }

    const number1 = parseFloat(num1); // Convert the first input to a number
    const number2 = parseFloat(num2); // Convert the second input to a number
    let result; // Variable to store the result

    switch (operation) { // Determine the operation to perform
        case 'add':
            result = number1 + number2; // Perform addition
            break; // Exit the switch case
        case 'subtract':
            result = number1 - number2; // Perform subtraction
            break; // Exit the switch case
        case 'multiply':
            result = number1 * number2; // Perform multiplication
            break; // Exit the switch case
        case 'divide':
            if (number2 === 0) { // Check if attempting to divide by zero
                alert('You tried to divide by zero.'); // Show an alert message
                resultDiv.textContent = 'Division by zero is not allowed.'; // Show an error message in the result div
                return; // Stop the function execution
            }
            result = number1 / number2; // Perform division
            break; // Exit the switch case
        default:
            resultDiv.textContent = 'Unknown operation.'; // Show an error message if the operation is not recognized
            return; // Stop the function execution
    }

    resultDiv.textContent = `Result: ${result}`; // Display the result in the result div
}
/*____________________________________Input Regex_______________________________________*/

/**
 * @type {RegExp} - regex matches any string containing only letters (uppercase or lowercase) and specific german characters (Ä, ä, Ü, ü, Ö, ö, and ß)
 */
const regName1 = new RegExp('^[a-zA-ZäöüßÄÖÜ]+$');
/**
 * @type {RegExp} - regex matches any string containing  only letters (uppercase and lowercase), spaces, and specific german characters (Ä, ä, Ü, ü, Ö, ö, and ß)
 */
const regName2 = new RegExp('^[A-Za-zÄäÜüÖöß\\s]+$');
/**
 * @type {RegExp} - regex matches any string containing  only letters (uppercase and lowercase), spaces, and specific german characters (Ä, ä, Ü, ü, Ö, ö, and ß),
 * and does not contain consecutive spaces
 */
const regName3 = new RegExp('^(?!.* {2})[A-Za-zÄäÜüÖöß\\s]+$');
/**
 * @type {RegExp} - regex checks that the name starts with a letter (uppercase or lowercase) or a specific german characters (Ä, ä, Ü, ü, Ö, ö, and ß) and is
 * followed by any number of letters or specific german characters, separated by at least one space. It also ensures that there are no consecutive spaces in the name
 */
const regName4 = new RegExp('^(?!.* {2})[a-zA-ZÄäÜüÖö][a-zA-ZÄäÜüÖöß]*([ ]+[a-zA-ZÄäÜüÖö][a-zA-ZÄäÜüÖöß]*)+$');
/**
 * @type {RegExp} - regex matches any string that contains only digits (0-9) and the plus sign (+)
 */
const regPhone1 = new RegExp('^[0-9+]+$');
/**
 * @type {RegExp} - regex matches a string that starts with a digit or a plus sign, followed by zero or more digits or whitespace characters
 */
const regPhone2 = new RegExp('^[0-9+][0-9\\s]*$');
/**
 * @type {RegExp} - regex matches a string containing only digits and optional spaces or plus sign at the beginning, and does not contain two consecutive spaces
 */
const regPhone3 = new RegExp('^(?!.* {2})[0-9+][0-9\\s]*$');
/**
 * @type {RegExp} - regex matches a string with the following criteria: should start with a digit or a plus sign, should not contain two consecutive spaces,
 * should contain at least 9 digits or spaces
 */
const regPhone4 = new RegExp('^(?!.* {2})[0-9+][0-9\\s]{8,}$');
/**
 * @type {RegExp} - regex to validate email addresses. Matches a string containing alphanumeric characters, special characters(such as underscore, plus, and dot), 
 * and specific German characters (ä, Ä, ü, Ü, ö, Ö, and ß) in the username part. It also checks if the domain name contains alphanumeric characters, hyphens,
 *  and specific German characters (ß) and ends with a valid top-level domain (such as .com, .org, or .net). The email address must be between 3 and 30 characters
 */
const regEmail= new RegExp(`^[a-zA-Z0-9äÄüÜöÖß_.+-]{3,30}@[a-zA-Z0-9-ß]{3,9}\.[a-z]{2,3}$`);
/**
 * @type {RegExp} - regex matches any string that is at least 7 characters long
 */
const regPassword = new RegExp(`^.{7,}$`);
/**
 * @type {RegExp} - regex matches if input is not an empty string or only whitespace characters
 */
const regAddTask = new RegExp('/^$|\s+/');


/*__________________________________Input Objects Array____________________________________*/

/**
 * @typedef input
 * @type {Object} - Input object
 * @prop {String} inputID - ID of the input field
 * @prop {Number} inputlength - Min input length
 * @prop {Array.<RegExp>} regex - Array of regular expressions for the input field
 * @prop {String} errorReportID - ID of the error report element
 * @prop {Array.<String>} errorReportText - Array of error report texts
 * @prop {String} validReportText - Valid report text
 */
/**
 * Array of input objects for all inputs on the contact page
 * @type {Array.<input>}
 */
let contactInputs = [
    {
        'inputID' : 'inputName',
        'inputlength' : 2,
        'regex' : [regName1, regName2, regName3, regName4],
        'errorReportID' : 'nameError',
        'errorReportText' : ['error: enter first and lastname', 'error: first char must be a letter', 'error: only letters excepted', 'error: spaces in row are not excepted'],
        'validReportText' : 'valid firstname (secondname) lastname'
    },
    {
        'inputID' : 'inputEmail',
        'inputlength' : 7,
        'regex' : [regEmail, regEmail, regEmail, regEmail],
        'errorReportID' : 'emailError',
        'errorReportText' : ['error: email is not valid'],
        'validReportText' : 'valid email'
    },
    {
        'inputID' : 'inputPhone',
        'inputlength' : 9,
        'regex' : [regPhone1, regPhone2, regPhone3, regPhone4],
        'errorReportID' : 'phoneError',
        'errorReportText' : ['error: phone number of min 10 digits', 'error: first char must be a number or +', 'error: only numbers excepted', 'error: spaces in row are not excepted'],
        'validReportText' : 'valid phone number'
    }
];
/**
 * Array of input objects for all login inputs on the login page
 * @type {Array.<input>}
 */
let loginInputs = [
    {
        'inputID' : 'login_email_input',
        'inputlength' : 7,
        'regex' : [regEmail, regEmail, regEmail, regEmail],
        'errorReportID' : 'login_email_error',
        'errorReportText' : ['error: email is not valid'],
        'validReportText' : 'valid email'
    },
    {
        'inputID' : 'login_password_input',
        'inputlength' : 6,
        'regex' : [regPassword, regPassword, regPassword, regPassword],
        'errorReportID' : 'login_password_error',
        'errorReportText' : ['error: note password length (>6)'],
        'validReportText' : 'valid password'
    }
];
/**
 * Array of input objects for all signup inputs on the login page
 * @type {Array.<input>}
 */
let signupInputs = [
    {
        'inputID' : 'signup_name_input',
        'inputlength' : 2,
        'regex' : [regName1, regName2, regName3, regName4],
        'errorReportID' : 'signup_name_error',
        'errorReportText' : ['error: enter first and lastname', 'error: first char must be a letter', 'error: only letters excepted', 'error: spaces in row are not excepted'],
        'validReportText' : 'valid firstname (secondname) lastname'
    },
    {
        'inputID' : 'signup_email_input',
        'inputlength' : 7,
        'regex' : [regEmail, regEmail, regEmail, regEmail],
        'errorReportID' : 'signup_email_error',
        'errorReportText' : ['error: email is not valid'],
        'validReportText' : 'valid email'
    },
    {
        'inputID' : 'signup_password_input',
        'inputlength' : 6,
        'regex' : [regPassword, regPassword, regPassword, regPassword],
        'errorReportID' : 'signup_password_error',
        'errorReportText' : ['error: note password length (>6)'],
        'validReportText' : 'valid password'
    }
];
/**
 * Array of input objects for all forgot password inputs on the login page
 * @type {Array.<input>}
 */
let forgotPasswordInput = [
    {
        'inputID' : 'forgot_password_email_input',
        'inputlength' : 7,
        'regex' : [regEmail, regEmail, regEmail, regEmail],
        'errorReportID' : 'forgot_password_email_error',
        'errorReportText' : ['error: email is not valid', 'error: unknown email'],
        'validReportText' : 'valid email'
    }
];
/**
 * Array of input objects for all reset password inputs on the login page
 * @type {Array.<input>}
 */
let resetPasswordInputs = [
    {
        'inputID' : 'new_password_input',
        'inputlength' : 6,
        'regex' : [regPassword, regPassword, regPassword, regPassword],
        'errorReportID' : 'new_password_error',
        'errorReportText' : ['error: note password length (>6)'],
        'validReportText' : 'valid password'
    },
    {
        'inputID' : 'confirm_password_input',
        'inputlength' : 6,
        'regex' : [regPassword, regPassword, regPassword, regPassword],
        'errorReportID' : 'confirm_password_error',
        'errorReportText' : ['error: note password length (>6)'],
        'validReportText' : 'valid password'
    }
];
/**
 * Array of input objects for all inputs on the add task page
 * @type {Array.<input>}
 */
let addTaskInputs = [
    {
        'inputID' : 'title',
        'inputlength' : 0,
        'regex' : [regAddTask, regAddTask, regAddTask, regAddTask],
        'errorReportID' : 'title_error',
        'errorReportText' : ['This field is required'],
        'validReportText' : 'valid title'
    },
    {
        'inputID' : 'description',
        'inputlength' : 0,
        'regex' : [regAddTask, regAddTask, regAddTask, regAddTask],
        'errorReportID' : 'description_error',
        'errorReportText' : ['This field is required'],
        'validReportText' : 'valid description'
    },
    {
        'inputID' : 'new_contact',
        'inputlength' : 7,
        'regex' : [regEmail, regEmail, regEmail, regEmail],
        'errorReportID' : 'new_contact_error',
        'errorReportText' : ['error: email is not valid'],
        'validReportText' : 'valid email'
    },
    {
        'inputID' : 'dueDate',
        'inputlength' : 0,
        'regex' : [regAddTask, regAddTask, regAddTask, regAddTask],
        'errorReportID' : 'dueDate_error',
        'errorReportText' : ['This field is required'],
        'validReportText' : 'valid date'
    },
    {
        'inputID' : 'dueDate2',
        'inputlength' : 0,
        'regex' : [regAddTask, regAddTask, regAddTask, regAddTask],
        'errorReportID' : 'dueDate2_error',
        'errorReportText' : ['This field is required'],
        'validReportText' : 'valid date'
    }
]
/**
 * Array of input objects for all edit task inputs on the board page
 * @type {Array.<input>}
 */
let editTaskInputs = [
    {
        'inputID' : 'edit_title',
        'inputlength' : 0,
        'regex' : [regAddTask, regAddTask, regAddTask, regAddTask],
        'errorReportID' : 'edit_title_error',
        'errorReportText' : ['This field is required'],
        'validReportText' : 'valid title'
    },
    {
        'inputID' : 'edit_description',
        'inputlength' : 0,
        'regex' : [regAddTask, regAddTask, regAddTask, regAddTask],
        'errorReportID' : 'edit_description_error',
        'errorReportText' : ['This field is required'],
        'validReportText' : 'valid description'
    },
    {
        'inputID' : 'edit_dueDate',
        'inputlength' : 0,
        'regex' : [regAddTask, regAddTask, regAddTask, regAddTask],
        'errorReportID' : 'edit_dueDate_error',
        'errorReportText' : ['This field is required'],
        'validReportText' : 'valid date'
    },
    {
        'inputID' : 'edit_new_contact',
        'inputlength' : 7,
        'regex' : [regEmail, regEmail, regEmail, regEmail],
        'errorReportID' : 'edit_task_new_contact_error',
        'errorReportText' : ['error: email is not valid'],
        'validReportText' : 'valid email'
    }
]


/*___________________________________Error Report Array__________________________________*/

/**
 * @type {Array.<String>} - Array of ID's of error report elements on the contact page
 */
let contactErrorReports = ['nameError', 'emailError', 'phoneError'];
/**
 * @type {Array.<String>} - Array of ID's of login error report elements on the login page
 */
let loginErrorReports = ['login_email_error', 'login_password_error'];
/**
 * @type {Array.<String>} - Array of ID's of signup error report elements on the login page
 */
let signupErrorReports = ['signup_name_error', 'signup_email_error', 'signup_password_error'];
/**
 * @type {Array.<String>} - Array of ID's of forgot password error report elements on the login page
 */
let forgotPasswordErrorReport = ['forgot_password_email_error'];
/**
 * @type {Array.<String>} - Array of ID's of reset password error report elements on the login page
 */
let resetPasswordErrorReport = ['new_password_error', 'confirm_password_error'];


/*_______________________________Input Validation Functions_______________________________*/

/**
 * Checks user input on key up and displays an error message if the input does not match certain criteria
 * @param {Array.<input>} inputArray - Array of input objects containing information about the input fields to be validated
 * @param {Number} index - Index of the input element in the inputArray that needs to be checked
 */
function checkInputOnkeyUp(inputArray, index) {
    let input = document.getElementById(inputArray[index].inputID).value;
    if (firstCharisNotValid(inputArray[index].regex[0], input)) {
        displayError(inputArray[index].errorReportID, inputArray[index].errorReportText[1]);
    } else if (charIsNotValid(inputArray[index].regex[1], input)) {
        displayError(inputArray[index].errorReportID, inputArray[index].errorReportText[2]);
    } else if (twoSpacesInRow(inputArray[index].regex[2], input)) {
        displayError(inputArray[index].errorReportID, inputArray[index].errorReportText[3]);
    } else {
        document.getElementById(inputArray[index].errorReportID).style.color = 'var(--white-color)';
    }
}

/**
 * Checks the validity of an input value and displays an error message if necessary
 * @param {Array.<input>} inputArray - Array of input objects containing information about the input fields to be validated
 * @param {Number} index - Index of the input element in the inputArray that needs to be checked
 */
function checkInputOnblur(inputArray, index) {
    let input = document.getElementById(inputArray[index].inputID).value;
    if (charIsNotValid(inputArray[index].regex[3], input)) {
        displayError(inputArray[index].errorReportID, inputArray[index].errorReportText[0]);
    } else if (input == '') {
        document.getElementById(inputArray[index].errorReportID).style.color = 'var(--white-color)';
    }
    displayValidInputs(inputArray);
}

/**
 * Checks if a due date input is empty or in the past and displays an error message if necessary
 * @param {Element} element - Due date input element
 * @param {Array.<input>} array - Array of inputs
 * @param {Number} index - Index of addTaskInputs array
 */
function checkDueDate(element, array, index) {
    if (element.value == '') {
        setInputPlaceholder(element);
        displayError(array[index].errorReportID, array[index].errorReportText[0]);
    } else {
        document.getElementById(array[index].errorReportID).style.color = 'var(--white2-color)';
    }
}

/**
 * Checks if an email input is valid and displays an error message if it is not
 * @param {Element} input - Input element of invit new contact
 * @param {Array.<input>} inputArray - Array of input objects containing information about the input fields to be validated
 * @param {Number} index - Index of inputs array
 */
function checkEmailValidation(input, inputArray, index) {
    if (charIsNotValid(inputArray[index].regex[0], input.value)) {
        displayError(inputArray[index].errorReportID, inputArray[index].errorReportText[0]);
    } else if (input.value == '') {
        document.getElementById(inputArray[index].errorReportID).style.color = 'var(--white2-color)';
    } else {
        document.getElementById(inputArray[index].errorReportID).style.color = 'var(--darkGreen-color)';
    }
}

/**
 * Checks if an input element is empty and displays an error message if it is
 * @param {Element} element - Input element
 * @param {Array.<input>} inputArray - AddTaskInputs array
 * @param {Number} index - Index of the input element in the inputArray that needs to be checked. It is used to access the corresponding error report ID
 *  and error report text for that input element
 */
function checkIfInputIsEmpty(element, inputArray, index) {
    let input = element.value.length;
    if (input < 1) {
        displayError(inputArray[index].errorReportID, inputArray[index].errorReportText[0]);
    } else {
        document.getElementById(inputArray[index].errorReportID).style.color = 'var(--white2-color)';
    }
}

/**
 * Checks if the confirm password input matches the new password input and if the length of the confirm password is at least 7 characters.
 */
function checkConfirmPassword() {
    let newPassword = document.getElementById('new_password_input').value;
    let confirmPassword = document.getElementById('confirm_password_input').value;
    if (confirmPassword.length >= 7 && confirmPassword.length!= 0) {
        if (confirmPassword === newPassword) {
            displayValidInputs(resetPasswordInputs);
        }
        else {
            displayError(resetPasswordErrorReport[1], 'password inputs do not match');
        }
    } else {
        displayError(resetPasswordErrorReport[1], 'error: note password length (>6)');
    }
}

/**
 * Checks if the input values in an array meet certain criteria and displays a valid report if they do
 * @param {Array.<input>} inputArray - Array of input objects containing information about the input fields to be validated
 */
function displayValidInputs(inputArray) {
    for (let i = 0; i < inputArray.length; i++) {
        let input = document.getElementById(inputArray[i].inputID).value;
        if (charIsNotValid(inputArray[i].regex[3], input) == false && input.length >= inputArray[i].inputlength) {
            document.getElementById(inputArray[i].errorReportID).innerHTML = inputArray[i].validReportText;
            document.getElementById(inputArray[i].errorReportID).style.color = 'var(--darkGreen-color)';
        }
    }
}

/**
 * Checks the number of valid inputs based on the color of error reports
 * @param {Array.<String>} errorReportArray - Array of ID's of error report elements
 * @return {Number} - Count of error reports that have a green color, indicating that they have valid inputs
 */
function checkValidInputs(errorReportArray) {
    let count = 0;
    for (let i = 0; i < errorReportArray.length; i++) {
        let errorReport = document.getElementById(errorReportArray[i]);
        let color = window.getComputedStyle(errorReport, null).getPropertyValue('color');
        if (color == 'rgb(0, 127, 28)') {
            count++;
        }
    }
    return count;
}

/**
 * Checks if an error report element has a valid input depending on it's color
 * @param {String} errorReport - Id of an HTML element that displays an error message
 * @returns {Boolean} - If the color is equal to the specified RGB value, the function returns true, otherwise it returns false
 */
function checkValidInput(errorReport) {
    let report = document.getElementById(errorReport);
    let color = window.getComputedStyle(report, null).getPropertyValue('color');
    if (color == 'rgb(0, 127, 28)') {
        return true;
    } else {
        return false;
    }
}

/**
 * Displays an error report
 * @param {String} id - ID of the element that displays an error message
 * @param {String} errorReport - error report that will be displayed
 */
function displayError(id, errorReport) {
    document.getElementById(id).innerHTML = errorReport;
    document.getElementById(id).style.color = 'var(--red-color)';
}

/**
 * Checks if the first character of a given input string is not valid according to a given regular expression
 * @param {RegExp} reg - regular expression object used to test if the first character of the input string is valid or not
 * @param {String} input - input string that needs to be checked for the validity of its first character
 * @returns {boolean}
 */
function firstCharisNotValid(reg, input) {
    return reg.test(input.charAt(0)) == false && input !== "";
}

/**
 * Checks if a given input is not valid based on a regular expression and minimum length requirement
 * @param {RegExp} reg - regular expression object used to test if the character is valid or not
 * @param {String} input -  input string that needs to be checked
 * @returns {boolean}
 */
function charIsNotValid(reg, input) {
    return reg.test(input) == false && input.length >= 1;
}

/**
 * Checks if there are two spaces in a row in a given input string
 * @param {RegExp} reg - regular expression pattern that will be tested against the input string
 * @param {String} input -  input string that needs to be checked for the presence of two consecutive spaces
 * @returns {boolean}
 */
function twoSpacesInRow(reg, input) {
    return reg.test(input) == false && input.length > 1;
}

/**
 * Closes error reports by changing their text color to white
 * @param {Array.<String>} errorReportArray - Array of ID's of elements that display error reports
 */
function closeErrorReports(errorReportArray) {
    for (let i = 0; i < errorReportArray.length; i++) {
        document.getElementById(errorReportArray[i]).style.color = 'var(--white-color)';
    }
}

/**
 * Closes an error report by changing the text color to white
 * @param {String} errorReportArray - ID of element that displays an error report
 */
function closeErrorReport(errorReport) {
    document.getElementById(errorReport).style.color = 'var(--white2-color)';
}

/**
 * Clears the values of input fields based on their ID's
 * @param {Array.<input>} inputArray - Array of input objects containing information about the input fields to be validated
 */
function clearInputs(inputsArray) {
    for (let i = 0; i < inputsArray.length; i++) {
        document.getElementById(inputsArray[i].inputID).value = '';
    }
}
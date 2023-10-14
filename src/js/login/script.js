/*___________________________________________Settings____________________________________________*/

/**
 * @typedef account
 * @type {Object} - Account object
 * @prop {String} color - Color of the account
 * @prop {String} email - Email of the account
 * @prop {Number} greeting - Amount of displayed greeting
 * @prop {String} id - ID of the account
 * @prop {String} initials - Initials of the account
 * @prop {String} name - Name of the account
 * @prop {Boolean} online - Status of active account
 * @prop {String} password - Password of the account
 */
/**
 * @type {account}
 */
let account = {
    'id' : '',
    'name' : '',
    'initials' : '',
    'color' : 'rgb(42, 54, 71)',
    'email' : '',
    'password' : '',
    'online' : false,
    'greeting' : 0
}
/**
 * @type {Array.<String>} - ID's of elements for confirmations
 */
let confirmations = ['create_account_confirm', 'reset_password_confirm', 'send_email_confirm', 'email_used_confirm'];
/**
 * @type {Array.<String>} - ID's of logo img elements
 */
let logos = ['login_logo', 'login_logo_mobile'];


/*_______________________________________Animation Functions_________________________________________*/

/**
 * Starts  login animations based on the window size and triggers logo and menu animations after a set delay
 */
function loginAnimation() {
    if (window.innerWidth <= 560) {
        mobileAnimation('var(--darkBlue-color)', '0', '1');
    } else {
        document.getElementById('login_logo_mobile').style.opacity = '0';
    }
    setTimeout(() => {
        animateLogo();
    }, 1000)
    setTimeout(() => {
        animateLoginMenus();
    }, 1500)
}

/**
 * Animates logos by setting their position to the upper left corner and scale properties.
 */
function animateLogo() {
    for (let i = 0; i < logos.length; i++) {
        if (window.innerWidth <= 560) {
            mobileAnimation('var(--white2-color)', '1', '0');
        }
        document.getElementById(logos[i]).style.top = '5.3vh';
        document.getElementById(logos[i]).style.left = '5.3vw';
        document.getElementById(logos[i]).style.scale = '1.0';
    };
}

/**
 * Changes the background color and opacity of Elements in mobile version
 * @param {String} color - Background color of the body element
 * @param {String} opacity1 - Opacity value for the login_logo
 * @param {String} opacity2 - Opacity value for the login_logo_mobile
 */
function mobileAnimation(color, opacity1, opacity2) {
    document.querySelector('body').style.backgroundColor = color;
            document.getElementById('login_logo').style.opacity = opacity1;
            document.getElementById('login_logo_mobile').style.opacity = opacity2;
}

/**
 * Displays the login menu signup container
 */
function animateLoginMenus() {
    document.getElementById('signup_head_container').classList.remove('d-none');
    document.getElementById('login_container').classList.remove('d-none');
}


/*_______________________________________Switch Menu Functions_________________________________________*/

/**
 * Toggles login menu between signup and forgot password menu and clears input fields and error reports
 * @param {Array.<String>} inputArray - Array of ID's of input elements that need to be cleared
 * @param {Array.<String>} errorReportArray - Array of ID's of error report elements that need to be closed
 */
function toggleLoginMenu(menu, inputArray, errorReportArray) {
    if (menu == 'signup') {
        toggleMenu('login_container', 'signup_container', 'signup_head_container');
    } else {
        toggleForgotPasswordContainer();
    }
    clearInputs(inputArray);
    closeErrorReports(errorReportArray);
}

/**
 * Toggles the visibility of the forgot password container based on the window size
 */
function toggleForgotPasswordContainer() {
    let container = document.getElementById('forgot_password_container');
    if (window.innerWidth > 560) {
        setPositionContainer(0);
        toggleMenu('login_container', 'forgot_password_container', 'signup_head_container');
    } else if (window.innerWidth <= 560 && container.classList.contains('d-none')) {
        openMobileForgotPasswordContainer();
    } else {
        closeMobileForgotPasswordContainer();
    }
}

/**
 * Opens Forgot password container in mobile version and adjusts its position
 */
function openMobileForgotPasswordContainer() {
    setPositionContainer(90);
    toggleMenu('login_container', 'forgot_password_container', 'signup_head_container');
    setTimeout(() => {
        setPositionContainer(0);
    }, 10);
}

/**
 * Closes Forgot password container in mobile version and adjusts its position
 */
function closeMobileForgotPasswordContainer() {
    setPositionContainer(90);
    setTimeout(() => {
        toggleMenu('login_container', 'forgot_password_container', 'signup_head_container');
    }, 510);
}

/**
 * Sets the position of the forgot password container and reset password container
 * @param {Number} y - TranslationY of forgot password and reset password container
 */
function setPositionContainer(y) {
    document.getElementById('forgot_password_container').style.transform = `translateY(${y}vh)`;
    document.getElementById('reset_password_container').style.transform = `translateY(${y}vh)`;
}

/**
 * Toggles the visibility of the elements passed as parameters
 * @param {String} element1 - Id of element
 * @param {String} element2 - Id of element
 * @param {String} element3 - Id of element
 */
function toggleMenu(element1, element2, element3) {
    toggleTwoElements(element1, element2);
    document.getElementById(element3).classList.toggle('d-none');
}

/**
 * Toggles between forgot password and reset password menu
 * @param {Array.<String>} inputArray - Array of ID's of input elements that need to be cleared
 * @param {Array.<String>} errorReportArray - Array of ID's of error report elements that need to be closed
 */
function toggleResetMenu(inputArray, errorReportArray) {
    toggleTwoElements('forgot_password_container', 'reset_password_container');
    clearInputs(inputArray);
    closeErrorReports(errorReportArray);
}


/*__________________________________________Submit Functions___________________________________________*/

/**
 * Handles the signup process by checking for valid inputs, creating a new account and toggling the login and signup containers.
 */
async function signup() {
    let count = checkValidInputs(signupErrorReports);
    let email = document.getElementById('signup_email_input').value;
    email = email.toLowerCase();
    if (count == 3 && checkExistingAccount(email)) {
        await createAccount(email);
        confirmAnimation(0);
        setTimeout(() => {
            toggleMenu('login_container', 'signup_container', 'signup_head_container');
        }, 2500);
    }
}

/**
 * Checks if an email already exists in accounts array
 * If there are no accounts or if the email address is not found in the existing accounts, the function returns true.
 * If the email address is found in an existing account, the function triggers a confirmation animation and then breaks out of the loop
 * @param {String} email - Email to be checked for existing accounts
 * @returns {boolean}
 */
function checkExistingAccount(email) {
    if (accounts.length > 0) {
        for (let i = 0; i < accounts.length; i++) {
            if (accounts[i].email === email) {
                confirmAnimation(3);
                break;
            } else if (i === accounts.length - 1) {
                return true;
            }
        }
    } else {
        return true;
    }
}

/**
 * Creates a new account, pushs and saves it into the accounts array
 * @param {String} email - Email of the user creating the account
 */
async function createAccount(email) {
    let id = getNewAccountId();
    let name = document.getElementById('signup_name_input').value;
    name =  firstLettersToUpperCase(name);
    let initials = createInitials(name);
    let password = document.getElementById('signup_password_input').value;
    let account = {
        'id' : `${id}`,
        'name' : name,
        'initials' : initials,
        'color' : 'rgb(42, 54, 71)',
        'email' : email,
        'password' : password,
        'online' : false,
        'greeting' : 0
    }
    accounts.push(account);
    await saveAccount();
}

/**
 * Returns a new account ID based on the number of existing accounts
 * @returns {String} - New account ID
 */
function getNewAccountId() {
    if (accounts.length === 0) {
        return `acc1`;
    } else {
        return `acc${accounts.length + 1}`;
    }
}

/**
 * Logs in a user by checking their email and password against a list of accounts
 */
async function login() {
    await resetLoginStatus();
    let email = document.getElementById('login_email_input').value;
    let password = document.getElementById('login_password_input').value;
    for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].email === email) {
            checkPassword(password, i);
            break
        } else if (i === accounts.length - 1) {
            displayError('login_email_error', 'error: email is not known');
        }
    }
}

/**
 * Checks if a given password matches the password of a specific account and logs the user in if it does
 * @param {String} password - Password entered by the user trying to log in
 * @param {Number} index - Index of accounts array
 */
async function checkPassword(password, index) {
    if (accounts[index].password === password) {
        await rememberLoginData(index);
        accounts[index].online = true;
        await saveAccount();
        document.location.href = 'summary.html';
    } else {
        displayError('login_password_error', 'error: wrong password');
    }
}

/**
 * Saves or clears login data based on whether the "remember" checkbox is checked
 * @param {Number} index - Index of accounts array
 */
async function rememberLoginData(index) {
    let checkbox = document.getElementById('remember');
    if (checkbox.checked) {
        loginData = [];
        loginData.push({
            email: accounts[index].email,
            password: accounts[index].password 
        });
        await setItem('login', JSON.stringify(loginData));
    } else {
        loginData = [];
        await setItem('login', JSON.stringify(loginData));
    }
}

/**
 * Loads login data and fills in the email and password fields if there is only one set of login data, and checks the "remember" checkbox
 */
async function loadInputs() {
    await loadLoginData();
    if (loginData.length == 1) {
        document.getElementById('login_email_input').value = loginData[0].email;
        document.getElementById('login_password_input').value = loginData[0].password;
        let checkbox =  document.getElementById('remember');
        let checked = document.createAttribute("checked");
        checkbox.setAttributeNode(checked);
    }
}

/**
 * Sends an email for resetting a password if the input is valid and the email exists
 */
function sendEmail() {
    let count = checkValidInputs(forgotPasswordErrorReport);
    let existingEmail = checkExistingEmail();
    if (count == 1 && existingEmail) {
        // Send mail
        confirmAnimation(2);
        setTimeout(() => {
            toggleResetMenu(resetPasswordInputs, resetPasswordErrorReport);
        }, 2500);
    }
}

/**
 * Returns true, if email exists, if not it displays an error message
 * @returns {boolean}
 */
function checkExistingEmail() {
    let email = document.getElementById('forgot_password_email_input').value;
    for (let i = 0; i < accounts.length; i++) {
        if (email === accounts[i].email) {
            document.getElementById('reset_password_form').setAttribute('onsubmit', `resetPassword(${i}); return false;`);
            return true;
        }
    }
    displayError(forgotPasswordErrorReport[0], 'error: unknown email');
}

/**
 * Resets a user's password and saves it to the accounts list
 * @param {Number} index - Index of accounts array
 */
async function resetPassword(index) {
    let newPassword = document.getElementById('new_password_input').value;
    let count = checkValidInputs(resetPasswordErrorReport);
    if (count == 2) {
        accounts[index].password = newPassword;
        await saveAccount()
        confirmAnimation(1);
        setTimeout(() => {
            toggleMenu('login_container', 'reset_password_container', 'signup_head_container');
        }, 2500);
    }
}


/*__________________________________________Confirm Functions___________________________________________*/

/**
 * Shows a confirmation message for a specified index and hides it after 2 seconds
 * @param {Number} index - Index of confirmations array
 */
function confirmAnimation(index) {
    showConfirmation(index);
    setTimeout(() => {
        hideConfirmation(index);
    }, 2000);
}

/**
 * Shows a confirmation message and adjusts the position of the container based on the screen size
 * @param {Number} index - Index of confirmations array
 */
function showConfirmation(index) {
    document.getElementById(confirmations[index]).classList.remove('d-none');
    if (window.innerWidth <= 560) {
        document.querySelector('.confirmation_container').style.transform = 'translateY(40vh)';
    } else {
        document.querySelector('.confirmation_container').style.transform = 'translateY(0vh)';
    }
}

/**
 * Hides a confirmation message by moving it off-screen and adding a "d-none" class to it after a delay
 * @param {Number} index - Index of confirmations array
 */
function hideConfirmation(index) {
    document.querySelector('.confirmation_container').style.transform = 'translateY(60vh)';
    setTimeout(() => {
        document.getElementById(confirmations[index]).classList.add('d-none');
    }, 1000);
}

async function loadLoginAccounts() {
    await loadAccounts();
    await resetLoginStatus();
}
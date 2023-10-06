/**
 * Includes HTML files into a webpage and adds an active background class to the corresponding navigation link
 */
function includeHTML() {
    let z, i, elmnt, file, xhttp;
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        file = elmnt.getAttribute("w3-include-html");
        if (file) {
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) { elmnt.innerHTML = this.responseText; }
                    if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
                    elmnt.removeAttribute("w3-include-html");
                    includeHTML();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            return;
        }
    }
    getActiveLink();
}

/**
 * Checks the current URL and adds an active background class to the corresponding navigation link
 */
function getActiveLink() {
    if (window.location.href.indexOf("summary") > -1) {
        addActiveBgr('summary_link', 'mobile_summary_link');
    }
    if (window.location.href.indexOf("board") > -1) {
        addActiveBgr('board_link', 'mobile_board_link');
    }
    if (window.location.href.indexOf("add-task") > -1) {
        addActiveBgr('add_task_link', 'mobile_add_task_link');
    }
    if (window.location.href.indexOf("contacts") > -1) {
        addActiveBgr('contact_link', 'mobile_contact_link');
    }
    if (window.location.href.indexOf("legal-notice") > -1) {
        let element = document.getElementById("legal_notice_link");
        element.classList.add("active");
    }
}

/**
 * Adds an "active" class for background to an element based on the window width
 * @param {String} id1 - ID of a link element
 * @param {String} id2 - ID of a mobile link element
 */
function addActiveBgr(id1, id2) {
    let element = document.getElementById(id1);
    let element2 = document.getElementById(id2);
    if (window.innerWidth <= 468) {
        element2.classList.add("active");
    } else {
        element.classList.add("active");
    }
}

/**
 * When the window is resized, it checks the current URL and adds an active background class to the corresponding navigation link based on the window width. 
 * This ensures that the correct navigation link is highlighted when the window is resized
 */
window.addEventListener('resize', () => {
    getActiveLink();
});

/**
 * Sets the initials in the header based on the online account index
 */
function loadHeaderInitials() {
    let initials = document.querySelectorAll('.header_initials');
    let index = getOnlineAccountIndex();
    if (index == -1) {
        initials.forEach(e => {
            e.innerHTML = 'G';
        });
    } else {
        initials.forEach(e => {
            e.innerHTML = accounts[index].initials;
        });
    }
}

/**
 * Returns the index of the account that has its `online` property set to `true` or -1 if no account is online
 * @returns {Number} - index of the online account or -1
 */
function getOnlineAccountIndex() {
    if (accounts.length > 0) {
        for (let i = 0; i < accounts.length; i++) {
            if (accounts[i].online === true) {
                return i;
            } else if (i === accounts.length - 1) {
                return -1;
            }
        }
    } else {
        return -1;
    }
}

/**
 * Loads accounts and the header initials
 */
async function loadData() {
    await loadAccounts();
    loadHeaderInitials();
}

/**
 * Opens the header menu based on the width of the window.
 */
function openHeaderMenu() {
    if (window.innerWidth >= 468) {
        document.getElementById('header_menu').classList.toggle('d-none');
    } else {
        document.getElementById('mobile_header_menu').classList.toggle('d-none');
    } 
}

/**
 * Closes the header menu based on the width of the window.
 */
function closeHeaderMenu() {
    if (window.innerWidth >= 468) {
        document.getElementById('header_menu').classList.add('d-none');
    } else {
        document.getElementById('mobile_header_menu').classList.add('d-none');
    }
}

/**
 * Logs the user out by resetting their login status and redirecting them to the login page
 */
async function logout() {
    await resetLoginStatus();
    document.location.href = 'login.html';
}

/**
 * Resets the online status and greeting of all accounts and saves the changes
 */
async function resetLoginStatus() {
    for (let i = 0; i < accounts.length; i++) {
        accounts[i].online = false;
        accounts[i].greeting = 0;
    }
    await saveAccount();
}

/**
 * Creates and returns initials from a given name by taking the first character of the first name and the first character of the last name
 * @returns {String} - Initials
 */
function createInitials(name) {
    let firstInitial = getFirstChar(name);
    let secondInitial = getFirstCharofLastname(name);
    return `${firstInitial}${secondInitial}`
}

/**
 * Returns the first character of the first name in uppercase
 * @param {String} name - Name
 * @returns {String} - first letter of the first name in uppercase
 */
function getFirstChar(name) {
    return name.charAt(0).toUpperCase();
}

/**
 * Returns the first character of the last name in uppercase
 * @param {String} name - Name 
 * @returns {String} - first letter of the last name in uppercase
 */
function getFirstCharofLastname(name) {
    return name.trim().split(' ').pop().charAt(0).toUpperCase();
}

/**
 * Takes a string as input and applies a regular expression to replace the first letter of each word in the string with its uppercase equivalent
 * The regular expression /^\w|\s\w/g matches the first letter of the string (^\w) or (|) any letter that follows a whitespace character (\s\w) globally (g)
 * The arrow function takes a single argument c, which represents the matched character, and returns its uppercase equivalent using the toUpperCase() method
 * @param {String} input - Input as a string
 * @returns {string} - Modified string with the first letter of each word as an uppercase letter
 */
function firstLettersToUpperCase(input) {
    return input.toLowerCase().replace(/^\w|\s\w/g, c => c.toUpperCase());
}

/**
 * Takes an array of objects, and returns a new unique ID that is one greater than the highest ID in the array
 * If the array is empty, it returns 1 as the new ID
 * If the array is not empty, it uses the Math.max function to find the highest ID in the array by mapping the id property of each 
 * object in the array to an array of IDs, and then spreading that array as arguments to Math.max
 * It then adds 1 to the highest ID to get the new ID
 * @returns {number} - new ID
 */
function getNewId(array) {
    if (array.length === 0) {
        return 1;
    } else {
        return Math.max(...array.map(item => item.id)) + 1;
    }
}

/**
 * Sorts the array by name alphabetically
 * @param {Array} array - Array
 * @returns {Array} - Alphabetically sorted array
 */
function sortArrayByName(array) {
    return array.sort((a, b) => a.name < b.name ? -1 : 1);
}

/**
 * Toggles between two elements
 * @param {string} element1 - Id string of the element1
 * @param {string} element2 - Id string of the element2
 */
function toggleTwoElements(element1, element2) {
    document.getElementById(element1).classList.toggle('d-none');
    document.getElementById(element2).classList.toggle('d-none');
}

/**
 * Stops the propagation of an event
 */
function stopPropagation(event) {
    event.stopPropagation();
}

/**
 * Displays the private policy
 */
function openPolicy() {
    toggleTwoElements('impressum_includer', 'privacy_policy_includer');
    document.getElementById('impressum_button').classList.add('d-none');
}

/**
 * Displays the impressum
 */
function openImpressum() {
    toggleTwoElements('impressum_includer', 'privacy_policy_includer')
    document.getElementById('impressum_button').classList.remove('d-none');
    document.querySelector('.content_container').scrollTop = 0;
}

/**
 * Displays the element before it slides into the window view
 * @param {String} element - Id of the sliding element
 */
function displaySlideContainer(element, translate) {
    document.getElementById(element).classList.remove('d-none');
    setTimeout (() => {
        document.getElementById(element).style.transform = translate; 
    }, 100);
}

/**
 * Hides the element after it slides out the window view
 * @param {String} element - Id of the sliding element
 */
function hideSlideContainer(element, translate) {
    document.getElementById(element).style.transform = translate;
    setTimeout (() => {
        document.getElementById(element).classList.add('d-none');
    }, 400);
}
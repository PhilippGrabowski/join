/*____________________________________Alphabet Array____________________________________*/

/**
 * Media query that is checking if the minimum width of the viewport is 900 pixels or more
 */
const mediaQuery = '(min-width: 900px)';
/**
 * Media query that is checking if the maximum width of the viewport is 900 pixels or less
 */
const mobileMediaQuery = '(max-width: 900px)';
/**
 * MediaQueryList object that represents the results of a CSS media query applied to the document
 */
const mobileQueries = window.matchMedia(mobileMediaQuery);
/**
 * MediaQueryList object that represents the results of a CSS media query applied to the document
 */
const queries = window.matchMedia(mediaQuery);
/**
 * Array that contains all the uppercase letters of the alphabet
 */
let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
/**
 * @typedef contact
 * @type {Object} - Contact object
 * @prop {String} color - Color of the contact
 * @prop {String} email - Email of the contact
 * @prop {Number} id - ID of the contact
 * @prop {String} initials - Initials of the contact
 * @prop {String} name - Name of the contact
 * @prop {String} phone - Phone number of the contact
 */
/**
 * @type {contact} - Contact object
 */
let contact = {
    'id' : '',
    'name' : '',
    'initials' : '',
    'email' : '',
    'phone' : '',
    'color' : ''
}
/**
 * Variable that serves as an identifier whether the contact info is open or not
 */
let openInfo = false;


/*___________________________Render Contact List Functions______________________________*/

/**
 * Loads and renders a contact list asynchronously.
 */
async function LoadContactList() {
    await loadContacts();
    renderContactList();
}

/**
 * Renders a contact list by iterating through the alphabet and rendering letter groups and contacts for each letter.
 */
function renderContactList() {
    let contactList = document.getElementById('list_container');
    contactList.innerHTML = '';
    for (let i = 0; i < alphabet.length; i++) {
        let letter = alphabet[i];
        renderLetterGroups(contactList, letter);
        renderContacts(letter);
    }
}

/**
 * Renders letter groups for contacts based on the first letter of their name
 * @param {Element} element - Element where the contact groups will be rendered
 * @param {String} letter - Letter of the alphabet. It is used to check if the first character of a contact's name matches the letter, and if so, to create a
 * contact group for that letter
 */
function renderLetterGroups(element, letter) {
    let matchAmount = 0;
    for (let i = 0; i < contacts.length; i++) {
        let char = getFirstChar(contacts[i].name);
        if (letter === char && matchAmount == 0) {
            element.innerHTML += createContactGroup(letter);
            matchAmount++;
            break;
        }
    }
}

/**
 * Renders a list of contacts based on a given letter
 * @param {String} letter - Letter that representing the first letter of the contacts' names. It's used to filter the contacts and
 * only display those whose names start with the specified letter
 */
function renderContacts(letter) {
    let contactSubList = document.getElementById(`group${letter}`);
    if (contactSubList) {
        contactSubList.innerHTML = '';
        let filteredContacts = [];
        filterContactsByChar(filteredContacts, letter);
        createContacts(contactSubList, filteredContacts);
    }
}

/**
 * Filters an array of contacts by a given letter and sorts the resulting array by name
 * @param {Array.<contact>} filteredContacts - Array that will store the by name filtered contacts
 * @param {String} letter - Letter that is used to filter the contacts by their name. Only the contacts whose name starts with this character 
 * will be added to the filtered array
 */
function filterContactsByChar(filteredContacts, letter) {
    for (let i = 0; i < contacts.length; i++) {
        let char = getFirstChar(contacts[i].name);
        if (letter === char) {
            filteredContacts.push(contacts[i]);
        }
    }
    filteredContacts = sortArrayByName(filteredContacts);
}

/**
 * Creates and displays contact elements with their respective initials and colors
 * @param {Element} element  - Element where the contacts will be created and displayed
 * @param {Array.<contact>} filteredContacts - Array of contacts that have been filtered and need to be displayed
 */
function createContacts(element, filteredContacts) {
    for (let i = 0; i < filteredContacts.length; i++) {
        element.innerHTML += createContact(filteredContacts[i]);
        document.getElementById(`contact_initials${filteredContacts[i].id}`).style.backgroundColor = filteredContacts[i].color;
    }
}


/*__________________________Contact Information Functions________________________________*/

/**
 * Opens the contact information for a given ID and displays it on the screen 
 * @param {Number} id - ID of the contact used to retrieve and display the contact information for that specific contact
 */
function openContactInfo(id) {
    if (window.innerWidth <= 900) {
        document.getElementById('contact_list').style.display = 'none';
        document.getElementById('new_contact_button').style.display = 'none';
        document.getElementById('contact_info').style.display = 'unset';
        displayContactInfoButtons(id);
    }
    displaySlideContainer('contact_info_container', 'translateX(0)');
    addContactInformation(id);
    openInfo = true;
}

/**
 * Displays contact information buttons on a mobile device
 * @param {number} id - ID of the contact used to retrieve the index of the contact in an array and to create contact information buttons for that specific contact
 */
function displayContactInfoButtons(id) {
    let contactIndex =  getIndexOfContact(id, contacts);
    document.getElementById('mobile_contact_info_button_container').innerHTML = createContactInfoButtons(contactIndex, id);
    document.getElementById('mobile_contact_info_button_container').style.display = 'flex';
}

/**
 * Updates the contact information displayed on the webpage based on the given contact ID
 * @param {number} id - ID of the contact used to retrieve the contact's information and display it in the HTML elements with the corresponding ids
 */
function addContactInformation(id) {
    let index = getIndexOfContact(id, contacts);
    document.getElementById('info_initials').innerHTML = contacts[index].initials;
    document.getElementById('info_initials').style.backgroundColor = contacts[index].color;
    document.getElementById('info_name').innerHTML = contacts[index].name;
    document.getElementById('info_email').innerHTML = contacts[index].email;
    document.getElementById('info_phone').innerHTML = contacts[index].phone;
    document.getElementById('edit_contact_link').setAttribute('onclick', `openContactMenu('edit',${id})`);
    if (window.innerWidth <= 600) {
    document.getElementById('mobile_edit_contact_img').setAttribute('onclick', `openContactMenu('edit',${id})`);
    }
}

/**
 * Closes the contact information and displays the contact list and new contact button
 */
function closeContactInfo() {
    document.getElementById('contact_list').style.display = 'unset';
    document.getElementById('new_contact_button').style.display = 'flex';
    document.getElementById('contact_info').style.display = 'none';
    document.getElementById('mobile_contact_info_button_container').style.display = 'none';
    hideSlideContainer('contact_info_container', 'translateX(150%)');
    openInfo = false;
}


/*_____________________________Contact Add/Edit Menu Functions_____________________________*/

/**
 * Opens a contact menu based on the option selected and displays it on the screen
 * @param {String} option - String that specifies the action to be performed. It can be either "add" or "edit"
 * @param {Number} id - ID of the contact which is used in the case of 'edit' to identify which contact to edit
 */
function openContactMenu(option, id) {
    switch (option) {
        case 'add':
            openAddContactMenu();
        break;
        case 'edit':
            openEditContactMenu(id);
        break;
    }
    document.getElementById('partitionWindow').classList.remove('d-none');
    if (window.innerWidth <= 900) {
        displaySlideContainer('contact_menu', 'translateY(0)');
    } else {
        displaySlideContainer('contact_menu', 'translateX(0)');
    }
}

/**
 * Opens the add contact menu and sets the appropriate elements and attributes.
 */
function openAddContactMenu() {
    document.getElementById('contact_menu_header').innerHTML = 'Add contact';
    document.getElementById('contact_menu_subheader').classList.remove('d-none');
    document.getElementById('contact_form').setAttribute('onsubmit', 'addContact(); return false;');
    switchContactElements('edit_contact_buttons', 'add_contact_buttons');
    switchContactElements('edit_menu_initials', 'user_icon');
    document.querySelector('.menu_circle').style.backgroundColor = '#D1D1D1';
    clearInputs(contactInputs);
}

/**
 * Opens an edit contact menu and fills it with the details of the selected contact
 * @param {Number} id - ID of the contact that needs to be edited. It is used to retrieve the contact details and populate the edit contact menu
 *  with the existing information
 */
function openEditContactMenu(id) {
    document.getElementById('contact_menu_header').innerHTML = 'Edit contact';
    document.getElementById('contact_menu_subheader').classList.add('d-none');
    document.getElementById('contact_form').setAttribute('onsubmit', 'saveContact(); return false;');
    switchContactElements('add_contact_buttons', 'edit_contact_buttons');
    switchContactElements('user_icon', 'edit_menu_initials');
    fillEditContactMenuElements(id);
}

/**
 * Switches the visibility of two elements by adding and removing a 'd-none' class 
 * @param {String} id1 - ID of the element that needs to be hidden
 * @param {String} id2 - ID of the element that will be visible
 */
function switchContactElements(id1, id2) {
    document.getElementById(id1).classList.add('d-none');
    document.getElementById(id2).classList.remove('d-none');
}

/**
 * Fills and adds onclick functions to elements in the edit contact menu based on the index of a contact
 * @param {Number} id - ID of the contact used to locate the contact in the contacts array
 */
function fillEditContactMenuElements(id) {
    let index =  getIndexOfContact(id, contacts);
    fillEditContactMenuInputs(index);
    fillEditContactMenuInitials(index);
    addOnclickFunctions(index);
}

/**
 * Fills input fields in an edit contact menu with data from a specific contact object
 * @param {Number} index - Index of the contact used to retrieve the contact's information (name, email, phone) from the contacts array and fill the
 * corresponding input fields in the edit contact menu
 */
function fillEditContactMenuInputs(index) {
    document.getElementById('inputName').value = contacts[index].name;
    document.getElementById('inputEmail').value = contacts[index].email;
    document.getElementById('inputPhone').value = contacts[index].phone;
}

/**
 * Fills the initials and color of a contact in an edit menu
 * @param {Number} index - Index of the contact used to access the specific contact's information (initials, color) in the contacts array
 */
function fillEditContactMenuInitials(index) {
    document.getElementById('edit_menu_initials').innerHTML = contacts[index].initials;
    document.querySelector('.menu_circle').style.backgroundColor = contacts[index].color;
}

/**
 * Sets onclick functions for delete and save buttons with a given index
 * @param {Number} index - Index of the contact used to identify which contact should be deleted or saved when the corresponding buttons are clicked
 */
function addOnclickFunctions(index) {
    document.getElementById('delete_button').setAttribute('onclick', `deleteContact(${index})`);
    document.getElementById('save_button').setAttribute('onclick', `saveContact(${index})`);
}

/**
 * Closes the contact menu and hides error reports
 */
function closeContactMenu() {
    if (window.innerWidth <= 900) {
        hideSlideContainer('contact_menu', 'translateY(150%)');
    } else {
        hideSlideContainer('contact_menu', 'translateX(150%)');
    }
    document.getElementById('partitionWindow').classList.add('d-none');
    switchContactElements('existing_contact_info', 'contact_form');
    closeErrorReports(contactErrorReports);
}


/*_________________________Add/Edit/Delete Contact Functions___________________________*/

/**
 * Adds a new contact to the list of contacts and displays a confirmation message
 */
async function addContact() {
    let newContact = createNewContact();
    if (contactNotAdded(newContact)) {
        contacts.push(newContact);
        await saveContacts();
        closeContactMenu();
        openContactInfo(newContact.id);
        renderContactList();
        document.getElementById(`${newContact.id}`).scrollIntoView();
        showContactConfirmation(newContact.id, 'Contact successfully created');
    }
}

/**
 * Creates and returns a new contact object with a unique ID, name, initials, email, phone number, and a randomly generated color
 * @returns {contact} - new contact object
 */
function createNewContact() {
    let id = getNewId(contacts);
    let name = document.getElementById('inputName').value;
    name = firstLettersToUpperCase(name);
    let initials = createInitials(name);
    let email = document.getElementById('inputEmail').value;
    email = email.toLowerCase();
    let phone = document.getElementById('inputPhone').value;
    let color = createRandomRGBColor();
    let newContact = {
        'id' : id,
        'name' : name,
        'initials' : initials,
        'email' : email,
        'phone' : phone,
        'color' : color
    };
    return newContact;
}

/**
 * Saves changes made to a contact, updates the contact list, and displays a confirmation
 * @param {Number} index - Index of contact in the contacts array
 */
async function saveContact(index) {
    await changeContactData(index);
    addContactInformation(contacts[index].id);
    closeContactMenu();
    renderContactList();
    document.getElementById(`${contacts[index].id}`).scrollIntoView();
    showContactConfirmation(`${contacts[index].id}`, 'Contact successfully edit');
}

/**
 * Changes the contact data of a specific index in the contacts array and saves the changes
 * @param {Number} index - Index of the contact in the contacts array that needs to be updated
 */
async function changeContactData(index) {
    let name = document.getElementById('inputName').value;
    contacts[index].name = firstLettersToUpperCase(name);
    contacts[index].initials = createInitials(contacts[index].name);
    let email = document.getElementById('inputEmail').value;
    contacts[index].email = email.toLowerCase();
    contacts[index].phone = document.getElementById('inputPhone').value;
    await saveContacts();
}

/**
 * Deletes a contact from the contacts array, saves the updated array, hides the contact_info_container, closes a menu or information container 
 * depending on screen size, renders the updated contact list, and shows a confirmation message for the deleted contact
 * @param {Number} index - Index of the contact in the contacts array that needs to be deleted
 */
async function deleteContact(index) {
    contacts.splice(index, 1);
    await saveContacts();
    hideSlideContainer('contact_info_container');
    if (window.innerWidth <= 900) {
        closeContactInfo();
    } else {
        closeContactMenu();
    }
    renderContactList();
    showDeleteContactConfirmation();
}

/**
 * Displays a confirmation message for 2 seconds that a contact added successfully and highlights the contact in the contact list
 * @param {String} id - ID of the contact list element that is highlighted
 * @param {String} confirmation - Message that will be displayed in the contact confirmation container
 */
function showContactConfirmation(id, confirmation) {
    document.getElementById('contactConfirmation').innerHTML = confirmation;
    displaySlideContainer('contactConfirmation', 'translateY(0%)');
    document.getElementById(id).style.backgroundColor = 'var(--darkBlue2-color)';
    document.getElementById(id).style.color = 'var(--white-color)';
    setTimeout(() => {
        hideSlideContainer('contactConfirmation', 'translateY(400%)');
        document.getElementById(id).style.backgroundColor = 'var(--white-color)';
        document.getElementById(id).style.color = 'var(--black-color)';
    }, 2000);
}

/**
 * Displays a confirmation message for a successfully deleted contact and hides it after 2 seconds
 */
function showDeleteContactConfirmation() {
    document.getElementById('contactConfirmation').innerHTML = 'Contact successfully deleted';
    displaySlideContainer('contactConfirmation', 'translateY(0%)');
    setTimeout(() => {
        hideSlideContainer('contactConfirmation', 'translateY(1000%)');
    }, 2000);
}

/**
 * Checks if a new contact can be added to the contact list without creating duplicates based on name, email, and phone number
 * @param {contact} newContact - New created contact object that needs to be added to the contact list
 * @returns {Boolean} - Returns `false` if the new contact being added already exists in the `contacts` array, and `true` if the new
 * contact can be added without any conflicts
 */
function contactNotAdded(newContact) {
    for (i = 0; i < contacts.length; i++) {
        if (contacts[i].name === newContact.name && contacts[i].email === newContact.email) {
            openExistingContactInfo(i, 'email');
            return false;
        } else if (contacts[i].name === newContact.name && contacts[i].phone === newContact.phone) {
            openExistingContactInfo(i, 'phone number');
            return false;
        }
    }
    return true;
}

/**
 * Opens existing contact information and displays a message indicating that the contact already exists
 * @param {Number} index - Index of existing contact
 * @param {String} contactdata - String used to display a message to the user indicating that a contact with the same name and information already exists
 */
function openExistingContactInfo(index, contactdata) {
    switchContactElements('contact_form', 'existing_contact_info');
    document.getElementById('matching_input_report').innerHTML = `The contact with name and ${contactdata} already exist.`;
    document.getElementById('show_contact_button').setAttribute('onclick', `showExistingContact(${index})`);
}

/**
 * Opens the existing contact information and switches the display from the contact form
 * @param {Number} index - Index of existing contact in the contacts array used to access the specific contact's information
 */
function showExistingContact(index) {
    openContactInfo(contacts[index]['id']);
    closeContactMenu();
    switchContactElements('existing_contact_info', 'contact_form');
    document.getElementById(`${contacts[index].id}`).scrollIntoView();
}


/*_____________________________General Functions________________________________*/

/**
 * Returns the index of a contact of the contacts array based on its ID
 * @param {Number} id - ID of the searched contact
 * @param {Array<contact>} contactArray - Array of contact objects
 * @returns {Number} - Index of the contact of the contacts array
 */
function getIndexOfContact(id, contactArray) {
    for (let i = 0; i < contactArray.length; i++) {
        if (id === contactArray[i].id) {
            return i;
        }
    }
}

/**
 * Saves a list of contacts as a JSON string in local storage.
 */
async function saveContacts() {
    await setItem('contact', JSON.stringify(contacts));
}

/**
 * Rewrite SVG files read by img tags to inline codes for changing attributes
 */
window.addEventListener('load', function() {
    deSVG('.edit_contact_img', true);
    deSVG('.add_task_img', true);
});

/**
 * Displays contact_list and contact_info container if media query matches min-width 900
 */
queries.addEventListener('change', event => {
	if (event.matches) {
        document.getElementById('contact_list').style.display = 'unset';
        document.getElementById('contact_info').style.display = 'unset';
        document.getElementById('new_contact_button').style.display = 'unset';
        document.getElementById('mobile_contact_info_button_container').style.display = 'none';
	}
});

/**
 * Displays or hides contact_list or contact_info container if media query matches max-width 900 
 */
mobileQueries.addEventListener('change', event => {
	if (event.matches && openInfo == false) {
        changeContent('none', 'unset');
        document.getElementById('mobile_contact_info_button_container').style.display = 'none';
	} else if (event.matches && openInfo == true) {
        changeContent('unset', 'none');
        document.getElementById('mobile_contact_info_button_container').style.display = 'flex';
	}
});

/**
 * Displays or hides contact_list or contact_info container
 * @param {String} displayStyle1 - Display-style of element
 * @param {String} displayStyle2 - Display-style of element
 */
function changeContent(displayStyle1, displayStyle2) {
    document.getElementById('contact_list').style.display = displayStyle2;
    document.getElementById('new_contact_button').style.display = displayStyle2;
    document.getElementById('contact_info').style.display = displayStyle1;
}
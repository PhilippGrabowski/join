/*________________________________________________Settings______________________________________________*/

/**
 * @type {Array.<Number>} - Array that includes the index of all selected contacts from the contact list
 */
let contactIndexArray = [];
/**
 * @type {Array.<Number>} - Array that includes the index of all selected and invited contacts from the contact list
 */
let invitedContactIndexArray = [];
/**
 * @type {Array.<String>} - Array containing all emails invited to a task 
 */
let invitedContacts = [];
/**
 * @type {Boolean} - Is true, if a contact is invited, service as memory
 */
let invitedContact = false;
/**
 * @type {Array.<{account}>}
 * Array that includes the object of the active Account 
 */
let onlineAccount = [];
/**
 * @type {Number} - Amount of selected contacts
 */
let selectedContactAmount = 0;


/*______________________________________Contact Select Functions_____________________________________*/

/**
 * Toggles the visibility of a contact list and renders either the list or the initials of selected contacts
 * @param {String} listId - List container ID for the contacts
 * @param {String} initialContainer - Container for the contact initials
 * @param {String} inviteNewContactId - ID of invite new contact list element
 * @param {String} newContactInputId - ID of the assign new contact inputfield
 * @param {String} selectContactContainerId - ID of the select contact input container
 * @param {String} selectNewContactContainerId - ID of the select new contact input container
 * @param {String} menu - String used to separate the checkboxes of add task menu and edit task menu by adding a ID additionally
 * @param {Array<contact>} contactArray - Array of contact objects
 */
function toggleContactList(listId, initialContainer, inviteNewContactId, newContactInputId, selectContactContainerId, selectNewContactContainerId, menu, contactArray) {
    let contactList = document.getElementById(listId);
    contactList.scrollTop = 0;
    if (contactList.classList.contains('d-none')) {
        openContactList(listId, contactList, initialContainer, inviteNewContactId, newContactInputId, selectContactContainerId, selectNewContactContainerId, menu, contactArray);
    } else {
        closeContactList(contactList, initialContainer, contactArray);
    }
}

/**
 * Opens and renders the contact list
 * @param {String} listId - List container ID for the contacts
 * @param {Element} contactList - Contact list container
 * @param {String} initialContainer - Container for the contact initials
 * @param {String} inviteNewContactId - ID of invite new contact list element
 * @param {String} newContactInputId - ID of the assign new contact inputfield
 * @param {String} selectContactContainerId - ID of the select contact input container
 * @param {String} selectNewContactContainerId - ID of the select new contact input container
 * @param {String} menu - String used to separate the checkboxes of add task menu and edit task menu by adding a ID additionally
 * @param {Array<contact>} contactArray - Array of contact objects
 */
function openContactList(listId, contactList, initialContainer, inviteNewContactId, newContactInputId, selectContactContainerId, selectNewContactContainerId, menu, contactArray) {
    let categoryList = document.getElementById('category_list');
    categoryList.classList.add('d-none');
    document.getElementById(initialContainer).innerHTML = '';
    renderContactList(listId, contactList, inviteNewContactId, newContactInputId, selectContactContainerId, selectNewContactContainerId, menu, contactArray);
    contactList.classList.remove('d-none');
    firstOpen = true;
    selectedContactAmount = 0;
}

/**
 * Hides the contact list and renders the initials of the contacts as well as the invited contacts
 * @param {Element} contactList - Contact list container
 * @param {String} initialContainer - Container for the contact initials
 * @param {Array<contact>} contactArray - Array of contact objects
 */
function closeContactList(contactList, initialContainer, contactArray) {
    contactList.classList.add('d-none');
    getSelectedContactsAmount();
    renderContactInitials(initialContainer, contactArray);
    renderInvitedContacts(initialContainer, contactArray);
}

/**
 * Renders contact list including the contacts and the invite contact option
 * @param {String} listId - List container ID for the contacts
 * @param {HTMLElement} element - Container of the contact list
 * @param {String} inviteNewContactId - ID of invite new contact list element
 * @param {String} newContactInputId - ID of the assign new contact inputfield
 * @param {String} selectContactContainerId - ID of the select contact input container
 * @param {String} selectNewContactContainerId - ID of the select new contact input container
 * @param {String} menu - String used to separate the checkboxes of add task menu and edit task menu by adding a ID additionally
 * @param {Array<contact>} contactArray - Array of contact objects
 */
function renderContactList(listId, element, inviteNewContactId, newContactInputId, selectContactContainerId, selectNewContactContainerId, menu, contactArray) {
    element.innerHTML = '';
    renderContactListElement(listId, element, menu, contactArray);
    renderInviteContactOption(element, inviteNewContactId, newContactInputId, selectContactContainerId, selectNewContactContainerId, contactArray);
}

/**
 * Renders the active account, contacts and new invited contacts list elements
 * Than adjusts the padding for the list elements as well as the checkmarks for the checkboxes
 * @param {String} listId - List container ID for the contacts
 * @param {HTMLElement} element - Container of the contact list
 * @param {String} menu - String used to separate the checkboxes of add task menu and edit task menu by adding a ID additionally
 * @param {Array<contact>} contactArray - Array of contact objects
 */
function renderContactListElement(listId, element, menu, contactArray) {
    renderOnlineAccount(element, menu);
    renderContacts(element, menu, contactArray);
    renderNewContacts(element, menu, contactArray);
    adjustListPadding(`#${listId} .list_element`, contactArray, '21', '15', '13.1');
    adjustCheckmark(contactArray);
}

/**
 * Renders the active Account list element into the contact list
 * @param {HTMLElement} element - Container of the contact list
 * @param {String} menu - String used to separate the checkboxes of add task menu and edit task menu by adding a ID additionally
 */
function renderOnlineAccount(element, menu) {
    getOnlineAccount();
    if (onlineAccount.length > 0) {
        renderListElement(element, 0, onlineAccount[0].name, contactIndexArray, menu);
        document.querySelector('.checkbox_row:first-of-type').style.backgroundColor = 'rgba(42, 54, 71, 0.1)';
    }
}

/**
 * Pushs the object of the active account to the onlineAccount array
 */
function getOnlineAccount() {
    onlineAccount = [];
    for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].online == true)
        onlineAccount.push(accounts[i]);
    }
}

/**
 * Sorts contacts array alphabetically by name and renders the contacts as list elements into the contact list
 * @param {HTMLElement} element - Container of the contact list
 * @param {String} menu - String used to separate the checkboxes of add task menu and edit task menu by adding a ID additionally
 * @param {Array<contact>} contactArray - Array of contact objects
 */
function renderContacts(element, menu, contactArray) {
    sortArrayByName(contactArray);
    if (onlineAccount.length > 0) {
        for (let i = 0; i < contactArray.length; i++) {
            renderListElement(element, i + 1, contactArray[i].name, contactIndexArray, menu);
        };
    } else {
        for (let i = 0; i < contactArray.length; i++) {
            renderListElement(element, i, contactArray[i].name, contactIndexArray, menu);
        }
    }
}

/**
 * Renders the new invited contacts as list elements into the contact list and sets the checkmark to checked
 * @param {HTMLElement} element - Container of the contact list
 * @param {String} menu - String used to separate the checkboxes of add task menu and edit task menu by adding a ID additionally
 * @param {Array<contact>} contactArray - Array of contact objects
 */
function renderNewContacts(element, menu, contactArray) {
    if (onlineAccount.length > 0) {
        for (let i = 0; i < invitedContacts.length; i++) {
            renderListElement(element, contactArray.length + i + 1, invitedContacts[i], invitedContactIndexArray, menu);
        }
    } else {
        for (let i = 0; i < invitedContacts.length; i++) {
            renderListElement(element, contactArray.length + i, invitedContacts[i], invitedContactIndexArray, menu);
        }
    }
    setCheckmarkForNewInvitedContact(menu, contactArray);
}

/**
 * Sets the checkbox for new invited contacts of checked
 * @param {String} menu - String used to separate the checkboxes of add task menu and edit task menu by adding a ID additionally
 * @param {Array<contact>} contactArray - Array of contact objects
 */
function setCheckmarkForNewInvitedContact(menu, contactArray) {
    let index = contactArray.length + invitedContacts.length;
    if (onlineAccount.length > 0 && invitedContact == true) {
        setCheckmark(`checkbox${menu}${index}`, `clonedCheckbox${menu}${index}`);
    } else if (onlineAccount.length == 0 && invitedContact == true) {
        setCheckmark(`checkbox${menu}${index - 1}`, `clonedCheckbox${menu}${index - 1}`);
    }
    invitedContact = false;
}

/**
 * Sets the checkmark for the checkbox
 * @param {String} box - ID of checkbox
 * @param {String} clonedBox - ID of cloned checkbox
 */
function setCheckmark(boxId, clonedBoxId) {
    let checkbox = document.getElementById(boxId);
    let checked = document.createAttribute("checked");
    checkbox.setAttributeNode(checked);
    document.getElementById(clonedBoxId).style.setProperty('--display', 'block');
}

/**
 * Renders a contact list element with a checkbox for each item in an array
 * @param {HTMLElement} element - Container of the contactlist
 * @param {Number} index - Index of onlineAccount, contacts or invitedContacts array
 * @param {String} name - Name of contact
 * @param {Array.<Number>} array - Array of contactIndexArray or invitedContactIndexArray
 * @param {String} menu - String used to separate the checkboxes of add task menu and edit task menu by adding a ID additionally
 */
function renderListElement(element, index, name, array, menu) {
    element.innerHTML += createContactListElement(index, name, menu);
    addCheckedBox(index, array, menu);
}

/**
 * Sets the checkboxes to checked whose index are stored in the array
 * @param {Number} index - Index of onlineAccount, contacts or invitedContacts array
 * @param {Array.<Number>} array - Array of contactIndexArray or invitedContactIndexArray
 * @param {String} menu - String used to separate the checkboxes of add task menu and edit task menu by adding a ID additionally
 */
function addCheckedBox(index, array, menu) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === index) {
            setCheckmark(`checkbox${menu}${index}`, `clonedCheckbox${menu}${index}`);
        }
    }
}

/**
 * Adjusts the postion of the checkmarks according to the amount of the contacts array
 * @param {Array<contact>} contactArray - Array of contact objects
 */
function adjustCheckmark(contactArray) {
    let elements = document.querySelectorAll('.checkmark');
    elements.forEach(e => {
        if (contactArray.length <= 2) {
            e.style.setProperty('--position', '25px');
        } else {
            e.style.setProperty('--position', '19px');
        }
    }) 
}

/**
 * Renders the invite contact option as a list element
 * @param {HTMLElement} element - Container of the contact list
 * @param {String} inviteNewContactId - ID of invite new contact list element
 * @param {String} newContactInputId - ID of the assign new contact inputfield
 * @param {String} selectContactContainerId - ID of the select contact input container
 * @param {String} selectNewContactContainerId - ID of the select new contact input container
 * @param {Array<contact>} contactArray - Array of contact objects
 */
function renderInviteContactOption(element, inviteNewContactId, newContactInputId, selectContactContainerId, selectNewContactContainerId, contactArray) {
    element.innerHTML += createInviteContactOption(inviteNewContactId, newContactInputId, selectContactContainerId, selectNewContactContainerId);
    adjustInviteContactOption(inviteNewContactId, contactArray);
}

/**
 * Adjusts the padding for invite contact option list element according to the amount of the contacts array
 * @param {String} inviteNewContactId - ID of invite new contact list element
 * @param {Array<contact>} contactArray - Array of contact objects
 */
function adjustInviteContactOption(inviteNewContactId, contactArray) {
    if (contactArray.length <= 2) {
        document.getElementById(inviteNewContactId).style.padding = '13.1px 18px 13.1px 21px';
    }
}

/**
 * Selects contacts by turning checkbox checked or unchecked
 * @param {String} box - ID of checkbox
 * @param {String} clonedBox - ID of cloned checkbox
 */
function selectElement(box, clonedBox) {
    let checkbox = document.getElementById(box);
    if(checkbox.hasAttribute('checked')) {
        checkbox.removeAttribute('checked');
        document.getElementById(clonedBox).style.setProperty('--display', 'none');
    } else {
        let checked = document.createAttribute("checked");
        checkbox.setAttributeNode(checked);
        document.getElementById(clonedBox).style.setProperty('--display', 'block');
    }
}

/**
 * Counts the number of selected checkboxes
 */
function getSelectedContactsAmount() {
    let checkboxes = document.querySelectorAll('.checkbox_row input');
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            selectedContactAmount++;
        }
    }
}

/**
 * Renders the initials of selected contacts and the active account into the initial container element
 * @param {String} initialContainer - Container for the contact initials
 * @param {Array<contact>} contactArray - Array of contact objects
 */
function renderContactInitials(initialContainer, contactArray) {
    let checkboxes = document.querySelectorAll('.checkbox_row input');
    let initialsContainer = document.getElementById(initialContainer);
    initialsContainer.innerHTML = '';
    if (onlineAccount.length > 0) {
        renderWithAccount(checkboxes, initialsContainer, contactArray);
    } else {
        renderAsGuest(checkboxes, initialsContainer, contactArray);
    } 
}

/**
 * Renders the active account and contact initials based on selected checkboxes and adds them to the initial container
 * @param {Array.<Element>} checkboxes - array of HTML input elements with type "checkbox"
 * @param {Element} initialContainer - Initial container element
 * @param {Array<contact>} contactArray - Array of contact objects
 */
function renderWithAccount(checkboxes, initialContainer, contactArray) {
    let newContactAmount = checkboxes.length - contactArray.length - 1;
    contactIndexArray = [];
    for (let i = 0; i < checkboxes.length - newContactAmount; i++) {
        if (checkboxes[i].checked) {
            if (i == 0) {
                initialContainer.innerHTML += createContactInitial(onlineAccount[0].color, onlineAccount[0].initials);
            } else if (contactIndexArray.length == 4 && selectedContactAmount > 5) {
                initialContainer.innerHTML += createContactInitial('black', `+${selectedContactAmount - 4}`);
            }
            else if (contactIndexArray.length < 5) {
                initialContainer.innerHTML += createContactInitial(contactArray[i - 1].color, contactArray[i - 1].initials);
            }
            contactIndexArray.push(i);
        }
    }
}

/**
 * Renders contact initials based on selected checkboxes and adds them to the initial container
 * @param {Array.<Element>} checkboxes - array of HTML input elements with type "checkbox"
 * @param {Element} initialContainer - Initial container element
 * @param {Array<contact>} contactArray - Array of contact objects
 */
function renderAsGuest(checkboxes, initialContainer, contactArray) {
    let newContactAmount = checkboxes.length - contactArray.length;
    contactIndexArray = [];
    for (let i = 0; i < checkboxes.length - newContactAmount; i++) {
        if (checkboxes[i].checked) {
            if (contactIndexArray.length == 4 && selectedContactAmount > 5) {
                initialContainer.innerHTML += createContactInitial('black', `+${selectedContactAmount - 4}`);
            } else if (contactIndexArray.length < 5) {
                initialContainer.innerHTML += createContactInitial(contactArray[i].color, contactArray[i].initials);
            }
            contactIndexArray.push(i);
        }
    }
}

/**
 * Renders the icons for the invited contacts into the initial container element
 * @param {String} initialContainer - Container for the contact initials
 * @param {Array<contact>} contactArray - Array of contact objects
 */
function renderInvitedContacts(initialContainer, contactArray) {
    let checkboxes = document.querySelectorAll('.checkbox_row input');
    let initialsContainer = document.getElementById(initialContainer);
    let newContactAmount = checkboxes.length - contactArray.length;
    if (onlineAccount.length > 0) {
        newContactAmount = checkboxes.length - (contactArray.length + 1);
    }
    createIcons(checkboxes, initialsContainer, newContactAmount);
}

/**
 * Creates icons for selected checkboxes and adds them into the initial container element
 * @param {Array.<Element>} checkboxes - array of HTML input elements with type "checkbox"
 * @param {Element} initialContainer - Initial container element
 * @param {Number} newContactAmount - Amount of new invited contact list elements
 */
function createIcons(checkboxes, initialContainer, newContactAmount) {
    invitedContactIndexArray = [];
    for (let i = checkboxes.length - newContactAmount; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            invitedContactIndexArray.push(i);
            if (contactIndexArray.length + invitedContactIndexArray.length <= 5 && selectedContactAmount <= 5) {
                initialContainer.innerHTML += `<i class='bx bxs-user-circle invited_contact'></i>`;
            } else if (contactIndexArray.length + invitedContactIndexArray.length <= 5 && selectedContactAmount > 5) {
                initialContainer.innerHTML += createContactInitial('black', `+${selectedContactAmount - 4}`);
            }
        }
    }
}

/**
 * Adds a new contact to the invitedContacts array
 * @param {String} initialContainer - Container for the contact initials
 * @param {String} newContactError - Error message container for adding new contact
 * @param {String} newContactInputId - ID of the assign new contact inputfield
 * @param {String} selectContactContainerId - ID of the select contact input container
 * @param {String} selectNewContactContainerId - ID of the select new contact input container
 * @param {String} listId - List container ID for the contacts
 * @param {String} inviteNewContactId - ID of invite new contact list element
 * @param {String} menu - String used to separate the checkboxes of add task menu and edit task menu by adding a ID additionally
 * @param {Array<contact>} contactArray - Array of contact objects
 */
function inviteNewContact(initialContainer, newContactError, newContactInputId, selectContactContainerId, selectNewContactContainerId, listId, inviteNewContactId, menu, contactArray) {
    if (checkValidInput(newContactError)) {
        document.getElementById(newContactError).style.color = 'var(--white2-color)';
        let newContact = document.getElementById(newContactInputId).value;
        newContact = newContact.toLowerCase();
        invitedContacts.push(newContact);
        invitedContactIndexArray.push(contacts.length + (invitedContacts.length - 1));
        invitedContact = true;
        selectedContactAmount++;
        closeInviteNewContact(newContactError, selectContactContainerId, selectNewContactContainerId, listId, initialContainer, inviteNewContactId, newContactInputId, menu, contactArray);
        if (selectedContactAmount <= 5) {
            let initialsContainer = document.getElementById(initialContainer);
            initialsContainer.innerHTML += `<i class='bx bxs-user-circle invited_contact'></i>`;
        }
    }
}

/**
 * Opens the new contact invitation input element
 * @param {String} newContactInputId - ID of the assign new contact inputfield
 * @param {String} selectContactContainerId - ID of the select contact input container
 * @param {String} selectNewContactContainerId - ID of the select new contact input container
 */
function openInviteNewContact(newContactInputId, selectContactContainerId, selectNewContactContainerId) {
    document.getElementById(newContactInputId).value = '';
    toggleTwoElements(selectContactContainerId, selectNewContactContainerId);
}

/**
 * Closes the new contact invitation input element
 * @param {String} newContactError - Error message container for adding new contact
 * @param {String} selectContactContainerId - ID of the select contact input container
 * @param {String} selectNewContactContainerId - ID of the select new contact input container
 * @param {String} listId - List container ID for the contacts
 * @param {String} initialContainer - Container for the contact initials
 * @param {String} inviteNewContactId - ID of invite new contact list element
 * @param {String} newContactInputId - ID of the assign new contact inputfield
 * @param {String} menu - String used to separate the checkboxes of add task menu and edit task menu by adding a ID additionally
 * @param {Array<contact>} contactArray - Array of contact objects
 */
function closeInviteNewContact(newContactError, selectContactContainerId, selectNewContactContainerId, listId, initialContainer, inviteNewContactId, newContactInputId, menu, contactArray) {
    document.getElementById(newContactError).style.color = 'var(--white2-color)';
    toggleTwoElements(selectContactContainerId, selectNewContactContainerId);
    toggleContactList(listId, initialContainer, inviteNewContactId, newContactInputId, selectContactContainerId, selectNewContactContainerId, menu, contactArray);
}
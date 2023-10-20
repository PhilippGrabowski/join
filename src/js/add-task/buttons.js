/*________________________________________________Settings______________________________________________*/

/**
 * @type {Array.<String>} - Array of ID's of error report elements for title, description, due date
 */
let addTaskErrorReport = ['title_error', 'description_error', 'dueDate_error'];
/**
 * @type {Array.<String>} - Array of ID's of input elements for title, description, due date
 */
let addTaskInputIds = ['title', 'description', 'dueDate'];
/**
 * @type {Array.<String>} - Array of ID's of container elements for displaying the amount of chars
 */
let countContainer = ['title_amount_container', 'textarea_amount_container', 'category_amount_container', 'subtask_amount_container'];
/**
 * @typedef teams
 * @type {Object} - Object of all added contacts (including account, contacts, invitations) to a task
 * @prop {Array.<account>} account - Active account object
 * @prop {Array.<contact>} contacts - Array of contact objects
 * @prop {Array.<String>} invitations - Array of invited contacts (emails)
 */
/**
 * @type {teams}
 */
let teams = {
    'account' : [],
    'contacts' : [],
    'invitations' : []
};
/**
 * @typedef task
 * @type {Object} - Task object
 * @prop {{category}} category - Category of the task
 * @prop {String} description - Description of the task
 * @prop {Date} dueDate - Due date of the task
 * @prop {Number} id - ID of the task
 * @prop {{name: String, color: String}} priority - Priority of the task
 * @prop {String} status - Status of the task (To do)
 * @prop {Array.<subtask>} subtasks - Array of added subtask objects
 * @prop {{teams}} - All added contacts (including account, contacts, invitations) of the task
 * @prop {String} title - Title of the task
 */
/**
 * @type {task}
 */
let task = {
    'id' : '',
    'title' : '',
    'description' : '',
    'category' : '',
    'team' : teams,
    'dueDate' : '',
    'priority' : '',
    'subtasks' : [],
    'status' : 'To do'
};


/*________________________________________Cancel Button Functions______________________________________*/

/**
 * The function clears all inputs and resets various elements on the page
 * @param {Number} start - Start index for looping through priority buttons
 */
function clearAddTask(start) {
    resetAllInputs();
    resetAllPrioButtons(start);
    for (let i = 0; i < countContainer.length; i++) {
        document.getElementById(countContainer[i]).classList.add('d-none');
    }
    resetCategory();
    resetContact();
    resetSubtask();
}

/**
 * Resets the state of all priority buttons by changing their colors
 * @param {Number} start - Start index for looping through priority buttons
 */
function resetAllPrioButtons(start) {
    for (let i = start; i < start + priorities.length; i++) {
        toggleSelectedPriorityButton(`priority_button${i}`, 'var(--white-color)', 'var(--black-color)', priorities[i - start].color);
    }
    prio = undefined;
}

/**
 * The function resets all input fields and error reports, and toggles priority buttons to their default state
 */
function resetAllInputs() {
    for (let i = 0; i < addTaskInputIds.length; i++) {
        document.getElementById(addTaskInputIds[i]).value = '';
        document.getElementById(addTaskErrorReport[i]).style.color = 'var(--white2-color)';
    }
    dueDate = undefined;
}

/**
 * Resets the category select field
 */
function resetCategory() {
    let category = document.getElementById('select_typ');
    category.innerHTML = '<span>Select task category</span>';
    let newCategory = document.getElementById('select_new_category');
    if (newCategory.classList.contains('d-none') == false) {
        cancelNewCategory();
    }
    let categoryList = document.getElementById('category_list');
    if (categoryList.classList.contains('d-none') == false) {
        toggleCategoryList();
    }
}

/**
 * Resets the contact select field and all related variables
 */
function resetContact() {
    contactIndexArray = [];
    invitedContacts = [];
    invitedContactIndexArray = [];
    invitedContact = false;
    selectedContactAmount = 0;
    document.getElementById('contact_initials_container').innerHTML = '';
    removeCheckmarks();
    let newContact = document.getElementById('select_new_contact');
    if (newContact.classList.contains('d-none') == false) {
        closeInviteNewContact('new_contact_error', 'select_contact', 'select_new_contact', 'add_Task_contact_list', 'contact_initials_container', 'invite_new_contact', 'new_contact', 'AddTask', contacts);
    }
    let contactList = document.getElementById('add_Task_contact_list');
    if (contactList.classList.contains('d-none') == false) {
        toggleContactList('add_Task_contact_list', 'contact_initials_container', 'invite_new_contact', 'new_contact', 'select_contact', 'select_new_contact', 'AddTask', contacts);
    }
}

/**
 * Removes all checkmarks of the checkboxes from the contact list
 */
function removeCheckmarks() {
    let checkmarks = document.querySelectorAll('#add_Task_contact_list div.list_element');
    for (let i = 0; i < checkmarks.length; i++) {
        document.getElementById(`checkboxAddTask${i}`).removeAttribute('checked');
        document.getElementById(`clonedCheckboxAddTask${i}`).style.setProperty('--display', 'none');
    }
}

/**
 * Resets subtask input field
 */
function resetSubtask() {
    subtasks = [];
    document.getElementById('subtask_list').innerHTML = '';
    cancelAddSubtask();
}

function closeSelectInputs() {
    let newCategory = document.getElementById('select_new_category');
    if (newCategory.classList.contains('d-none') == false) {
        cancelNewCategory();
    }
    let categoryList = document.getElementById('category_list');
    if (categoryList.classList.contains('d-none') == false) {
        toggleCategoryList();
    }
    let newContact = document.getElementById('select_new_contact');
    if (newContact.classList.contains('d-none') == false) {
        closeInviteNewContact('new_contact_error', 'select_contact', 'select_new_contact', 'add_Task_contact_list', 'contact_initials_container', 'invite_new_contact', 'new_contact', 'AddTask', contacts);
    }
    let contactList = document.getElementById('add_Task_contact_list');
    if (contactList.classList.contains('d-none') == false) {
        toggleContactList('add_Task_contact_list', 'contact_initials_container', 'invite_new_contact', 'new_contact', 'select_contact', 'select_new_contact', 'AddTask', contacts);
    }
}


/*________________________________________Create Button Functions______________________________________*/

/**
 * Adds a new task to the list of tasks2 and saves it
 */
async function addtask(status) {
    let contactList = document.getElementById('add_Task_contact_list');
    if (contactList.classList.contains('d-none') === false) {
        closeContactList(contactList, 'contact_initials_container', contacts);
    }
    let id = getNewId(tasks2);
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;
    let category = createCategoryObject();
    getTeam(contacts, 'checkboxAddTask0');
    let priority = getPriority();
    if (checkRequiredInputs(addTaskInputIds, addTaskErrorReport)) {
        let task = createTask(id, title, description, category, dueDate, priority, status);
        tasks2.push(task);
        await saveTask();
        window.location.href = 'board.html';
    }
}

/**
 * Creates and returns a category object with a name and color based on the selected category or a default category if none is selected
 * @returns {{name: string, color: string}} - Category object
 */
function createCategoryObject() {
    let categoryName = document.querySelector('#select_typ span').innerHTML;
    let color = getCategoryColor(categoryName);
    if (categoryName == 'Select task category') {
        let category = {
            'name' : 'Basic',
            'color' : 'rgb(63, 63, 63)'
        }
        return category;
    } else {
        let category = {
            'name' : categoryName,
            'color' : color
        }
        return category;
    }
}

/**
 * Returns the color associated with a given category name from an array of categories
 * @param {String} categoryName - Name of category
 * @returns {String} - Color associated with the input category name from the `categories` array
 */
function getCategoryColor(categoryName) {
    for (let i = 0; i < categories.length; i++) {
        if (categories[i].name == categoryName) {
            return categories[i].color;
        }
    }
}

/**
 * Determines whether to get the team with an active online account or as a guest
 * @param {Array<contact>} contactArray - Array of contact objects
 * @param {String} firstCheckbox - First checkbox of the contact list
 */
function getTeam(contactArray, firstCheckbox) {
    teams = {'account' : [], 'contacts' : [], 'invitations' : []};
    if (onlineAccount.length > 0) {
        getTeamWithActiveAccount(contactArray, firstCheckbox);
    } else {
        getTeamAsGuest(contactArray);
    }
}

/**
 * Adds the team members based on selected contacts and online account, and then retrieves invitations
 * @param {Array<contact>} contactArray - Array of contact objects
 * @param {String} firstCheckbox - First checkbox of the contact list
 */
function getTeamWithActiveAccount(contactArray, firstCheckbox) {
    let accountBox = document.getElementById(firstCheckbox);
    for (let i = 0; i < contactIndexArray.length; i++) {
        if (i == 0 && accountBox.checked) {
            teams.account.push(onlineAccount[0]);
        } else {
            teams.contacts.push(contactArray[contactIndexArray[i] - 1]);
        }
    }
    getInvitations(contactArray.length + 1, contactArray.length + 1 + invitedContacts.length);
}

/**
 * Adds the team members based on selected contacts and then retrieves invitations
 * @param {Array<contact>} contactArray - Array of contact objects
 */
function getTeamAsGuest(contactArray) {
    for (let i = 0; i < contactIndexArray.length; i++) {
        teams.contacts.push(contactArray[contactIndexArray[i]]);
    }
    getInvitations(contactArray.length, contactArray.length + invitedContacts.length);
}

/**
 * Adds invited contacts to a team's invitations array based on their index
 * @param {Number} loopStart - Starting index of the loop
 * @param {Number} loopEnd - End point of the loop
 */
function getInvitations(loopStart, loopEnd) {
    for (let i = loopStart; i < loopEnd; i++) {
        for (j = 0; j < invitedContactIndexArray.length; j++) {
            if (i == invitedContactIndexArray[j]) {
                teams.invitations.push(invitedContacts[i - (loopStart)]);
            }
        }
    }
    if (invitedContact) {
        teams.invitations.push(invitedContacts[invitedContacts.length - 1]);
    }
}

/**
 * Returns selected priority, if no selection was made it returns priority low
 * @returns {{name: String, color: String}} - Priority object
 */
function getPriority() {
    if (prio !== undefined) {
        return priorities[prio];
    } else {
        return priorities[2];
    }
}

/**
 * Checks if all required inputs are filled and if the due date is not in the past
 * @param {Array.<input>} inputArray - Array of ID's of input elements for title, description, due date
 * @param {Array.<input>} errorReportIdArray - Array of ID's of error report elements for title, description, due date
 * @returns {Boolean} - Returns true if all required input fields are filled and the due date is not in the past, otherwise it returns false
 * 
 */
function checkRequiredInputs(inputArray, errorReportIdArray) {
    setinputArray(inputArray)
    let requiredInputs = 0;
    for (let i = 0; i < inputArray.length; i++) {
        let input = document.getElementById(inputArray[i]).value;
        if (i != 2 && input != '') {
            requiredInputs++;
        } else if (i == 2 && input != '' && input != 'dd/mm/yyyy') {
            requiredInputs++;
        }
        else {
            displayError(errorReportIdArray[i], 'This field is required');
        }
    }
    return requiredInputs == 3;
}

/**
 * Updates the values of `addTaskInputIds` and `addTaskErrorReport` based on the the window width and passed parameter
 * @param {Array.<input>} inputArray - Array of ID's of input elements for title, description, due date
 */
function setinputArray(inputArray) {
    if (inputArray === addTaskInputIds && window.innerWidth < 1097) {
        addTaskInputIds[2] = 'dueDate2';
        addTaskErrorReport[2] = 'dueDate2_error';
    } else if (inputArray === addTaskInputIds) {
        addTaskInputIds[2] = 'dueDate';
        addTaskErrorReport[2] = 'dueDate_error';
    }
}

/**
 * Creates and returns a task object 
 * @param {Number} id - Id of task object
 * @param {String} title - Title of task object
 * @param {String} description - Description of task object
 * @param {{category}} category - Category of task object
 * @param {String} dueDate - Due date of task object
 * @param {{name: String, color: String}} priority - Priority of task object
 * @returns {{task}}
 */
function createTask(id, title, description, category, dueDate, priority, status) {
    task =   {
        'id' : id,
        'title' : title,
        'description' : description,
        'category' : category,
        'team' : teams,
        'dueDate' : dueDate,
        'priority' : priority,
        'subtasks' : subtasks,
        'status' : status
    }
    return task;
}

/**
 * Saves a JSON string of tasks2 to local storage using the setItem method.
 */
async function saveTask() {
    await setItem('tasks2', JSON.stringify(tasks2));
}
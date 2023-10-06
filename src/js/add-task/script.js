/*__________________________________________________Settings________________________________________________*/

/**
 * @type {Number} - Number is 1 if priority is selected and 0 if not, service as memory
 */
let count = 0;
/**
 * @type {Date} - Picked due date of the task
 */
let dueDate;
/**
 * @type {Number | undefined} - Number that equals the index of priorities
 */
let prio;
/**
 * @type {Array.<{name: String, color: String}>} - Array of selectable priorities
 */
let priorities = [
    {
        'name' : 'urgent',
        'color' : 'rgb(255, 61, 0)'
    },
    {
        'name' : 'medium',
        'color' : 'rgb(255, 195, 80)'
    },
    {
        'name' : 'low',
        'color' : 'rgb(2, 207, 47)'
    }
];
/**
 * @typedef subtask
 * @type {Object} - Subtask object
 * @prop {String} name - Name of the subtask
 * @prop {Boolean} status - Status of the subtask
 */
/**
 * @type {subtask} - Subtask object
 */
let subtask = {
    'name' : '',
    'status' : false
};
/**
 * @type {Array.<{subtask}>} subtasks - Array of subtasks of the task
 */
let subtasks = [];

/**
 * Loads categories, contacts, accounts, and tasks, and then initializes the header initials
 */
async function loadData() {
    await loadCategories();
    await loadContacts();
    await loadAccounts();
    await loadTasks();
    loadHeaderInitials();
}

/*__________________________________________Input Count Functions____________________________________________*/

/**
 * Counts the amount of chars in the input field und displays a warning according when a specific amount is reached
 * @param {Element} inputfield - Inputfield whose characters are counted
 * @param {String} id - ID of element that contains the char amount
 */
function countChar(inputfield, id) {
    let amount = inputfield.value.length;
    let element = document.getElementById(`${id}_amount`);
    if (amount > 0) {
        element.textContent = amount;
        displayWarning(element, amount, id);
        document.getElementById(`${id}_amount_container`).classList.remove('d-none');
    } else {
        document.getElementById(`${id}_amount_container`).classList.add('d-none');
    }
}

/**
 * Displays a warning when a specific amount is reached depending on the input field
 * @param {Element} element - Element that contains the char amount
 * @param {Number} amount - Amount of chars
 * @param {String} id - ID of the relevant input fields
 */
function displayWarning(element, amount, id) {
    switch (id) {
        case 'title' || 'edit_title':
            selectWarningColor(element, amount, 40, 25);
        break;
        case 'edit_title':
            selectWarningColor(element, amount, 40, 25);
        break;
        case 'textarea' || 'edit_textarea':
            selectWarningColor(element, amount, 150, 100);
        break;
        case 'edit_textarea':
            selectWarningColor(element, amount, 150, 100);
        break;
        case 'category':
            selectWarningColor(element, amount, 15, 10);
        break;
        case 'subtask':
            selectWarningColor(element, amount, 25, 15);
        break;
    }
}

/**
 * Select color when a specific min amount is reached
 * @param {Element} element - Element that contains the char amount
 * @param {Number} amount - Amount of chars
 * @param {Number} x - Min amount for warning level red
 * @param {Number} y - Min amount for warning level yellow
 */
function selectWarningColor(element, amount, x, y) {
    if (amount > x) {
        element.style.color = 'var(--red-color)';
    } else if (amount <= x && amount > y) {
        element.style.color = 'var(--lightOrange-color)';
    } else {
        element.style.color = 'var(--black-color)';
    }
}


/*__________________________________________Due Date Functions_______________________________________*/

/**
 * Opens the date picker window
 *  * @param {String} id - ID of dateinput
 *  * @param {String} errorId - ID of dateinput error alert
 */
function openCalender(id, errorId) {
    closeErrorReport(errorId);
    let dateInput = document.getElementById(id);
    dateInput.classList.add('hide_date');
    dateInput.setAttribute('type', 'date');
    let today = new Date().toISOString().split("T")[0];
    dateInput.setAttribute('min', today);
    dateInput.showPicker();
}

/**
 * Closes the date picker window and formats the selected date to dd/mm/yyyy
 * @param {HTMLInputElement} element - Date input element
 * @param {String} id - ID of dateinput
 */
function closeCalender(element, id) {
    let dateInput = document.getElementById(id);
    addDueDate(dateInput);
    dateInput.classList.remove('hide_date');
    element.blur();
}

/**
 * Adds and formats the selected date to dd/mm/yyyy
 * @param {HTMLInputElement} element - Date input element 
 */
function addDueDate(element) {
    dueDate = element.value;
    element.setAttribute('type', 'text');
    element.value = formatDate(dueDate);
    element.style.color = 'var(--black-color)';
}

/**
 * Adds the placeholder to the date input element
 * @param {HTMLInputElement} element - Date input element 
 */
function setInputPlaceholder(element) {
    element.setAttribute('type', 'text');
    element.value = 'dd/mm/yyyy';
    element.style.color = 'rgb(209, 209, 209)';
}

/**
 * Formats the selected due date to dd/mm/yyyy
 * @param {String} date - Selected due date as a string 
 * @returns {String} - Formatted selected due date
 */
function formatDate(date) {
    let dateArray = date.split('-');
    let newDate = dateArray.reverse().join('/');
    return newDate;
}


/*__________________________________________Priority Functions_________________________________________*/

/**
 * Selects the priority of the task and changes the style of the selected button
 * @param {Number} start - Start index for looping through priority buttons
 * @param {Number} index - Index of the priorities array
 */
function selectPriority(start, index) {
    resetPriorityObjectArray();
    for (let i = start; i < start + priorities.length; i++) {
        toggleSelectedPriorityButton(`priority_button${i}`, 'var(--white-color)', 'var(--black-color)', priorities[i - start].color);
    }
    let priorityIndex = setPriorityIndex(index);
    if (prio != priorityIndex || count == 0) {
        prio = priorityIndex;
        toggleSelectedPriorityButton(`priority_button${index}`, priorities[priorityIndex].color, 'var(--white-color)', 'var(--white-color)');
        count++;
    } else {
        count = 0;
        prio = undefined;
    }
}

/**
 * Resets the priorities array to prevent a mistake while rendering edittask menu
 */
function resetPriorityObjectArray() {
    priorities = [
        {
            'name' : 'urgent',
            'color' : 'rgb(255, 61, 0)'
        },
        {
            'name' : 'medium',
            'color' : 'rgb(255, 195, 80)'
        },
        {
            'name' : 'low',
            'color' : 'rgb(2, 207, 47)'
        }
    ];
}

/**
 * Changes the style of the selected button
 * @param {String} id - ID of the priority button
 * @param {String} bgrColor - Background color of the priority button
 * @param {String} fontColor - Font color of the priority button
 * @param {String} iconColor - Icon color of the priority button
 */
function toggleSelectedPriorityButton(id, bgrColor, fontColor, iconColor) {
    let button = document.getElementById(id);
    button.style.backgroundColor = bgrColor;
    button.style.color = fontColor;
    let icons = document.querySelectorAll(`#${id} i`);
    icons.forEach(i => {
        i.style.color = iconColor;
    })
}

/**
 * Returns the index of priority based on the ID number of the priority button
 * @param {Number} index - ID number of the priority button
 */
function setPriorityIndex(index) {
    if (index == 0 || index == 3 || index == 6) {
        return 0;
    } else if (index == 1 || index == 4 || index == 7) {
        return 1;
    } else if (index == 2 || index == 5 || index == 8) {
        return 2;
    }
}

/*__________________________________________Subtask Functions_________________________________________*/

/**
 * Opens the confirmation container to add a subtask
 */
function openConfirmationButtons() {
    document.querySelector('.subtask_input i').classList.add('d-none');
    document.querySelector('.subtask_input .confirmation_container').classList.remove('d-none');
}

/**
 * Closes the confirmation container and resets the subtask input field
 */
function cancelAddSubtask() {
    document.getElementById('subtask').value = '';
    document.querySelector('.subtask_input i').classList.remove('d-none');
    document.querySelector('.subtask_input .confirmation_container').classList.add('d-none');
    document.getElementById('subtask_amount_container').classList.add('d-none');
    document.getElementById('subtask').blur();
}

/**
 * Adds a new subtask to the subtasks array and renders the subtask list
 */
function addSubtask() {
    subtask = createSubtask();
    subtasks.push(subtask);
    renderSubtasks();
    cancelAddSubtask();
}

/**
 * Returns a subtask object
 * @returns {Object} - Subtask object
 */
function createSubtask() {
    let name = document.getElementById('subtask').value;
    subtask = {
        'name' : name,
        'status' : false
    };
    return subtask;
}

/**
 * Renders the subtask list
 */
function renderSubtasks() {
    let subtaskList = document.getElementById('subtask_list');
    subtaskList.innerHTML = '';
    for (let i = 0; i < subtasks.length; i++) {
        subtaskList.innerHTML += createSubtaskListContainer(i);
    }
}

/**
 * Changes the status for the corresponding checkbox
 * @param {String} box - Id of checkbox
 * @param {String} clonedBox - Id of cloned checkbox
 * @param {Number} index - Index of subtasks array
 */
function setStatus(box, clonedBox, index) {
    selectElement(box, clonedBox);
    let checkbox = document.getElementById(box);
    if(checkbox.hasAttribute('checked')) {
        subtasks[index].status = true;
    } else {
        subtasks[index].status = false;
    }
}

/**
 * Deletes subtask from the subtasks array
 * @param {Number} index - Index of subtasks array
 */
function deleteSubtask(index) {
    subtasks.splice(index, 1);
    renderSubtasks();
}


/*__________________________________________General Functions_________________________________________*/

/**
 * Adjusts the padding for list elements according to the amount of the array
 * @param {String} id - ID of element container
 * @param {Array} array - Array (of categories or contacts)
 * @param {String} padd1 - Padding-right of list element while list contains two or less elements
 * @param {String} padd2 - Padding-right of list element while list contains three or more elements
 * @param {String} padd3 - Padding-top and padding-bottom of list element
 */
function adjustListPadding(id, array, padd1, padd2, padd3) {
    let elements = document.querySelectorAll(id);
    elements.forEach(e => {
        if (array.length <= 2) {
            e.style.padding = `${padd3}px ${padd1}px ${padd3}px 21px`;
        } else {
            e.style.padding = `${padd3}px ${padd2}px ${padd3}px 21px`;
        }
    }) 
}

/**
 * Returns a random RGB color
 * @returns {string} - Random RGB color
 */
function createRandomRGBColor() {
    let red = getRandomInt(0, 255);
    let green = getRandomInt(0, 255);
    let blue = getRandomInt(0, 255);
    return `rgb(${red}, ${green}, ${blue})`;
}

/**
 * Returns a random number between a minimum and maximum value
 * @param {number} min - The minimum value of the range from which a random number should be generated
 * @param {number} max - The maximum value that the function can return (inclusive)
 * @returns {number} - random number between the minimum and maximum values (inclusive) provided as arguments
 */
function getRandomInt (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}
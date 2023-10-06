/*_______________________________________Category Select Templates______________________________________*/

/**
 * Returns a new HTML element for adding a new category
 * @returns {HTMLString} - a string containing an HTML element for the "New category" list element that, when clicked, will call the function to add a new category
 */
function createNewCategorySelectElement() {
    return `<div id="add_new_category" class="list_element" onclick="addNewCategory()">New category</div>`
}

/**
 * Returns a category list element with a name, color, and delete icon.
 * @param {Number} index - Index of categories array. It's used to access the category's name and color properties in the categories array
 * @returns {HTMLString} - a string that represents an HTML element for a category list element. The element includes the name and color of the category, 
 * as well as click possibilities to add or delete the category. The index parameter is used to access the corresponding category object from an array called "categories"
 */
function createCategoryListElement(index) {
    return `<div class="category list_element flex-row">
    <div class="list_element_left flex-row" onclick="addCategory(${index})">
    <span>${categories[index].name}</span>
    <div class="circle" style="background-color: ${categories[index].color}"></div></div>
    <i class='bx bx-x' onclick="deleteCategory(${index})"></i>
</div>`
}

/**
 * Returns an HTML input element for the selected category with the associated color
 * @param {Number} index - Index of categories array
 * @returns {HTMLString} - a string that contains an HTML element with the name of a category and a colored circle representing the category.
 * The name and color of the category are obtained from an array called `categories` using the `index` parameter passed to the function
 */
function createCategoryInput(index) {
    return `<span>${categories[index].name}</span>
    <div class="circle" style="background-color: ${categories[index].color}"></div>`
}


/*_______________________________________Contact Select Templates______________________________________*/

/**
 * Returns a contact list element with a checkbox and name.
 * @param {Number} index - Index of contacts array. It is used to generate unique IDs for the checkbox and checkmark elements
 * @param {String} name - Name of the contact to be displayed in the contact list element
 * @param {String} menu - String used to separate the checkboxes of add task menu and edit task menu by adding a ID additionally
 * @returns {HTMLString} - a string that represents an HTML element. This list element has an onclick function to select itself
 * Inside the div, there is a span element with the name parameter as its content, an input checkbox element as well as its clone as a span element
 */
function createContactListElement(index, name, menu) {
    return `<div class="list_element checkbox_row flex-row curser" onclick="selectElement('checkbox${menu}${index}', 'clonedCheckbox${menu}${index}')">
        <span>${name}</span>
        <input id="checkbox${menu}${index}" type="checkbox">
        <span id="clonedCheckbox${menu}${index}" class="checkmark"></span>
    </div>`
}

/**
 * Returns an HTML element for inviting a new contact
 * @param {String} inviteNewContactId - ID of invite new contact list element
 * @param {String} newContactInputId - ID of the assign new contact inputfield
  * @param {String} selectContactContainerId - ID of the select contact input container
 * @param {String} selectNewContactContainerId - ID of the select new contact input container
 * @returns {HTMLString} - a string that represents an anchor element. The anchor element has an `onclick` attribute that calls the function to display the 
 * input for inviting a new contact
 */
function createInviteContactOption(inviteNewContactId, newContactInputId, selectContactContainerId, selectNewContactContainerId) {
    return `<a href="#${newContactInputId}" id="${inviteNewContactId}" class="list_element flex-row curser"
     onclick="openInviteNewContact('${newContactInputId}', '${selectContactContainerId}', '${selectNewContactContainerId}')">
    <span>Invite new contact</span>
    <img src="src/img/contacts-icon.svg" alt="">
</a>`
}

/**
 * Returns a contact initial container with specified color and initials.
 * @param {String} color - Background color of the contact's initials container.
 * @param {String} initials - Initials of a contact
 * @returns {HTMLString} - a string that contains an HTML div element that displays the initials of the contact
 * The background color is set to the value of the "color" parameter passed to the function
 */
function createContactInitial(color, initials) {
    return `<div class="initial_container grid"><div class="initials grid" style="background-color: ${color}">${initials}</div></div>`
}

/*_______________________________________Subtask List Templates______________________________________*/

/**
 * Returns a container for a subtask with a checkbox, name, and delete icon.
 * @param {Number} index - Index of the subtasks array. It's used to access the name and status of the subtask from the subtasks
 * array and to generate unique IDs for the subtask's checkbox and delete icon
 * @returns {HTMLString} - a string that represents an HTML list element for subtasks including a span element with the name parameter as its content,
 * an input checkbox element as well as its clone as a span element
 */
function createSubtaskListContainer(index) {
    return `<div class="subtask flex-row">
    <div class="subtask_left_container flex-row">
        <span id="clonedSubCheck${index}" class="checkmark" onclick="setStatus('subCheck${index}', 'clonedSubCheck${index}', ${index})"></span>
        <input id="subCheck${index}" type="checkbox">
        <span>${subtasks[index].name}</span>
    </div>
    <i class='bx bx-x curser' onclick="deleteSubtask(${index})"></i>
</div>`
}
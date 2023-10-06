/*________________________________________________Settings______________________________________________*/

/**
 * @typedef category
 * @type {Object} - Category object
 * @prop {String} name - Name of the category
 * @prop {String} color - Color of the category
 */
/**
 * @type {category}
 */
let category = {
    'name' : '',
    'color' : ''
};
/**
 * @type {Boolean} - A Boolean that switches to true if the contact list is rendered for the first time, used to prevent an error when the contact list is rendered
 */
let firstOpen = false;


/*_______________________________________Category Select Functions______________________________________*/

/**
 * Opens and renders or closes the category list
 */
function toggleCategoryList() {
    document.getElementById('select_typ').innerHTML = '<span>Select task category</span>';
    let categoryList = document.getElementById('category_list');
    categoryList.scrollTop = 0;
    if (categoryList.classList.contains('d-none')) {
        openCategoryList(categoryList);
    } else {
        categoryList.classList.add('d-none');
    }
}

/**
 * Opens and renders the category list
 * @param {Element} categoryList - Category list container
 */
function openCategoryList(categoryList) {
    if (firstOpen) {
        let contactList = document.getElementById('add_Task_contact_list');
        if (contactList.classList.contains('d-none') === false) {
            closeContactList(contactList, 'contact_initials_container', contacts);
        }
    }
    renderCategoryList(categoryList);
    categoryList.classList.remove('d-none');
}

/**
 * Renders the category list (including the new category option and the categories)
 * @param {HTMLElement} element - Container of the category list
 */
function renderCategoryList(element) {
    renderNewCategoryOption(element);
    renderCategoryListElement(element);
}

/**
 * Renders new category option
 * @param {HTMLElement} element - Container of the category list
 */
function renderNewCategoryOption(element) {
    element.innerHTML = createNewCategorySelectElement();
}

/**
 * Renders categories and adjusts the padding for the list elements
 * @param {HTMLElement} element - Container for category list
 */
function renderCategoryListElement(element) {
    sortArrayByName(categories);
    for (let i = 0; i < categories.length; i++) {
        element.innerHTML += createCategoryListElement(i);
    }
    adjustListPadding('#category_list .list_element', categories, '16', '9', '10.5');
}

/**
 * Adds the selected Category to the input field
 * @param {Number} index - Index of categories array
 */
function addCategory(index) {
    toggleCategoryList();
    let category = document.getElementById('select_typ');
    category.innerHTML = createCategoryInput(index);
}

/**
 * Opens the new category option and renders 5 random colors
 */
function addNewCategory() {
    toggleTwoElements('select_category', 'select_new_category');
    document.getElementById('new_category').value = '';
    renderColors();
}

/**
 * Renders 5 random RGB colors and removes any previously selected color.
 */
function renderColors() {
    for (let i = 0; i < 5; i++) {
        document.getElementById(`color${i}`).classList.remove('selected_color');
        document.getElementById(`color${i}`).style.backgroundColor = createRandomRGBColor();
    }
}

/**
 * Removes the `selected_color` class from all the color elements and adds it only to the circle element with the specified index
 * @param {Number} id - Id for circle element
 */
function addColor(id) {
    for (let i = 0; i < 5; i++) {
        document.getElementById(`color${i}`).classList.remove('selected_color');
    }
    document.getElementById(`color${id}`).classList.add('selected_color');
}

/**
 * Cancels the creation of a new category object
 */
function cancelNewCategory() {
    document.getElementById('new_category').value = '';
    toggleTwoElements('select_category', 'select_new_category');
    toggleCategoryList();
    document.getElementById('category_amount_container').classList.add('d-none');
}

/**
 * Creates a new category with a name and color selected by the user and adds it to the list of categories.
 */
function createNewCategory() {
    let input = document.getElementById('new_category').value;
    let selectedColorCheck = checkSelectedColor();
    if (input != '' && selectedColorCheck) {
        let name = firstLettersToUpperCase(input);
        let color = getNewCategoryColor();
        addToCategoryList(name, color);
        toggleTwoElements('select_category', 'select_new_category');
        addCategory(categories.length - 1);
        document.getElementById('category_amount_container').classList.add('d-none');
    }
}

/**
 * Checks if a color has been selected before creating a new category object. If so it returns true
 * @returns {Boolean}
 */
function checkSelectedColor() {
    for (let i = 0; i < 5; i++) {
        let circle = document.getElementById(`color${i}`);
        if (circle.classList.contains('selected_color')) {
            return true;
        }
    }
}

/**
 * Returns the color of the selected color circle
 * @returns {String} - RGB color of the selected circle
 */
function getNewCategoryColor() {
    for (let i = 0; i < 5; i++) {
        let circle = document.getElementById(`color${i}`);
        if (circle.classList.contains('selected_color')) {
            let color = window.getComputedStyle(circle).backgroundColor;
            return color;
        }
    }
}

/**
 * Creates a new category object with the given parameters and pushs to the categories array and saves it
 * @param {String} name - Name of new category
 * @param {String} color - Color of new category
 */
function addToCategoryList(name, color) {
    category = {
        'name' : `${name}`,
        'color' : `${color}`
    }
    categories.push(category);
    saveCategory();
}

/**
 * Deletes the category object from the categories array and saves it
 * @param {Number} index - Index of categories array that needs to be deleted
 */
function deleteCategory(index) {
    categories.splice(index, 1);
    saveCategory();
    let categoryList = document.getElementById('category_list');
    renderCategoryList(categoryList);
}

/**
 * Saves the categories data as a JSON string in the browser's local storage.
 */
async function saveCategory() {
    await setItem('category', JSON.stringify(categories));
}
/*_______________________________Remote Storage________________________________*/

const STORAGE_TOKEN = 'D4DBS7MA276TXS8PQ3TJKAHG12EW5IEPOBMLYDL9';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';


/*____________________________________Data_____________________________________*/

/**
 * @type {Array.<task>} - Array of task objects
 */
let tasks2 = [];
/**
 * @type {Array.<contact>} - Array of contact objects
 */
let contacts = [];
/**
 * @type {Array.<account>} - Array of account objects
 */
let accounts = [];
/**
 * @type {Array.<{email: String, password: String}>} - Array that contains the last active account email and password
 */
let loginData = [];
/**
 * @type {Array.<category>} - Array of category objects
 */
let categories = [];


/*______________________________Storage Functions_______________________________*/

/**
 * Loads tasks from local storage and adds them to the tasks2 array.
 */
async function loadTasks() {
    tasks2 = [];
    let task = await getItem('tasks2');
    task = JSON.parse(task['data']['value']);
    for (let i = 0; i < task.length; i++) {
        let loadedTask = task[i];
        tasks2.push(loadedTask);  
    }
}

/**
 * Loads categories from local storage and adds them to the categories array.
 */
async function loadCategories() {
    categories = [];
    let category = await getItem('category');
    category = JSON.parse(category['data']['value']);
    for (let i = 0; i < category.length; i++) {
        let loadedCategory = category[i];
        categories.push(loadedCategory);  
    }
}

/**
 * Loads contacts from local storage and adds them to the contacts array.
 */
async function loadContacts() {
    contacts = [];
    let contact = await getItem('contact');
    contact = JSON.parse(contact['data']['value']);
    for (let i = 0; i < contact.length; i++) {
        let loadedContact = contact[i];
        contacts.push(loadedContact);  
    }
}

/**
 * Loads accounts from local storage and adds them to the accounts array.
 */
async function loadAccounts() {
    accounts = [];
    let account = await getItem('account');
    account = JSON.parse(account['data']['value']);
    for (let i = 0; i < account.length; i++) {
        let loadedAccount = account[i];
        accounts.push(loadedAccount);  
    }
}

/**
 * Saves the "accounts" object as a JSON string in local storage under the key "account".
 */
async function saveAccount() {
    await setItem('account', JSON.stringify(accounts));
}

/**
 * Loads login data from local storage and adds them to the loginData array.
 */
async function loadLoginData() {
    loginData = [];
    let login = await getItem('login');
    login = JSON.parse(login['data']['value']);
    for (let i = 0; i < login.length; i++) {
        let loadedLoginData = login[i];
        loginData.push(loadedLoginData);  
    }
}

/**
 * Retrieves an item from a storage service using a key and token
 * @param {String} key - String that represents the unique identifier of the item to be retrieved from the storage
 * @returns a Promise that resolves to the JSON representation of the response body. The `then()` method is used to handle the response and parse it as JSON
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json());
}

/**
 * Sets an item in a remote storage by sending a POST request with a JSON payload containing the key, value, and token
 * @param {String} key - String that represents the name of the item to be stored in the storage. It is used to identify the item when retrieving it later
 * @param value - Value that will be stored in the key-value pair in the storage. It can be of any data type that can be serialized into JSON format
 * @returns a Promise that resolves to the parsed JSON response from the `fetch` request
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload)})
    .then(res => res.json());
}

/**
 * Retrieves the tasks from a storage service using a key and token
 * @param {String} key - String that represents the unique identifier of the tasks to be retrieved from the storage
 * @returns
 */
async function getTask(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        if (res.data) {
            return res.data.value;
        }
        else {
            return res;
        }
    });
}
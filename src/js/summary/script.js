/*____________________________________________Settings________________________________________________*/

/**
 * @type {Array.<String>} - Array of priority names
 */
let priorities = ['urgent', 'medium', 'low'];
/**
 * @type {Array.<String>} - Array of elements to display the amount of tasks according of the board lists
 */
let taskAmountElements = ['to_do_amount', 'summary_task_in_progress_amount', 'summary_awaiting_feedback_amount', 'done_amount'];
/**
 * @type {Array.<String>} - Array of status of the task
 */
let stat = ['To do', 'In progress', 'Awaiting Feedback', 'Done'];


/*___________________________________________Greeting Functions_______________________________________*/

/**
 * Renders a greeting message based on the current time and the online status of user accounts
 */
async function renderGreeting() {
    await loadAccounts();
    loadHeaderInitials();
    let onlineAccountIndex = getOnlineAccountIndex();
    let greeting = document.getElementById('greeting');
    let mobileGreeting = document.getElementById('mobile_greeting');
    let hour = new Date().getHours();
    if (secondMobileGreeting(onlineAccountIndex)) {
        document.getElementById('mobile_greeting_container').classList.add('d-none');
        renderGreetingText(hour, greeting, onlineAccountIndex);
    } else if (firstMobileGreeting(onlineAccountIndex)) {
        renderMobileGreetingText(hour, greeting, mobileGreeting, onlineAccountIndex);
    } else {
        renderGreetingText(hour, greeting, onlineAccountIndex);
    }
}

/**
 * Checks if the device screen size is small and the account's greeting has not been displayed yet
 * @param {Number} index - Index of accounts array
 * @returns {Boolean} - true if the request matches, false if not
 */
function firstMobileGreeting(index) {
    if (index >= 0) {
        return ((window.innerWidth <= 1096 && window.innerHeight <= 768) || (window.innerWidth <= 1300 && window.innerHeight > 768))
            && accounts[index].greeting == 0;
    } else {
        return ((window.innerWidth <= 1096 && window.innerHeight <= 768) || (window.innerWidth <= 1300 && window.innerHeight > 768))
            && index == -1;
    }
}

/**
 * Checks if a given index has a greeting value of 1 or if it is equal to -1
 * @param {Number} index - Index of accounts array
 * @returns {Boolean} - true if the request matches, false if not
 */
function secondMobileGreeting(index) {
    if ((index >= 0 && accounts[index].greeting == 1) || index == -1) {
        return true;
    } else {
        return false;
    }
}

/**
 * Renders mobile greeting text and hides it after 2 seconds
 * @param {Number} hour - Hour of the current time
 * @param {Element} greeting - Greeting container element
 * @param {Element} mobileGreeting - Mobile greeting container element
 * @param {Number} index - Index of accounts array
 */
function renderMobileGreetingText(hour, greeting, mobileGreeting, index) {
    renderGreetingText(hour, mobileGreeting, index);
    renderGreetingText(hour, greeting, index);
    setTimeout(() => {
        document.getElementById('mobile_greeting_container').classList.add('d-none');
    }, 2000);
}

/**
 * Renders a greeting text based on the current hour and updates an account name
 * @param {number} hour - Hour of the current time
 */
function renderGreetingText(hour, greeting, index) {
    if (hour >= 6 && hour <= 11) {
        greeting.innerHTML = 'Good morning,';
    } else if (hour >= 12 && hour <= 18) {
        greeting.innerHTML = 'Good afternoon,';
    } else if (hour >= 19 && hour <= 23) {
        greeting.innerHTML = 'Good evening,';
    } else {
        greeting.innerHTML = 'Good night,';
    }
    renderAccountName(index);
}

/**
 * Renders the account name and sets the greeting property of that account to 1
 * @param {Number} index - Index of accounts array
 */
async function renderAccountName(index) {
    if (index >= 0) {
        fillAccountName(accounts[index].name);
        accounts[index].greeting = 1;
        await saveAccount();
    } else {
        fillAccountName('Guest');
    }
}

/**
 * Fills the account name in all elements with the class "account_name"
 * @param {String} accountName - Name of the account
 */
function fillAccountName(accountName) {
    let nameContainer = document.querySelectorAll('.account_name');
    nameContainer.forEach(name => {
        name.innerHTML = accountName;
    });
}

/**
 * Hides mobile greeting while resizing window 
 */
window.addEventListener('resize', function() {
    if ((window.innerWidth <= 1096 && window.innerHeight <= 768) || (window.innerWidth <= 1300 && window.innerHeight > 768)) {
        document.getElementById('mobile_greeting_container').classList.add('d-none');
    }
})

/*__________________________________Render Board - Summary Functions___________________________________*/

/**
 * Fills all summary informations
 */
async function fillSummaryContent() {
    await loadTasks();
    fillTaskAmounts();
    fillUpcomingTaskContainer();
}

/**
 * Sets the total number of tasks and the amount of tasks according to the status 
 */
function fillTaskAmounts() {
    document.getElementById('summary_task_in_bord_amount').innerHTML = tasks2.length;
    for (let i = 0; i < taskAmountElements.length; i++) {
        let taskAmountElement = document.getElementById(taskAmountElements[i]);
        let task = tasks2.filter(t => t.status === stat[i]);
        taskAmountElement.innerHTML = task.length;
    }
}

/**
 *  Sets the number of tasks according to the priority of the deadline that ends next as well as the priority symbol and deadline date
 */
function fillUpcomingTaskContainer() {
    if (tasks2.length == 0) {
        document.querySelector('.upcoming_task_container').classList.add('d-none');
    } else {
        for (let i = 0; i < priorities.length; i++) {
            let task = tasks2.filter(t => t.priority.name === priorities[i]);
            if (task.length > 0) {
                renderUpcomingPriority(task, i);
                document.getElementById('deadline_date').innerHTML = getDeadlineDate(task);
                break;
            }
        }   
    }
}

/**
 * Renders the upcoming priority of a task by updating the HTML elements with the corresponding symbol, color, amount, and priority name
 * @param {Array.<{task}>} task - Priority filterd task array 
 * @param {Number} i - Index of priorities array
 */
function renderUpcomingPriority(task, i) {
    document.getElementById('priority_symbol').innerHTML = renderSymbol(i);
    document.getElementById('priority_symbol').style.backgroundColor = task[0].priority.color;
    document.getElementById('priority_amount').innerHTML = task.length;
    document.getElementById('priority').innerHTML = firstLettersToUpperCase(priorities[i]);
}

/**
 * Returns the symbol according to the priority
 * @param {number} i - Index of priorities array
 * @returns {HTMLString}
 */
function renderSymbol(i) {
    switch (i) {
        case 0:
            return createUrgentPriority();
        case 1:
            return createMediumPriority();
        case 2:
            return createLowPriority();
    }
}

/**
 * Returns the deadline date of a task by retrieving the last due date and formatting it
 * @param {Array.<{task}>} task - Priority filterd task array
 * @returns {String} - Formatted deadline date
 */
function getDeadlineDate(task) {
    let dates = [];
    dates = getDueDates(task, dates);
    let deadlineDate = dates[dates.length - 1];
    deadlineDate = formatDate(deadlineDate);
    return deadlineDate;
}

/**
 * Gets the due dates of tasks and sorts and returns them in descending order
 * @param {Array.<{task}>} task - Priority filterd task array
 * @param {Array.<Date>} dates - Due dates array
 * @returns {Array.<Date>} - Array of due dates sorted in descending order
 */
function getDueDates(task, dates) {
    dates = task.map(t => new Date(t.dueDate)).sort((a, b) => b - a);
    return dates;
}

/**
 * Returns the next due date in an appropriate format
 * @param {Date} date - Next due date
 * @returns {String} - Formatted due date
 */
function formatDate(date) {
    let deadlineDate = date.toLocaleDateString("en-Us", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
    return deadlineDate;
}

/*_____________________________General Functions________________________________*/

/**
 * Rewrite SVG files read by img tags to inline codes for changing attributes
 */
window.addEventListener('load', function() {
    deSVG('.edit_task_img', true);
});
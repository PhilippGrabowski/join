/*_______________________________________Settings_______________________________________*/

/**
 * @type {Array.<String>} - Array of box shadow ID's
 */
let boxShadows = ['to_do_shadow', 'in_progress_shadow', 'awaiting_feedback_shadow', 'done_shadow'];
/**
 * @type {Boolean} - True if a task is dragging, otherwise false
 */
let currentDrag = false;
/**
 * @type {Element} - Task element that will be dragged
 */
let currentDraggedElement;
/**
 * @type {String} - ID of the task element that will be dragged
 */
let currentDraggedElementId;
/**
 * @type {Array<contact>} - Array of contact objects
 */
let editContacts = [];
/**
 * @type {Array.<String>} - Array of ID's of error report elements for title, description, due date
 */
let editTaskErrorReport = ['edit_title_error', 'edit_description_error', 'edit_dueDate_error'];
/**
 * @type {Array.<String>} - Array of ID's of input elements for title, description, due date
 */
let editTaskInputIds = ['edit_title', 'edit_description', 'edit_dueDate'];
/**
 * @type {Boolean} - True if a member in the assigned team array exists in the editContacts array, otherwise false
 */
let existingAccountMember = false;
/**
 * @type {Boolean} - serves as memory if one team member (icon/initials) has been rendered or not
 */
let firstInitial = false;
/**
 * @type {Boolean} - True if the task info is open, false otherwise
 */
let openTaskInformation = false;
/**
 * @type {Boolean} - True if the task menu is open, false otherwise
 */
let openTaskMenu = false;
/**
 * @type {Array.<String>} - Array of priority names used to sort and update the filtered tasks
 */
let priorityNames = ['urgent', 'medium', 'low'];
/**
 * @type {Array.<task>} - Array of searched tasks
 */
let searchedTasks = [];
/**
 * Media query that is checking if the maximum width of the viewport is 469 pixels or more
 */
const taskMenuQuery = '(min-width: 469px)';
/**
 * MediaQueryList object that represents the results of a CSS media query applied to the document
 */
const taskMenuQueries = window.matchMedia(taskMenuQuery);
/**
 * @type {Array.<String>} - Array of ID's for the board list containers
 */
let taskLists = ['to_do_container', 'in_progress_container', 'awaiting_feedback_container', 'done_container'];
/**
 * @type {Array.<String>} - Array of the list status
 */
let taskStatus = ['To do', 'In progress', 'Awaiting Feedback', 'Done'];
/**
 * @type {Array.<String>} - Array of the list status used as a identifier for box shadows
 */
let taskStatusID = ['to_do', 'in_progress', 'awaiting_feedback', 'done'];
/**
 * @type {Number} - Amount of rendered team members (icons/initials)
 */
let teamRenderCounter = 0;
/**
 * @type {Array.<task>} - Array of updated and sorted tasks
 */
let updatedTasks = [];


/*_________________________________Render Board Functions_______________________________*/

/**
 * Loads the data of accounts, tasks, contacts and categories array and renders the task board
 */
async function loadDatabase() {
    await loadAccounts()
    await loadTasks();
    await loadContacts();
    await loadCategories();
    loadHeaderInitials();
    renderTaskBoard(tasks2);
}

/**
 * Creates the tasks in the corresponding lists of the board
 */
async function renderTaskBoard(taskArray) {
    for (let i = 0; i < taskLists.length; i++) {
        renderTaskList(taskLists[i], i, taskArray);
    }
}

/**
 * Renders tasks in the list with the corresponding status by filtering the tasks based on their status and updating them before rendering
 * @param {String} list - ID of the list container
 * @param {Number} index - Index of the taskLists array used to determine which task status to filter the tasks by
 */
function renderTaskList(list, index, taskArray) {
    let listContainer = document.getElementById(list);
    listContainer.innerHTML = '';
    listContainer.innerHTML += `<div class="dragbox-shadow d-none" id="${taskStatusID[index]}_shadow"></div>`;
    let filteredTasks = taskArray.filter(t => t.status === taskStatus[index]);
    filteredTasks = updateTasks(filteredTasks);
    for (let i = 0; i < filteredTasks.length; i++) {
        renderTask(listContainer, filteredTasks[i]);
    }
}

/**
 * Updates the priority of filtered tasks, sorts and returns them
 * @param {Array.<task>} filteredTasks - Status filtered array of tasks
 * @returns {Array.<task>} - Updated filtered tasks array
 */
function updateTasks(filteredTasks) {
    updatedTasks = [];
    updatePriority(filteredTasks);
    sortTasks(filteredTasks);
    return updatedTasks;
}

/**
 * Updates the priority of tasks based on their due date, marking them as urgent if the due date is within three days
 * @param {Array.<task>} filteredTasks - Status filtered array of tasks
 */
function updatePriority(filteredTasks) {
    let today = new Date();
    let inThreeDays = today.setDate(today.getDate() + 3);
    for (let i = 0; i < filteredTasks.length; i++) {
        let deadlineDate = new Date(filteredTasks[i].dueDate);
        if (deadlineDate <= inThreeDays) {
            filteredTasks[i].priority.name = priorities[0].name ;
            filteredTasks[i].priority.color = priorities[0].color;
        }
    }
}

/**
 * The function sorts an array of tasks based on their priority and due date.
 * @param {Array.<task>} filteredTasks - Status filtered array of tasks
 */
function sortTasks(filteredTasks) {
    for (let i = 0; i < priorityNames.length; i++) {
        let prioFilteredTasks = filteredTasks.filter(t => t.priority.name === priorityNames[i]);
        prioFilteredTasks = prioFilteredTasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate)).reverse();
        updatedTasks = updatedTasks.concat(prioFilteredTasks);
    }
}

/**
 * Appends a new task to the container including rendering the progress bar, task team, and priority icon for that task
 * @param {Element} element - Container element where the tasks will be rendered
 * @param {task} task - Task object
 */
function renderTask(element, task) {
    element.innerHTML += createBoardTask(task);
    renderProgressbar(task);
    renderTaskTeam(task);
    renderPriorityIcon(task, `#task${task.id} .priority_icon`);
}

/**
 * Creates and fills a progress bar for a given task if it has subtasks
 * @param {task} task - Task object
 */
function renderProgressbar(task) {
    if (task.subtasks.length !== 0) {
        let element = document.querySelector(`#task${task.id} .progressbar_container`);
        element.innerHTML = createProgressbar();
        fillProgressbar(task);
    }
}

/**
 * Fills the progress bar and displays the number of finished subtasks for a given task
 * @param {task} task - Task object
 */
function fillProgressbar(task) {
    let progressbar = document.querySelector(`#task${task.id} progress`);
    let finishedSubtasks = task.subtasks.filter(st => st.status === true);
    progressbar.setAttribute('max', `${task.subtasks.length}`);
    progressbar.setAttribute('value', `${finishedSubtasks.length}`);
    document.querySelector(`#task${task.id} .finsihed_subtasks`).innerHTML = finishedSubtasks.length;
    document.querySelector(`#task${task.id} .subtask_amount`).innerHTML = task.subtasks.length;
}

/**
 * Renders all team members as initial circles who are responsible for the processing of the task including the account itself, the contacts and invited contacts
 * If the amount of members is 0, it renders a add user icon
 * @param {task} task - Task object
 */
function renderTaskTeam(task) {
    firstInitial = false;
    teamRenderCounter = 0;
    let element = document.querySelector(`#task${task.id} .task_team`);
    if (task.team.account.length + task.team.contacts.length + task.team.invitations.length == 0) {
        element.innerHTML += `<div class="team_member no_members grid"><i class='bx bx-user-plus'></i></div>`;
    } else {
        renderTaskTeamAccount(element, task);
        renderTaskTeamContacts(element, task);
        renderTaskTeamInvitations(element, task);
    }
}

/**
 * Renders the account as a initial circle who is the creater of the task
 * @param {Element} element - Container element where the account (creater) will be rendered
 * @param {task} task - Task object
 */
function renderTaskTeamAccount(element, task) {
    if (task.team.account.length > 0) {
        element.innerHTML +=createTaskTeam(task.id, task.team.account[0].id);
        fillTeamCircle(task, task.team.account[0].id, task.team.account[0].initials, task.team.account[0].color);
        teamRenderCounter++;
        firstInitial = true;
    }
}

/**
 * Renders the contacts as initial circles
 * @param {Element} element - Container element where the contacts will be rendered
 * @param {task} task - Task object
 */
function renderTaskTeamContacts(element, task) {
    for (let i = 0; i < task.team.contacts.length; i++) {
        element.innerHTML +=createTaskTeam(task.id, task.team.contacts[i].id);
        fillTeamCircle(task, task.team.contacts[i].id, task.team.contacts[i].initials, task.team.contacts[i].color);
        teamRenderCounter++;
        firstInitial = true;
        if (teamRenderCounter == 3) {
            break;
        }
    }
}

/**
 * Fills the rendered team member circle with the initials and adds the corresponding color for the background
 * @param {task} task - Task object
 * @param {Number} id - ID of contact used to identify the specific team member circle element
 * @param {String} initials - Initials of the team member
 * @param {String} color - Background color that will be applied to the team member circle
 */
function fillTeamCircle(task, id, initials, color) {
    let circle = document.getElementById(`task${task.id}_team_member${id}`);
    if (teamRenderCounter == 2 && task.team.account.length + task.team.contacts.length + task.team.invitations.length > 3) {
        circle.innerHTML = `+${task.team.account.length + task.team.contacts.length + task.team.invitations.length - 2}`;
        circle.style.backgroundColor = 'black';
    } else {
        circle.innerHTML = initials;
        circle.style.backgroundColor = color;
    }
    adjustCircles(circle);
}

/**
 * Adjusts the position of circles based on the value of 'teamRenderCounter'
 * @param {Element} element - Adjusting circle element
 */
function adjustCircles(element) {
    switch (teamRenderCounter) {
        case 1:
            element.classList.add('first_translate');
        break;
        case 2:
            element.classList.add('second_translate');
        break;
    }
}

/**
 * Renders invited contacts by displaying contact icons, with a maximum of 3 icons shown and a "more team members" circle if there are more than 3 invitations
 * @param {Element} element - Container element where the invited contacts will be rendered
 * @param {task} task - Task object
 */
function renderTaskTeamInvitations(element, task) {
    if (teamRenderCounter < 3) {
        for (let i = 0; i < task.team.invitations.length; i++) {
            if (task.team.invitations.length > 3 && i == 2) {
                renderMoreTeamMembersCircle(element, task, i);
                break;
            }
            renderInvitedContactIcon(element, task, i);
        }
    }
}

/**
 * Renders invited contact icon and adjusts its position based on the value of `teamRenderCounter`
 * @param {Element} element - Container element where the invited contacts will be rendered
 * @param {task} task - Task object
 * @param {Number} index - Index of the task.team.invitations array used to generate a unique identifier for the icon element by appending it to the `task.id` value
 */
function renderInvitedContactIcon(element, task, index) {
    element.innerHTML += `<i id="circle${task.id}${index}" class='bx bxs-user-circle'></i>`;
    document.getElementById(`circle${task.id}${index}`).style.fontSize = '41px';
    switch (teamRenderCounter) {
        case 1:
            adjustIcons(task, index, '-15px', '-15px');
        break;
        case 2:
            adjustIcons(task, index, '-25px', '-30px');
        break;
    }
    teamRenderCounter++;
}

/**
 * Renders a circle element to displaying the number of additional team members in a task
 * @param {Element} element - Container element where the invited contacts will be rendered
 * @param {task} task - Task object
 * @param {Number} index - Index of the task.team.invitations array used to generate a unique identifier for the circle element by appending it to the `task.id` value
 */
function renderMoreTeamMembersCircle(element, task, index) {
    element.innerHTML +=  `<div id="task${task.id}${index}" class="team_member grid"></div>`;
    let circle = document.getElementById(`task${task.id}${index}`);
    circle.innerHTML = `+${task.team.invitations.length - 2}`;
    circle.style.backgroundColor = 'black';
    circle.style.transform = 'translate(-25px, 4px)';
}

/**
 * Adjusts the position of icons based on the provided x-coordinates
 * @param {task} task - Task object
 * @param {Number} index - Index of the task.team.invitations array
 * @param {String} x1 - Value for the horizontal translation of the icon when 'firstInitial' is true
 * @param {String} x2 - Value for the horizontal translation of the icon
 */
function adjustIcons(task, index, x1, x2) {
    document.getElementById(`circle${task.id}${index}`).classList.add('second_translate');
    if (firstInitial) {
        document.getElementById(`circle${task.id}${index}`).style.transform = `translate(${x1}, -2px)`;
    } else {
        document.getElementById(`circle${task.id}${index}`).style.transform = `translate(${x2}, 0px)`;
    }
}

/**
 * Renders the priority icon of the task based on its priority level
 * @param {task} task - Task object
 * @param {String} element - String used to target an element with the querySelector
 */
function renderPriorityIcon(task, element) {
    let container = document.querySelector(element)
    switch (task.priority.name) {
        case 'low':
            container.innerHTML = createLowPriority();
        break;
        case 'urgent':
            container.innerHTML = createUrgentPriority();
        break;
        case 'medium':
            container.innerHTML = createMediumPriority();
        break;
    }
}
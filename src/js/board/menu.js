/*_________________________________Render Task Info Functions_______________________________*/

/**
 * Displays the task information based on the provided task ID
 * @param {Number} id - ID of the task used to locate the task in the tasks2 array and retrieve its information
 */
function openTaskInfo(id) {
    document.getElementById('partitionWindow').classList.remove('d-none');
    document.getElementById('task_information').classList.remove('d-none');
    let index = getIndexOfTask(id);
    updateTaskInfo(index);
    document.querySelector('#task_info_container').scrollTop = 0;
    openTaskInformation = true;
}

/**
 * Closes the task information and then renders the task board
 */
function closeTaskInfo() {
    document.getElementById('partitionWindow').classList.add('d-none');
    document.getElementById('task_information').classList.add('d-none');
    closeEditTask();
    document.getElementById('edit_task_contact_list').innerHTML = '';
    openTaskInformation = false;
    renderTaskBoard(tasks2);
}

/**
 * Closes the edit task menu if it is open
 */
function closeEditTask() {
    if (document.getElementById('task_info_container').classList.contains('d-none')) {
        let contactList = document.getElementById('edit_task_contact_list');
        if (contactList.classList.contains('d-none') === false) {
            closeContactList(contactList, 'edit_task_contact_initials_container', editContacts);
        }
        document.getElementById('edit_task_new_contact_error').style.color = 'var(--white2-color)';
        document.getElementById('edit_task_select_contact').classList.remove('d-none');
        document.getElementById('edit_task_select_new_contact').classList.add('d-none')
        closeErrorReports(editTaskErrorReport);
        dueDate = undefined;
        toggleTwoElements('task_info_container', 'task_info_edit_container');
        document.querySelector('.task_info_button_container').classList.remove('d-none');
    }
}

/**
 * Updates the task information based on the index of the task
 * @param {Number} index - Index of the task in the `tasks2` array
 */
function updateTaskInfo(index) {
    document.getElementById('task_info_category').innerHTML = tasks2[index].category.name;
    document.getElementById('task_info_category').style.backgroundColor = tasks2[index].category.color;
    document.getElementById('task_info_title').innerHTML = tasks2[index].title;
    document.getElementById('task_info_description').innerHTML = tasks2[index].description;
    document.getElementById('task_info_dueDate').innerHTML = formatDate(tasks2[index].dueDate);
    document.getElementById('task_info_priority').innerHTML = firstLettersToUpperCase(tasks2[index].priority.name);
    document.querySelector('.task_info_priority_container').style.backgroundColor = tasks2[index].priority.color;
    renderPriorityIcon(tasks2[index], '#task_info_priority_icon');
    renderSubtaskList(index);
    renderTeamListContainer(index);
    updatesTaskInfoButtons(index);
}

/**
 * Renders a list of subtasks based on the given index
 * @param {Number} index - Index of the task in the `tasks2` array for which the subtask list needs to be rendered
 */
function renderSubtaskList(index) {
    if (tasks2[index].subtasks.length > 0) {
        document.getElementById('task_info_subtasks_container').classList.remove('d-none')
        subtasks = tasks2[index].subtasks;
        let listContainer = document.getElementById('task_info_subtask_list');
        listContainer.innerHTML = '';
        for (let i = 0; i < subtasks.length; i++) {
            listContainer.innerHTML += createTaskInfoSubtasks(i, index);
            if (subtasks[i].status == true) {
                setCheckmark(`taskInfoSubCheck${i}`, `clonedTaskInfoSubCheck${i}`)
            }
        }
    } else {
        document.getElementById('task_info_subtasks_container').classList.add('d-none');
    }
}

/**
 * Changes the status for the corresponding checkbox
 * @param {String} box - Id of checkbox
 * @param {String} clonedBox - Id of cloned checkbox
 * @param {Number} subtaskIndex - Index of subtasks array
 *  @param {Number} taskIndex - Index of tasks2 array
 */
function setTaskInfoStatus(box, clonedBox, subtaskIndex, taskIndex) {
    selectElement(box, clonedBox);
    let checkbox = document.getElementById(box);
    if(checkbox.hasAttribute('checked')) {
        tasks2[taskIndex].subtasks[subtaskIndex].status = true;
    } else {
        tasks2[taskIndex].subtasks[subtaskIndex].status = false;
    }
    saveTask();
}

/**
 * Renders the team list container based on the provided index
 * @param {Number} index - Index of the task in the `tasks2` array
 */
function renderTeamListContainer(index) {
    let teamList = document.getElementById('task_info_team_list');
    teamList.innerHTML = '';
    if (tasks2[index].team.account.length + tasks2[index].team.contacts.length + tasks2[index].team.invitations.length == 0) {
        teamList.innerHTML = createAssignTeamInfo();
    } else {
        renderTeamList(teamList, tasks2[index].team.account);
        renderTeamList(teamList, tasks2[index].team.contacts);
        for (let i = 0; i < tasks2[index].team.invitations.length; i++) {
            teamList.innerHTML += createInvitationInfo(tasks2[index].team.invitations[i]);
        }
    }
}

/**
 * Renders the team members to the team list
 * @param {Element} element - Element where the team member information will be rendered
 * @param assignedMembers - Array of team member objects containing their informations
 */
function  renderTeamList(element, assignedMembers) {
    for (let i = 0; i < assignedMembers.length; i++) {
        element.innerHTML += createTeamMemberInfo(assignedMembers[i]);
    }
}

/**
 * Updates the onclick attributes of the trash and task_edit buttons with the given index
 * @param {Number} index - Index of the task in the `tasks2` array that needs to be updated
 */
function updatesTaskInfoButtons(index) {
    document.getElementById('trash').setAttribute('onclick', `deleteTask(${index})`);
    document.getElementById('task_edit').setAttribute('onclick', `openEditTask(${index})`);
}

/**
 * Deletes a task from the tasks2 array, saves the updated array and closes the task information
 * @param {Number} index - Index of the task in the `tasks2` array that needs to be deleted
 */
async function deleteTask(index) {
    tasks2.splice(index, 1);
    await saveTask();
    closeTaskInfo();
}

/**
 * Opens the task edit container and updates the task information based on the given index
 * @param {Number} index - Index of the task in the `tasks2` array that needs to be edited
 */
function openEditTask(index) {
    toggleTwoElements('task_info_container', 'task_info_edit_container');
    document.querySelector('.task_info_button_container').classList.add('d-none');
    updateEditTask(index);
    document.querySelector('#task_info_edit_container').scrollTop = 0;
}

/**
 * Updates the task information based on the given index
 * @param {Number} index - Index of the task in the `tasks2` array that needs to be edited
 */
function updateEditTask(index) {
    let editTitle = document.getElementById('edit_title');
    editTitle.value = tasks2[index].title;
    countChar(editTitle, 'edit_title');
    let editDescription = document.getElementById('edit_description');
    editDescription.value = tasks2[index].description;
    countChar(editDescription, 'edit_textarea');
    document.getElementById('edit_dueDate').value = formatDate(tasks2[index].dueDate);
    dueDate = tasks2[index].dueDate;
    document.getElementById('edit_dueDate').style.color = 'var(--black-color)';
    updateEditTaskPriority(index);
    updateEditTaskTeam(index);
    document.getElementById('edit_task_button').setAttribute('onclick', `editTask(${index})`);
}

/**
 * Updates the priority of a task based on its index
 * @param {Number} index - Index of the task in the `tasks2` array, used to update the priority
 */
function updateEditTaskPriority(index) {
    count = 0;
    let priorityName = tasks2[index].priority.name;
    let priorityButton;
    switch (priorityName) {
        case 'urgent':
            priorityButton = 6;
        break;
        case 'medium':
            priorityButton = 7;
        break;
        case 'low':
            priorityButton = 8;
        break;
    }
    selectPriority(6, priorityButton);
}

/**
 * Updates the task team of a task based on its index
 * @param {Number} index - Index of the task in the `tasks2` array, used to update the task team
 */
function updateEditTaskTeam(index) {
    getOnlineAccount();
    assembleEditContacts(tasks2[index].team.account);
    setEditTaskCheckmarks(index);
    toggleContactList('edit_task_contact_list', 'edit_task_contact_initials_container', 'invite_new_contact2', 'edit_task_new_contact', 'edit_task_select_contact', 'edit_task_select_new_contact', 'EditTask', editContacts);
    toggleContactList('edit_task_contact_list', 'edit_task_contact_initials_container', 'invite_new_contact2', 'edit_task_new_contact', 'edit_task_select_contact', 'edit_task_select_new_contact', 'EditTask', editContacts);
}

/**
 * Assembles a new contact array including all contacts from the contacts array and assigned contacts of the task which are not in the contacts array
 * Then sorts the new array by name
 * @param {Array<contact>} assignedTeamArray - Array of contacts assigned to a team
 */
function assembleEditContacts(assignedTeamArray) {
    editContacts = contacts;
    contactIndexArray = [];
    checkAccountMemberInContacts(assignedTeamArray);
    if (assignedTeamArray.length > 0 && onlineAccount.length > 0 && assignedTeamArray[0].name != onlineAccount[0].name) {
        editContacts.push(assignedTeamArray[0]);
    } else if (assignedTeamArray.length > 0 && onlineAccount.length > 0 && assignedTeamArray[0].name === onlineAccount[0].name) {
        contactIndexArray.push(0);
    } else if (assignedTeamArray.length > 0 && existingAccountMember === false) {
        editContacts.push(assignedTeamArray[0]);
    }
    sortArrayByName(editContacts);
}

/**
 * Checks if a member in the assigned team array exists in the editContacts array.
 * @param {Array<contact>} assignedTeamArray - Array of contacts assigned to a team
 */
function checkAccountMemberInContacts(assignedTeamArray) {
    existingAccountMember = false;
    if (assignedTeamArray.length > 0) {
        for (let i = 0; i < editContacts.length; i++) {
            if (editContacts[i].name === assignedTeamArray[0].name) {
                existingAccountMember = true;
            }
        }
    }
}

/**
 * Sets checkmarks for the team account, contacts, and invitations in a task
 * @param {Number} index - Index of the task in the `tasks2` array, used to update the task team
 */
function setEditTaskCheckmarks(index) {
    setEditTaskContactCheckmarks(tasks2[index].team.account);
    setEditTaskContactCheckmarks(tasks2[index].team.contacts);
    setEditTaskInvitationCheckmarks(tasks2[index].team.invitations);
}

/**
 * Sets checkmarks for the team account or contacts in the editContacts array based on the given parameter
 * @param {Array<contact>} assignedTeamArray - Array of contacts assigned to a team
 */
function setEditTaskContactCheckmarks(assignedTeamArray) {
    for (let i = 0; i < assignedTeamArray.length; i++) {
        for (let j = 0; j < editContacts.length; j++) {
            if (assignedTeamArray[i].name === editContacts[j].name) {
                contactIndexArray.push(onlineAccount.length > 0 ? j + 1 : j);
            }
        }
    }
}

/**
 * Sets checkmarks for the team invitations
 * @param {Array<contact>} assignedTeamArray - Array of contacts assigned to a team
 */
function setEditTaskInvitationCheckmarks(assignedTeamArray) {
    invitedContacts = [];
    invitedContactIndexArray = [];
    for (let i = 0; i < assignedTeamArray.length; i++) {
        invitedContacts.push(assignedTeamArray[i]);
        invitedContactIndexArray.push(onlineAccount.length > 0 ? editContacts.length + invitedContacts.length : editContacts.length + (invitedContacts.length - 1));
    }
}

/**
 * Updates the task team of a task based on its index, saves it and closes the edit task menu
 * @param {Number} index - Index of the task in the `tasks2` array, used to edit the task
 */
async function editTask(index) {
    let contactList = document.getElementById('edit_task_contact_list');
    if (contactList.classList.contains('d-none') === false) {
        closeContactList(contactList, 'edit_task_contact_initials_container', editContacts);
    }
    updateTaskValues(index);
    if (checkRequiredInputs(editTaskInputIds, editTaskErrorReport)) {
        await saveTask();
        updateTaskInfo(index);
        document.querySelector('#task_info_container').scrollTop = 0;
        document.getElementById('edit_task_new_contact_error').style.color = 'var(--white2-color)';
        document.getElementById('edit_task_select_contact').classList.remove('d-none');
        document.getElementById('edit_task_select_new_contact').classList.add('d-none')
        toggleTwoElements('task_info_container', 'task_info_edit_container');
        document.querySelector('.task_info_button_container').classList.remove('d-none');
    }
}

/**
 * Updates the task team of a task based on its index
 * @param {Number} index - Index of the task in the `tasks2` array, used to edit the task
 */
function updateTaskValues(index) {
    tasks2[index].title = document.getElementById('edit_title').value;
    tasks2[index].description = document.getElementById('edit_description').value;
    tasks2[index].dueDate = dueDate;
    dueDate = undefined;
    tasks2[index].priority = getPriority();
    getTeam(editContacts, 'checkboxEditTask0');
    tasks2[index].team = teams;
}


/*____________________________________________Task Menu Window__________________________________________________*/

/**
 * Displays the add task menu window
 */
function openAddTaskMenu(status) {
    clearAddTask(3);
    resetAllPrioButtons(0);
    document.querySelector('.add_task_button_container > button').innerHTML = 'Cancel';
    document.querySelector('.add_task_button_container > button').setAttribute('onclick', 'closeAddTaskMenu()');
    document.querySelector('.add_task_button_container > button:last-of-type').setAttribute('onclick', `addtask('${status}')`);
    document.getElementById('partitionWindow').classList.remove('d-none');
    if (window.innerWidth <= 469) {
        document.getElementById('partitionWindow').style.display = 'none';
    }
    displaySlideContainer('add_task_menu_window', 'translateX(0)');
    document.querySelector('#add_task_menu_container').scrollTop = 0;
    openTaskMenu = true;
}

/**
 * Closes the add task menu window
 */
function closeAddTaskMenu() {
    document.getElementById('partitionWindow').classList.add('d-none');
    hideSlideContainer('add_task_menu_window', 'translateX(150%)');
    openTaskMenu = false;
}

/**
 * Displays or hides the partitionWindow if media query matches min-width 469 
 */
taskMenuQueries.addEventListener('change', event => {
	if (event.matches && openTaskMenu == false && openTaskInformation == false) {
        document.getElementById('partitionWindow').style.display = 'none';
	} else if ((event.matches && openTaskMenu == true && openTaskInformation == false) || (event.matches && openTaskMenu == false && openTaskInformation == true)) {
        document.getElementById('partitionWindow').style.display = 'unset';
	} else if ((!event.matches && openTaskMenu == true && openTaskInformation == false) || (!event.matches && openTaskMenu == false && openTaskInformation == true)) {
        document.getElementById('partitionWindow').style.display = 'none'
    } else {
        document.getElementById('partitionWindow').style.display = 'unset';
    }
});
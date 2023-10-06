/**
 * Returns an HTML element for a task card based on the provided task object
 * @param {task} task - Task object
 * @returns {HTMLString} - an HTML string that represents a task card
 */
function createBoardTask(task) {
    return `<div id="task${task.id}"  class="task flex-column box-shadow curser" draggable="true" ondragstart="startDragging(${task.id})"
     onclick="openTaskInfo(${task.id})">
    <div class="task_category" style="background-color: ${task.category.color}">${task.category.name}</div>
    <span class="task_title">${task.title}</span>
    <p class="task_description">${task.description}</p>
    <div class="progressbar_container flex-row"></div>
    <div class="task_bottom flex-row">
        <div class="task_team flex-row"></div>
        <div class="priority_icon"></div>
    </div></div>`;
}


/**
 * Returns  a progress bar with a subtask overview
 * @returns {HTMLString} an HTML string that represents a progress bar element
 */
function createProgressbar() {
    return `<progress max="" value=""></progress>
    <div class="subtasks_overview">
        <span class="finsihed_subtasks"></span>/<span class="subtask_amount"></span> Done
    </div>`;
}

/**
 * Returns an HTML element for the initial circle of a team member
 * @param {Number} taskId - ID of task
 * @param {Number || String} teamMemberId - ID of team member
 * @returns {HTMLString} - Initial circle of the team member
 */
function createTaskTeam(taskId, teamMemberId) {
    return `<div id="task${taskId}_team_member${teamMemberId}" class="team_member grid"></div>`;
}

/**
 * Returns the html element for the low priority icon
 * @returns {HTMLString} - Element for the low priority
 */
function createLowPriority() {
    return `<i class='bx bx-chevrons-down low'></i>`;
}

/**
 * Returns thehtml element for the urgent priority icon
 * @returns {HTMLString} - Element for the urgent priority
 */
function createUrgentPriority() {
    return `<i class='bx bx-chevrons-up urgent'></i>`;
}

/**
 * Returns a container with two minus icons for medium priority
 * @returns {HTMLString} - Element for the medium priority
 */
function createMediumPriority() {
    return `<div class="medium_container flex-column">
    <i class='bx bx-minus medium upper_minus'></i>
    <i class='bx bx-minus medium lower_minus'></i></div>`;
}

/**
 * Returns an HTML element for a subtask
 * @param {Number} subtaskIndex - Index of the subtask
 * @param {Number} taskIndex - Index of the task
 * @returns {HTMLString} - Subtask element
 */
function createTaskInfoSubtasks(subtaskIndex, taskIndex) {
    return ` <div class="task_info_subtask_list_container flex-row">
    <span id="clonedTaskInfoSubCheck${subtaskIndex}" class="checkmark" onclick="setTaskInfoStatus('taskInfoSubCheck${subtaskIndex}', 'clonedTaskInfoSubCheck${subtaskIndex}', ${subtaskIndex}, ${taskIndex})"></span>
    <input id="taskInfoSubCheck${subtaskIndex}" type="checkbox">
    <span>${subtasks[subtaskIndex].name}</span>
    </div>`;
}

/**
 * Returns an HTML element for the icon of assign a team member
 * @returns {HTMLString}- Assign tem member icon element
 */
function createAssignTeamInfo() {
    return `<div class="team_list_container flex-row">
    <div class="team_member_initials no_members grid"><i class='bx bx-user-plus'></i></div>
    <span class="team_member_name">Assign your team</span>
    </div>`;
}

/**
 * Returns an HTML element for the initial circle of a team member
 * @param {contact} teamMember - Contact object
 * @returns {HTMLString} - Initial circle of the team member
 */
function createTeamMemberInfo(teamMember) {
    return `    <div class="team_list_container flex-row">
    <div class="team_member_initials grid" style="background-color: ${teamMember.color}">${teamMember.initials}</div>
    <span class="team_member_name">${teamMember.name}</span>
    </div>`;
}

/**
 * Returns an HTML element for the icon of a invited team member
 * @param {String} invitation - Email of the invited team member as a string 
 * @returns {HTMLString} - Invited tem member icon element
 */
function createInvitationInfo(invitation) {
    return `   <div class="team_list_container flex-row">
    <i class='bx bxs-user-circle'></i>
    <span class="team_member_name">${invitation}</span>
    </div>`;
}
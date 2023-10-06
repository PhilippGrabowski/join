/*_________________________________Filter Menu Functions_______________________________*/

/**
 * Toggles the visibility of the filter menu
 */
function toggleFilterMenu (){
    document.querySelector('.filter_menu').classList.toggle('d-none');
}

/**
 * Changes the placeholder of the search input field and filter options based on the selected menu list element
 * @param {Element} element - Selected menu list element
 */
function selectFilter(element) {
    let input = document.getElementById('search_input');
    let filter = element.innerHTML;
    input.setAttribute('placeholder', filter);
    switch (filter) {
        case 'title':
            changeFilter(input, filter, 'category', 'priority', 'contact');
        break
        case 'category':
            changeFilter(input, filter, 'title', 'priority', 'contact');
        break
        case 'priority':
            changeFilter(input, filter, 'title', 'category', 'contact');
        break
        case 'contact':
            changeFilter(input, filter, 'title', 'category', 'priority');
        break
    }
    search(filter);
}

/**
 * Updates the filter menu lists, hides the filter menu, and sets the parameter for the "search" function with the specified filter
 * @param {Element} inputfield - Search input field element where the user types their search query
 * @param {String} filter - Selected filter
 * @param {String} list1 - First list menu element
 * @param {String} list2 - Second list menu element
 * @param {String} list3 - Third list menu element
 */
function changeFilter(inputfield, filter, list1, list2, list3) {
    changeFilterMenuLists(list1, list2, list3);
    document.querySelector('.filter_menu').classList.add('d-none');
    inputfield.setAttribute('onkeyup', `search('${filter}')`);
}

/**
 * Updates the filter menu lists and hides the filter menu
 * @param {String} list1 - First list menu element
 * @param {String} list2 - Second list menu element
 * @param {String} list3 - Third list menu element
 */
function changeFilterMenuLists(list1, list2, list3) {
    document.getElementById('filter0').innerHTML = list1;
    document.getElementById('filter1').innerHTML = list2;
    document.getElementById('filter2').innerHTML = list3;
    document.querySelector('.filter_menu').classList.add('d-none');
}

/**
 * Filters tasks based on a search input and renders the filtered results on the task board
 * @param {String} filter - Selected filter used to determine the type of search to be performed (title, category, priority, team members)
 */
function search(filter) {
    searchedTasks = [];
    let searchInput = document.getElementById('search_input').value;
    searchInput = searchInput.toLowerCase();
    if (searchInput.length > 0 && filter != 'contact') {
        filterSearchInput(filter, searchInput);
        renderTaskBoard(searchedTasks);
    } else if (searchInput.length > 0) {
        filterTeamMembers(searchInput);
        renderTaskBoard(searchedTasks);
    } else {
        renderTaskBoard(tasks2);
    }
}

/**
 * Filters a list of tasks based on the search input and adds the matching tasks to the saerchedTasks array
 * @param {String} filter - Selected filter
 * @param {String} searchInput - Input value that the user enters for searching and used to filter the tasks based on the search criteria
 */
function filterSearchInput(filter, searchInput) {
    for (i = 0; i < tasks2.length; i++) {
        if (searchedCriteria(filter, i, searchInput)) {
            searchedTasks.push(tasks2[i]);
        }
    }
}

/**
 * Returns true if the corresponding task property matches the search input
 * @param {String} filter - Selected filter. It can have three possible values: "title", "category", or "priority"
 * @param {Number} index - Index of the task in the tasks2 array
 * @param {String} searchInput - Input value that the user enters for searching and used to filter the tasks based on the search criteria
 * @returns {Boolean} - a boolean value indicating whether the search input matches the specified criteria for the given filter
 */
function searchedCriteria(filter, index, searchInput) {
    switch (filter) {
        case 'title':
            return tasks2[index].title.toLowerCase().includes(searchInput);
        case 'category':
            return tasks2[index].category.name.toLowerCase().includes(searchInput);
        case 'priority':
            return tasks2[index].priority.name.toLowerCase().includes(searchInput)
    }
}

/**
 * Filters team members based on a search input.
 * @param {String} searchInput - Input value to filter the team members
 */
function filterTeamMembers(searchInput) {
    for (i = 0; i < tasks2.length; i++) {
        filterContacts(i, searchInput, tasks2[i].team.account);
        filterContacts(i, searchInput, tasks2[i].team.contacts);
        filterInvitations(i, searchInput);
    }
}

/**
 * Filters contacts based on a search input and adds matching tasks to the saerchedTasks array
 * @param {Number} index - Index of the task in the tasks2 array
 * @param {String} searchInput - Input value for searching contacts
 * @param {Array.<contact> | Array.<account>} taskTeamArray - Array of contact or account objects representing a task team. Each object in the array has a
 * property called "name" which represents the name of the team member
 */
function filterContacts(index, searchInput, taskTeamArray) {
    for (j = 0; j < taskTeamArray.length; j++) {
        if (taskTeamArray[j].name.toLowerCase().includes(searchInput) && checkSearchedTask(tasks2[index])) {
            searchedTasks.push(tasks2[index]);
            break;
        }
    }
}

/**
 * Filters invitations based on a search input and adds the matching tasks to the saerchedTasks array
 * @param {Number} index - Index of the task in the tasks2 array
 * @param {String} searchInput - Input value for searching invitations
 */
function filterInvitations(index, searchInput) {
    for (j = 0; j < tasks2[index].team.invitations.length; j++) {
        if (tasks2[index].team.invitations[j].toLowerCase().includes(searchInput) && checkSearchedTask(tasks2[index])) {
            searchedTasks.push(tasks2[index]);
            break;
        }
    }
}

/**
 * Checks if a task is already in the searchedTasks array
 * @param {task} task - Searched task object
 * @returns {Boolean} - Returns `false` if the `task` object is found in the `searchedTasks` array, and `true` otherwise
 */
function checkSearchedTask(task) {
    if (searchedTasks.length > 0) {
        for (let i = 0; i < searchedTasks.length; i++) {
            if (searchedTasks[i].id == task.id) {
                return false;
            }
        }
    }
    return true;
}


/*_________________________________Drag Task Functions_______________________________*/

/**
 * Sets the currentDraggedElementId variable to the provided id, sets all boxshadow heights equal to the current dragged element and rotates the dragged element
 * in the same direction as the mouse movement 
 * @param {Number} id - Id of task that is being dragged.
 */
function startDragging(id){
    currentDraggedElement = document.getElementById(`task${id}`);
    currentDraggedElementId = id;
    currentDrag = true;
    let boxHeight = currentDraggedElement.offsetHeight;
    for (let i = 0; i < boxShadows.length; i++) {
        document.getElementById(boxShadows[i]).style.height = `${boxHeight}px`;
        if (window.innerWidth > 1096) {
            document.getElementById(boxShadows[i]).style.paddingTop = `${boxHeight}px`;
        } else if (window.innerWidth < 1096) {
            document.getElementById(boxShadows[i]).style.paddingLeft = `320px`;
        }
    }
    preventOndropError();
}

/**
 * Allows an element to be dropped into another element
 * @param {Event} ev - Dragover event. It is automatically passed to the function when the event occurs
 */
function allowDrop(ev){
    ev.preventDefault();
}

/**
 * Changes and saves the status of the task before the board will be updated
 * @param {String} status - Status of tasklist container
 */
async function moveTo(status){
    currentDrag = false;
    let index = getIndexOfTask(currentDraggedElementId);
    tasks2[index].status = status;
    saveTask();
    renderTaskBoard(tasks2);
}

/**
 * Displays a shadow in the column when a draggable element is dragged over by removing the 'd-none' class
 * from the element with the given `boxShadowId` and hiding all other box shadows from other columns
 * @param {String} boxshadowId - Id of boxshadow
 */
function dragHighlight(boxShadowId){
    let box = document.getElementById(boxShadowId);
    if (box.classList.contains('d-none')) {
        for (let i = 0; i < boxShadows.length; i++) {
            document.getElementById(boxShadows[i]).classList.add('d-none');
        }
        box.classList.remove('d-none');
    }
    for (let i = 0; i < taskLists.length; i++) {
        document.getElementById(taskLists[i]).scrollTop = 0;
    }
}

/**
 * Returns index of draggable task from the tasks2 array based on its id
 * @param {Number} id - Id of draggable task
 * @returns {Number} - Index of draggable task
 */
function getIndexOfTask(id) {
    for (let i = 0; i < tasks2.length; i++) {
        if (id === tasks2[i].id) {
            return i;
        }
    }
}

/**
 * Prevents an error that occurs when an element is dropped between the board lists by resetting its rotation and hiding all box shadows
 */
function preventOndropError() {
    currentDraggedElement.addEventListener('dragend', () => {
        currentDraggedElement.style.transform = 'rotate(0deg)';
        for (let i = 0; i < boxShadows.length; i++) {
            document.getElementById(boxShadows[i]).classList.add('d-none');
        }
    });
}

/**
 * Rotates a dragged task based on the given option
 * @param {Number} option - Number that determines which rotation action to perform
 */
function rotateDraggedTask(option) {
    let index = getIndexOfTask(currentDraggedElementId);
    if (window.innerWidth > 1095) {
        switch (option) {
            case 1:
                setToDoTaskRotation(index);
            break;
            case 2:
                setInProgressTaskRotation(index)
            break;
            case 3:
                setAwaitingFeedbackTaskRotation(index);
            break;
            case 4:
                setDoneTaskRotation(index);
            break;
        }
    }
}

/**
 * Rotates a dragged task in "to do" list based on the given option
 * @param {Number} option - Number that determines which rotation action to perform
 */
function setToDoTaskRotation(index) {
    setRotateDirection('In progress', 'rotate(-10deg)', index);
}

/**
 * Rotates a dragged task in "in progress" list based on the given option and window width
 * @param {Number} option - Number that determines which rotation action to perform
 */
function setInProgressTaskRotation(index) {
    if (window.innerWidth < 1439) {
        setRotateDirection('Awaiting Feedback', 'rotate(10deg)', index);
        setRotateDirection('To do', 'rotate(10deg)', index);
    } else {
        setRotateDirection('Awaiting Feedback', 'rotate(-10deg)', index);
        setRotateDirection('To do', 'rotate(10deg)', index);
    }
}

/**
 * Rotates a dragged task in "awaiting feedback" list based on the given option and window width
 * @param {Number} option - Number that determines which rotation action to perform
 */
function setAwaitingFeedbackTaskRotation(index) {
    if (window.innerWidth < 1439) {
        setRotateDirection('Done', 'rotate(-10deg)', index);
        setRotateDirection('In progress', 'rotate(-10deg)', index);
    } else {
        setRotateDirection('Done', 'rotate(-10deg)', index);
        setRotateDirection('In progress', 'rotate(10deg)', index);
    }
}

/**
 * Rotates a dragged task in "done" list based on the given option
 * @param {Number} option - Number that determines which rotation action to perform
 */
function setDoneTaskRotation(index) {
    setRotateDirection('Awaiting Feedback', 'rotate(10deg)', index);
}

/**
 * Sets the rotate direction of a dragged task element based on the provided parameters
 * @param {String} draggedTask - Represents the task that is being dragged
 * @param {String} rotateDirection - Represents the direction in which the element should be rotated
 * @param index - Index of the dragged task in the tasks2 array
 */
function setRotateDirection(draggedTask, rotateDirection, index) {
    if (currentDrag && tasks2[index].status == draggedTask) {
        currentDraggedElement.style.transform = rotateDirection;
    }
}
import {Status} from "./enums/status.js";
import {
    selectProject,
    getAllTasks,
    getAllProjects,
    getProjectName,
    getSelectedProjectId,
    leaveProject, getAllNotes, editTaskStatus,
} from "./project-service.js";
import {pubSub} from "./pub-sub.js";
import {EventType} from "./enums/event-type.js";
import {DisplayState} from "./enums/display-state.js";
import {SortBy} from "./enums/sort-by";
import {filteredOverdueTasks, sortedTasks} from "./task-filter-service";
import {CardAction} from "./enums/card-action";
import * as pager from "./pager.js";

/**
 * @module contentDisplayController
 * @description Responsible for UI interaction in the main section of the page.
 * Enables viewing projects and their contents.
 */

let displayState = DisplayState.VIEW_PROJECTS;

const projectsContainer = document.querySelector("#projects-container");

const projectsInfoDisplay = document.querySelector("#projects-info h2");
const backButton = document.querySelector("#btn-back");

const tasksOrderInput = document.querySelector("#tasks-ordering");
const tasksFilterInput = document.querySelector("#tasks-filtering");

const prevButton = document.querySelector("#btn-prev");
const nextButton = document.querySelector("#btn-next");
const currPageDisplay = document.querySelector("#curr-page");
const totalItemsDisplay = document.querySelector("#total-items");

projectsContainer.addEventListener("click", (event) => {
    const id= event.target.dataset.id;
    if (!id) return;

    const action = CardAction.fromString(event.target.dataset.action);

    switch (action) {
        case CardAction.OPEN_PROJECT:
            openProject(id);
            break;
        case CardAction.VIEW_TASK:
            pubSub.publish(EventType.TASK_VIEW_REQUESTED, id);
            break;
        case CardAction.VIEW_NOTE:
            pubSub.publish(EventType.NOTE_VIEW_REQUESTED, id);
            break;
        case CardAction.DELETE_PROJECT:
            pubSub.publish(EventType.PROJECT_DELETE_REQUESTED, id);
            break;
        case CardAction.DELETE_TASK:
            pubSub.publish(EventType.TASK_DELETE_REQUESTED, id);
            break;
        case CardAction.DELETE_NOTE:
            pubSub.publish(EventType.NOTE_DELETE_REQUESTED, id);
            break;
        case CardAction.CHANGE_TASK_STATUS:
            changeTaskStatus(event.target.value, id);
            break;
        case CardAction.EDIT_NOTE:
            pubSub.publish(EventType.NOTE_EDIT_REQUESTED, id);
            break;
        case CardAction.EDIT_TASK:
            pubSub.publish(EventType.TASK_EDIT_REQUESTED, id);
            break;
    }

});

document.querySelector("#items-options").addEventListener("click", swapProjectContent);
document.querySelector("#sorting-options").addEventListener("click", swapTasks);
document.querySelector("#filtering-options").addEventListener("click", swapTasks);
document.querySelector("#items-select").addEventListener("change", updateItemsPerPage);

// come back to all projects
backButton.addEventListener("click", () => {
    leaveProject();
    resetPage();
    displayProjects(getAllProjects());
    displayState = DisplayState.VIEW_PROJECTS;
    projectsInfoDisplay.textContent = "All Projects";
    backButton.disabled = true;
});

prevButton.addEventListener("click", () => {
    if (!pager.prevPage()) return;
    const currData = getDisplayOptions();

    currData.displayFunction(currData.dataArray);
    currPageDisplay.textContent = "" + pager.getCurrPageNumber();
});

nextButton.addEventListener("click", () => {
    const currData = getDisplayOptions();
    if (!pager.nextPage(currData.dataArray)) return;

    currData.displayFunction(currData.dataArray);
    currPageDisplay.textContent = "" + pager.getCurrPageNumber();
});

pubSub.subscribe(EventType.PROJECT_CREATED, () => {
    if (displayState !== DisplayState.VIEW_PROJECTS) return;

    displayProjects(getAllProjects());
});

pubSub.subscribe(EventType.TASK_CREATED, (data) => {
    if (displayState === DisplayState.VIEW_PROJECTS) {
        displayProjects(getAllProjects());
    } else if (displayState === DisplayState.VIEW_Tasks && data.projectId === getSelectedProjectId()) {
        displayTasks(getAllTasks());
    }
});

pubSub.subscribe(EventType.NOTE_CREATED, (data) => {
   if (displayState === DisplayState.VIEW_PROJECTS) {
       displayProjects(getAllProjects());
   } else if (displayState === DisplayState.VIEW_Notes && data.projectId === getSelectedProjectId()) {
       displayNotes(getAllNotes());
   }
});

pubSub.subscribe(EventType.PROJECT_DELETED, () => {
    if (displayState !== DisplayState.VIEW_PROJECTS) return;

    const projects = getAllProjects();

    validatePage(projects);

    displayProjects(projects);
});

pubSub.subscribe(EventType.TASK_DELETED, () => {
    if (displayState !== DisplayState.VIEW_Tasks) return;

    const tasks = getAllTasks();

    validatePage(tasks);

    displayTasks(getAllTasks());
});

pubSub.subscribe(EventType.NOTE_DELETED, () => {
    if (displayState !== DisplayState.VIEW_Notes) return;

    const notes = getAllNotes();

    validatePage(notes);

    displayNotes(notes);
});

pubSub.subscribe(EventType.NOTE_EDITED, () => {
    if (displayState !== DisplayState.VIEW_Notes) return;

    displayNotes(getAllNotes());
});

pubSub.subscribe(EventType.TASK_EDITED, () => {
    if (displayState !== DisplayState.VIEW_Tasks) return;

    displayTasks(getAllTasks());
});

function getDisplayOptions() {
    let dataArray;
    let displayFunction;

    switch (displayState) {
        case DisplayState.VIEW_PROJECTS:
            dataArray = getAllProjects();
            displayFunction = displayProjects;
            break;
        case DisplayState.VIEW_Tasks:
            dataArray = getAllTasks();
            displayFunction = displayTasks;
            break;
        case DisplayState.VIEW_Notes:
            dataArray = getAllNotes();
            displayFunction = displayNotes;
            break;
    }

    return {dataArray, displayFunction};
}

/**
 *
 * @param {Array<any>} elements
 */
function validatePage(elements) {
    if (!pager.isCurrentPageValid(elements)) {
        pager.prevPage();
        currPageDisplay.textContent = "" + pager.getCurrPageNumber();
    }
}

function resetPage() {
    pager.resetPageNumber()
    currPageDisplay.textContent = "" + pager.getCurrPageNumber();
}

/**
 *
 * @param {Event} e
 */
function updateItemsPerPage(e) {
    const updatedValue = Number(e.target.value);
    pager.setPageSize(updatedValue);

    const options = getDisplayOptions();
    resetPage();
    options.displayFunction(options.dataArray);
}

/**
 *
 * @param {Event} e
 */
function swapTasks(e) {
    if (displayState !== DisplayState.VIEW_Tasks) return;
    if (e.target.tagName !== "INPUT" && e.target.tagName !== "LABEL") return;

    resetPage();
    displayTasks(getAllTasks());
}

/**
 *
 * @param {Event} e
 */
function swapProjectContent(e) {
    if (displayState === DisplayState.VIEW_PROJECTS) return;
    if (e.target.tagName !== "INPUT" &&  e.target.tagName !== "LABEL") return;

    const selectedOption = document.querySelector('#items-options input[name="display-mode"]:checked');

    resetPage();
    displayChosenContent(selectedOption.value);
}

/**
 *
 * @param {string} selectedValue
 */
function displayChosenContent(selectedValue) {
    displayState = DisplayState.fromString(selectedValue);

    if (displayState === DisplayState.VIEW_Tasks) {
        displayTasks(getAllTasks());
    } else if (displayState === DisplayState.VIEW_Notes) {
        displayNotes(getAllNotes());
    }
}

/**
 *
 * @param {string} projectId
 */
function openProject(projectId) {
    selectProject(projectId);

    const selectedOption = document.querySelector('#items-options input[name="display-mode"]:checked');
    resetPage();
    displayChosenContent(selectedOption.value);
    projectsInfoDisplay.textContent = getProjectName();
    backButton.disabled = false;
}

/**
 *
 * @param {string} value status in string form
 * @param {string} id
 */
function changeTaskStatus(value, id) {
    if (displayState !== DisplayState.VIEW_Tasks) return;
    const updatedStatus = /** @type Status */ Status.fromString(value);

    if (!editTaskStatus(id, updatedStatus)) return;

    displayTasks(getAllTasks());
}

/**
 * @param {module:projectService.ProjectSummary} projectData
 * @returns {HTMLDivElement}
 */
function generateProjectCard(projectData) {
    const card = document.createElement("div");

    const heading = document.createElement("h3");
    const deleteButton = document.createElement("button");

    const itemsInfoWrapper = document.createElement("div");
    const totalTasks = document.createElement("p");
    const totalNotes = document.createElement("p");

    heading.textContent = projectData.title;
    deleteButton.textContent = "x";
    totalTasks.textContent = "Tasks: " + projectData.tasks;
    totalNotes.textContent = "Notes: " + projectData.notes;

    deleteButton.dataset.action = CardAction.DELETE_PROJECT.name;
    deleteButton.dataset.id = projectData.id;

    card.dataset.id = projectData.id;
    card.dataset.action = CardAction.OPEN_PROJECT.name;
    card.setAttribute("class", "project-card");

    itemsInfoWrapper.append(totalTasks, totalNotes);
    card.append(heading, deleteButton, itemsInfoWrapper);

    return card;
}

/**
 * @param {module:projectService.TaskSummary} taskSummary
 * @returns {HTMLDivElement}
 */
function generateTaskCard(taskSummary) {
    const card = document.createElement("div");
    const heading = document.createElement("h4");
    const selectStatus = document.createElement("select");
    const dateInfo = document.createElement("p");
    const deleteButton = document.createElement("button");
    const editButton = document.createElement("button");

    for (const status of Object.values(Status)) {
        const option = document.createElement("option");
        option.value = status.name;
        option.textContent = status.name;

        if (status.name === taskSummary.status.name) {
            option.selected = true;
        }
        selectStatus.appendChild(option);
    }

    heading.textContent = taskSummary.title;
    selectStatus.dataset.id = taskSummary.id;
    selectStatus.dataset.action = CardAction.CHANGE_TASK_STATUS.name;
    dateInfo.textContent = taskSummary.dueDate.toLocaleDateString();

    deleteButton.textContent = "X";
    deleteButton.dataset.id = taskSummary.id;
    deleteButton.dataset.action = CardAction.DELETE_TASK.name;

    editButton.textContent = "edit";
    editButton.dataset.id = taskSummary.id;
    editButton.dataset.action = CardAction.EDIT_TASK.name;

    card.dataset.id = taskSummary.id;
    card.dataset.action = CardAction.VIEW_TASK.name;
    card.setAttribute("class", "task-card");

    card.append(heading, selectStatus, dateInfo, deleteButton, editButton);

    return card;
}

/**
 *
 * @param {module:note.Note} note
 * @returns {HTMLDivElement}
 */
function generateNoteCard(note) {
    const card = document.createElement("div");
    const heading = document.createElement("h3");
    const deleteButton = document.createElement("button");
    const editButton = document.createElement("button");
    const content = document.createElement("p");

    heading.textContent = note.title;
    content.textContent = note.content;

    deleteButton.textContent = "x";
    deleteButton.dataset.id = note.id;
    deleteButton.dataset.action = CardAction.DELETE_NOTE.name;

    editButton.textContent = "edit";
    editButton.dataset.id = note.id;
    editButton.dataset.action = CardAction.EDIT_NOTE.name;

    card.dataset.id = note.id;
    card.dataset.action = CardAction.VIEW_NOTE.name;
    card.setAttribute("class", "note-card");

    card.append(heading, deleteButton, editButton, content);

    return card;
}

/**
 * Displays cards in projects container
 * @param {Array<any>} cardsData The data from which cards will be made of.
 * @param {Function} generateCard A function that takes card data and returns a card element.
 */
function displayCards(cardsData, generateCard) {
    totalItemsDisplay.textContent = "" + cardsData.length;
    const currPageElements = pager.getCurrentPage(cardsData);
    const fragment = document.createDocumentFragment();

    for (const item of currPageElements) {
        fragment.appendChild(generateCard(item));
    }

    projectsContainer.replaceChildren(fragment);
}

/**
 * @param {Array<module:projectService.ProjectSummary>} summaries
 */
function displayProjects(summaries) {
    if (!summaries) return;
    displayCards(summaries, generateProjectCard);
}

/**
 * @param {Array<module:projectService.TaskSummary>} summaries
 */
function displayTasks(summaries) {
    if (!summaries) return;

    const selectedSortingOption = document.querySelector('#sorting-options input[name="sorting-mode"]:checked');

    let tasksToDisplay;
    try {
        const sortBy = /** @type SortBy */ SortBy.fromString(selectedSortingOption.value);
        const ascending= tasksOrderInput.checked;
        tasksToDisplay = sortedTasks(summaries, sortBy, ascending);
    } catch (error) {
        tasksToDisplay = summaries;
    }

    const filter = tasksFilterInput.checked;
    tasksToDisplay = filter ? filteredOverdueTasks(tasksToDisplay) : tasksToDisplay;

    displayCards(tasksToDisplay, generateTaskCard);
}

/**
 * @param {Array<module:note.Note>} notes
 */
function displayNotes(notes) {
    if (!notes) return;
    displayCards(notes, generateNoteCard);
}

export {displayProjects};

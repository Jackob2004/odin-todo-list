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

projectsContainer.addEventListener("click", (event) => {
    const id= event.target.dataset.id;
    if (!id) return;

    const action = CardAction.fromString(event.target.dataset.action);

    switch (action) {
        case CardAction.OPEN_PROJECT:
            openProject(id);
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
    }

});

document.querySelector("#items-options").addEventListener("click", swapProjectContent);
document.querySelector("#sorting-options").addEventListener("click", swapTasks);
document.querySelector("#filtering-options").addEventListener("click", swapTasks);

// come back to all projects
backButton.addEventListener("click", () => {
    leaveProject();
    displayProjects(getAllProjects());
    displayState = DisplayState.VIEW_PROJECTS;
    projectsInfoDisplay.textContent = "All Projects";
    backButton.disabled = true;
});

pubSub.subscribe(EventType.PROJECT_CREATED, (data) => {
    if (displayState !== DisplayState.VIEW_PROJECTS) return;

    const summary = {
        title: data.title,
        tasks: data.tasks.size,
        notes: data.notes.size,
        id: data.id,
    };

    const projectCard = generateProjectCard(summary);
    projectsContainer.appendChild(projectCard);
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
       const note = {
           title: data.note.title,
           content: data.note.content,
           id: data.note.id,
       };

       const noteCard = generateNoteCard(note);
       projectsContainer.appendChild(noteCard);
   }
});

pubSub.subscribe(EventType.PROJECT_DELETED, () => {
    if (displayState !== DisplayState.VIEW_PROJECTS) return;

    displayProjects(getAllProjects());
});

pubSub.subscribe(EventType.TASK_DELETED, () => {
    if (displayState !== DisplayState.VIEW_Tasks) return;

    displayTasks(getAllTasks());
});

pubSub.subscribe(EventType.NOTE_DELETED, () => {
    if (displayState !== DisplayState.VIEW_Notes) return;

    displayNotes(getAllNotes());
});

/**
 *
 * @param {Event} e
 */
function swapTasks(e) {
    if (displayState !== DisplayState.VIEW_Tasks) return;
    if (e.target.tagName !== "INPUT" && e.target.tagName !== "LABEL") return;

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

    card.dataset.id = taskSummary.id;
    card.dataset.action = CardAction.OPEN_TASK.name;
    card.setAttribute("class", "task-card");

    card.append(heading, selectStatus, dateInfo, deleteButton);

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
    const content = document.createElement("p");

    heading.textContent = note.title;
    deleteButton.textContent = "x";
    deleteButton.dataset.id = note.id;
    deleteButton.dataset.action = CardAction.DELETE_NOTE.name;
    content.textContent = note.content;

    card.dataset.noteId = note.id;
    card.setAttribute("class", "note-card");

    card.append(heading, deleteButton, content);

    return card;
}

/**
 * Displays cards in projects container
 * @param {Array<any>} cardsData The data from which cards will be made of.
 * @param {Function} generateCard A function that takes card data and returns a card element.
 */
function displayCards(cardsData, generateCard) {
    const fragment = document.createDocumentFragment();

    for (const item of cardsData) {
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

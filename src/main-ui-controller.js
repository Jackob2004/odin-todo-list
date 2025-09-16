import {Status} from "./enums/status.js";
import {selectProject, getAllTasks, getAllProjects, getProjectName} from "./project-service.js";

/**
 * @module mainUIController responsible for UI interaction in the main section of the page.
 * Enables viewing projects and their contents.
 */

const projectsContainer = document.querySelector("#projects-container");
const projectsInfoDisplay = document.querySelector("#projects-info h2");
const backButton = document.querySelector("#btn-back");

projectsContainer.addEventListener("click", (event) => {
   if (event.target.dataset.projectId) {
       openProject(event.target.dataset.projectId);
   }
});

// come back to all projects
backButton.addEventListener("click", () => {
    displayProjects(getAllProjects());
    projectsInfoDisplay.textContent = "All Projects";
    backButton.disabled = true;
});

/**
 *
 * @param {string} projectId
 */
function openProject(projectId) {
    selectProject(projectId);
    const tasks = getAllTasks();
    if (!tasks) return;

    displayTasks(tasks);
    projectsInfoDisplay.textContent = getProjectName();
    backButton.disabled = false;
}

/**
 * @param {module:projectService.ProjectSummary} projectData
 * @returns HTMLDivElement
 */
function generateProjectCard(projectData) {
    const card = document.createElement("div");

    const heading = document.createElement("h3");

    const itemsInfoWrapper = document.createElement("div");
    const totalTasks = document.createElement("p");
    const totalNotes = document.createElement("p");

    heading.textContent = projectData.title;
    totalTasks.textContent = "Tasks: " + projectData.tasks;
    totalNotes.textContent = "Notes: " + projectData.notes;

    card.dataset.projectId = projectData.id;
    card.setAttribute("class", "project-card");

    itemsInfoWrapper.append(totalTasks, totalNotes);
    card.append(heading, itemsInfoWrapper);

    return card;
}

/**
 * @param {module:projectService.TaskSummary} taskSummary
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
    dateInfo.textContent = taskSummary.dueDate.toLocaleDateString();
    deleteButton.textContent = "X";

    card.dataset.taskId = taskSummary.id;
    card.setAttribute("class", "task-card");

    card.append(heading, selectStatus, dateInfo, deleteButton);

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
    displayCards(summaries, generateProjectCard);
}

/**
 * @param {Array<module:projectService.TaskSummary>} summaries
 */
function displayTasks(summaries) {
    displayCards(summaries, generateTaskCard);
}

export {displayProjects};

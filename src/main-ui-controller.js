import {Status} from "./enums/status";

/**
 * @module mainUIController responsible for UI interaction in the main section of the page.
 * Enables viewing projects and their contents
 */

const projectsContainer = document.querySelector("#projects-container");

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
 * @param {Array<module:projectService.ProjectSummary>} projects
 */
function displayProjectsCards(projects) {
    const fragment = document.createDocumentFragment();

    for (const project of projects) {
        fragment.appendChild(generateProjectCard(project));
    }

    projectsContainer.appendChild(fragment);
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

    heading.textContent = taskSummary.title;

    for (const status of Object.values(Status)) {
        const option = document.createElement("option");
        option.value = status;
        option.textContent = status;

        if (status.name === taskSummary.status.name) {
            option.selected = true;
        }
        selectStatus.appendChild(option);
    }

    dateInfo.textContent = taskSummary.dueDate.toLocaleDateString();
    deleteButton.textContent = "X";

    card.dataset.taskId = taskSummary.id;
    card.setAttribute("class", "task-card");
    card.append(heading, selectStatus, dateInfo, deleteButton);

    return card;
}

export {displayProjectsCards};

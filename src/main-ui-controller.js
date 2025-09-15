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

    card.dataset.id = projectData.id;
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

import {pubSub} from "./pub-sub";
import {EventType} from "./enums/event-type";
import {deleteProject, getProjectName} from "./project-service";

/**
 * @module contentDeletionController
 * @description Handles UI interactions and requests for content deletion (tasks, projects, notes)
 * including modal dialogs and publishing deletion events via PubSub
 */

const projectDeleteWindow = document.querySelector("#delete-project-window");
const projectDeleteNameDisplay = document.querySelector("#delete-project-name");
const projectDeleteConfirm = document.querySelector("#btn-confirm-project-deletion");

document.querySelector("#btn-cancel-project-deletion").addEventListener("click", () => projectDeleteWindow.close());
projectDeleteConfirm.addEventListener("click", handleProjectDeletion);

pubSub.subscribe(EventType.PROJECT_DELETE_REQUESTED, (projectId) => {
    projectDeleteNameDisplay.textContent = getProjectName(projectId);
    projectDeleteConfirm.dataset.projectId = projectId;

    projectDeleteWindow.showModal();
});

/**
 *
 * @param {Event} e
 */
function handleProjectDeletion(e) {
    const id = e.target.dataset.projectId;

    if (!deleteProject(id)) return;

    projectDeleteWindow.close();
    pubSub.publish(EventType.PROJECT_DELETED, id);
}




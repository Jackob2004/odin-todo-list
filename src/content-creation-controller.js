import {createProject} from "./model/project.js";
import {addProject} from "./project-service";

/**
 * @module contentCreationController
 * Handles UI interactions for creating new content (tasks, projects, notes)
 * including modal dialogs and publishing creation events via PubSub
 */

const buttonsSection = document.querySelector("#add-actions");

const projectAddWindow = document.querySelector("#add-project-window");
const projectAddForm = document.querySelector("#add-project-window form");

buttonsSection.addEventListener("click", (e) => {
    switch (e.target.id) {
        case "add-project":
            showProjectAddWindow();
            break;
        case "add-task":
            console.log("add task");
            break;
        case "add-note":
            console.log("add note");
            break;
    }
});

document.querySelector("#add-project-window button[type='button']").onclick = () => projectAddWindow.close();
projectAddForm.addEventListener("submit", handleProjectCreation)

function showProjectAddWindow() {
    projectAddForm.reset();
    projectAddWindow.showModal();
}

function handleProjectCreation() {
    const projectTitle= new FormData(projectAddForm).get("title");
    const project = createProject(projectTitle);

    if (!addProject(project)) return;

    console.log("notify");
}

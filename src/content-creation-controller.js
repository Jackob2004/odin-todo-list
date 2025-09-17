import {createProject} from "./model/project.js";
import {addProject, addTask, getAllProjects, getProjectName, getSelectedProjectId} from "./project-service.js";
import {pubSub} from "./pub-sub.js";
import {EventType} from "./enums/event-type.js";
import {Priority} from "./enums/priority.js";
import {Status} from "./enums/status.js";
import {createTask} from "./model/task.js";

/**
 * @module contentCreationController
 * Handles UI interactions for creating new content (tasks, projects, notes)
 * including modal dialogs and publishing creation events via PubSub
 */

const buttonsSection = document.querySelector("#add-actions");

const projectAddWindow = document.querySelector("#add-project-window");
const projectAddForm = document.querySelector("#add-project-window form");

const taskAddWindow = document.querySelector("#add-task-window");
const taskAddForm = document.querySelector("#add-task-window form");
const availableProjectsList= document.querySelector("#available-projects");

buttonsSection.addEventListener("click", (e) => {
    switch (e.target.id) {
        case "add-project":
            showProjectAddWindow();
            break;
        case "add-task":
            showTaskAddWindow();
            break;
        case "add-note":
            console.log("add note");
            break;
    }
});

document.querySelector("#add-project-window button[type='button']").onclick = () => projectAddWindow.close();
projectAddForm.addEventListener("submit", handleProjectCreation);

document.querySelector("#add-task-window button[type='button']").onclick = () => taskAddWindow.close();
taskAddForm.addEventListener("submit", handleTaskCreation);

function showProjectAddWindow() {
    projectAddForm.reset();
    projectAddWindow.showModal();
}

function handleProjectCreation() {
    const projectTitle= new FormData(projectAddForm).get("title");
    const project = createProject(projectTitle);

    if (!addProject(project)) return;

    pubSub.publish(EventType.PROJECT_CREATED, project);
}

/**
 *
 * @returns {DocumentFragment}
 */
function generateAvailableProjects() {
    const fragment = document.createDocumentFragment();

    const currProjectId = getSelectedProjectId();
    // make sure first option is at the top
    if (currProjectId) {
        const firstOption = document.createElement("option");
        firstOption.value = getProjectName();
        firstOption.label = "[Current Project]";
        firstOption.dataset.projectId = currProjectId;

        fragment.appendChild(firstOption);
    }

    for (const summary of getAllProjects()) {
        if (currProjectId === summary.id) continue;

        const option = document.createElement("option");
        option.value = summary.title;
        option.dataset.projectId = summary.id;

        fragment.appendChild(option);
    }

    return fragment;
}

/**
 *
 * @param {FormData} formData
 * @returns {string} selected project id
 */
function retrieveProjectId(formData) {
    const selectedName = formData.get("task-project-choice");
    const selectedOption = document.querySelector(`#available-projects option[value="${selectedName}"]`);

    return selectedOption.dataset.projectId;
}

function showTaskAddWindow() {
    taskAddForm.reset();

    const currDate = new Date().toISOString().split("T")[0];
    taskAddForm.date.value = currDate;
    taskAddForm.date.min = currDate;

    availableProjectsList.replaceChildren(generateAvailableProjects());

    taskAddWindow.showModal();
}

function handleTaskCreation() {
    const formData = new FormData(taskAddForm);

    const projectId = retrieveProjectId(formData);

    const taskTitle = formData.get("title");
    const description = formData.get("description");
    const dueDate = new Date("" + formData.get("date"));
    const priority = /** @type {Priority} */ Priority.fromString(formData.get("priority"));
    const trackable = formData.get("track") === "on";

    const task = createTask(taskTitle, description, dueDate, priority, Status.NOT_STARTED, trackable);
    if (!addTask(task, projectId)) return;

    pubSub.publish(EventType.TASK_CREATED, {task: task, projectId: projectId});
}

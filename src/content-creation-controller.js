import {createProject} from "./model/project.js";
import {addNote, addProject, addTask, getAllProjects, getProjectName, getSelectedProjectId} from "./project-service.js";
import {pubSub} from "./pub-sub.js";
import {EventType} from "./enums/event-type.js";
import {Priority} from "./enums/priority.js";
import {Status} from "./enums/status.js";
import {createTask} from "./model/task.js";
import {createNote} from "./model/note";

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
const taskProjectSelect = document.querySelector("#task-project-select");

const noteAddWindow = document.querySelector("#add-note-window");
const noteAddForm = document.querySelector("#add-note-window form");
const noteProjectSelect = document.querySelector("#note-project-select");

buttonsSection.addEventListener("click", (e) => {
    switch (e.target.id) {
        case "add-project":
            showProjectAddWindow();
            break;
        case "add-task":
            showTaskAddWindow();
            break;
        case "add-note":
            showNoteAddWindow();
            break;
    }
});

document.querySelector("#add-project-window button[type='button']").onclick = () => projectAddWindow.close();
projectAddForm.addEventListener("submit", handleProjectCreation);

document.querySelector("#add-task-window button[type='button']").onclick = () => taskAddWindow.close();
taskAddForm.addEventListener("submit", handleTaskCreation);

document.querySelector("#add-note-window button[type='button']").onclick = () => noteAddWindow.close();
noteAddForm.addEventListener("submit", handleNoteCreation);

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
        firstOption.value = currProjectId;
        firstOption.textContent = "[Current Project] " + getProjectName();

        fragment.appendChild(firstOption);
    }

    for (const summary of getAllProjects()) {
        if (currProjectId === summary.id) continue;

        const option = document.createElement("option");
        option.value = summary.id;
        option.textContent = summary.title;

        fragment.appendChild(option);
    }

    return fragment;
}

function showTaskAddWindow() {
    taskAddForm.reset();

    const currDate = new Date().toISOString().split("T")[0];
    taskAddForm.date.value = currDate;
    taskAddForm.date.min = currDate;

    taskProjectSelect.replaceChildren(generateAvailableProjects());

    taskAddWindow.showModal();
}

function handleTaskCreation() {
    const formData = new FormData(taskAddForm);

    const projectId = formData.get("project");

    const title = formData.get("title");
    const description = formData.get("description");
    const dueDate = new Date("" + formData.get("date"));
    const priority = /** @type {Priority} */ Priority.fromString(formData.get("priority"));
    const trackable = formData.get("track") === "on";

    const task = createTask(title, description, dueDate, priority, Status.NOT_STARTED, trackable);
    if (!addTask(task, projectId)) return;

    pubSub.publish(EventType.TASK_CREATED, {task: task, projectId: projectId});
}

function showNoteAddWindow() {
    noteAddForm.reset();

    noteProjectSelect.replaceChildren(generateAvailableProjects());

    noteAddWindow.showModal();
}

function handleNoteCreation() {
    const formData = new FormData(noteAddForm);

    const projectId = formData.get("project");

    const title = formData.get("title");
    const description = formData.get("description");

    const note = createNote(title, description);
    if (!addNote(note, projectId)) return;

    pubSub.publish(EventType.NOTE_CREATED, {note: note, projectId: projectId});
}
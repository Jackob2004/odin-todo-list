import {pubSub} from "./pub-sub";
import {EventType} from "./enums/event-type";
import {deleteNote, deleteProject, deleteTask, getNoteName, getProjectName, getTaskName} from "./project-service";

/**
 * @module contentDeletionController
 * @description Handles UI interactions and requests for content deletion (tasks, projects, notes)
 * including modal dialogs and publishing deletion events via PubSub
 */

const projectDeleteWindow = document.querySelector("#delete-project-window");
const projectDeleteNameDisplay = document.querySelector("#delete-project-name");
const projectDeleteConfirm = document.querySelector("#btn-confirm-project-deletion");

const taskDeleteWindow = document.querySelector("#delete-task-window");
const taskDeleteNameDisplay = document.querySelector("#delete-task-name");
const taskDeleteConfirm = document.querySelector("#btn-confirm-task-deletion");

const noteDeleteWindow = document.querySelector("#delete-note-window");
const noteDeleteNameDisplay = document.querySelector("#delete-note-name");
const noteDeleteConfirm = document.querySelector("#btn-confirm-note-deletion");

document.querySelector("#btn-cancel-project-deletion").addEventListener("click", () => projectDeleteWindow.close());
projectDeleteConfirm.addEventListener("click", handleProjectDeletion);

document.querySelector("#btn-cancel-task-deletion").addEventListener("click", () => taskDeleteWindow.close());
taskDeleteConfirm.addEventListener("click", handleTaskDeletion);

document.querySelector("#btn-cancel-note-deletion").addEventListener("click", () => noteDeleteWindow.close());
noteDeleteConfirm.addEventListener("click", handleNoteDeletion);

pubSub.subscribe(EventType.PROJECT_DELETE_REQUESTED, (projectId) => {
    projectDeleteNameDisplay.textContent = getProjectName(projectId);
    projectDeleteConfirm.dataset.projectId = projectId;

    projectDeleteWindow.showModal();
});

pubSub.subscribe(EventType.TASK_DELETE_REQUESTED, (taskId) => {
    taskDeleteNameDisplay.textContent = getTaskName(taskId);
    taskDeleteConfirm.dataset.taskId = taskId;

    taskDeleteWindow.showModal();
});

pubSub.subscribe(EventType.NOTE_DELETE_REQUESTED, (noteId) => {
    noteDeleteNameDisplay.textContent = getNoteName(noteId)
    noteDeleteConfirm.dataset.noteId = noteId;

    noteDeleteWindow.showModal();
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

/**
 *
 * @param {Event} e
 */
function handleTaskDeletion(e) {
    const id = e.target.dataset.taskId;

    if (!deleteTask(id)) return;

    taskDeleteWindow.close();
    pubSub.publish(EventType.TASK_DELETED, id);
}

/**
 *
 * @param {Event} e
 */
function handleNoteDeletion(e) {
    const id = e.target.dataset.noteId;

    if (!deleteNote(id)) return;

    noteDeleteWindow.close();
    pubSub.publish(EventType.NOTE_DELETED, id);
}




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
projectDeleteConfirm.addEventListener("click", (e) => {
    handleDeletion(e, deleteProject, projectDeleteWindow, EventType.PROJECT_DELETED);
});

document.querySelector("#btn-cancel-task-deletion").addEventListener("click", () => taskDeleteWindow.close());
taskDeleteConfirm.addEventListener("click", (e) => {
    handleDeletion(e, deleteTask, taskDeleteWindow, EventType.TASK_DELETED);
});

document.querySelector("#btn-cancel-note-deletion").addEventListener("click", () => noteDeleteWindow.close());
noteDeleteConfirm.addEventListener("click", (e) => {
    handleDeletion(e, deleteNote, noteDeleteWindow, EventType.NOTE_DELETED);
});

pubSub.subscribe(EventType.PROJECT_DELETE_REQUESTED, (projectId) => {
    openDeletionWindow(projectDeleteNameDisplay, projectId, getProjectName, projectDeleteConfirm, projectDeleteWindow);
});

pubSub.subscribe(EventType.TASK_DELETE_REQUESTED, (taskId) => {
    openDeletionWindow(taskDeleteNameDisplay, taskId, getTaskName, taskDeleteConfirm, taskDeleteWindow);
});

pubSub.subscribe(EventType.NOTE_DELETE_REQUESTED, (noteId) => {
    openDeletionWindow(noteDeleteNameDisplay, noteId, getNoteName, noteDeleteConfirm, noteDeleteWindow);
});

/**
 *
 * @param {Element} nameDisplay
 * @param {string} id
 * @param {Function} callback
 * @param {HTMLButtonElement} confirmBtn
 * @param {HTMLDialogElement} deletionWindow
 */
function openDeletionWindow(nameDisplay, id, callback, confirmBtn, deletionWindow) {
    nameDisplay.textContent = callback(id);
    confirmBtn.dataset.id = id;

    deletionWindow.showModal();
}

/**
 *
 * @param {Event} e
 * @param {Function} callback
 * @param {HTMLDialogElement} windowToClose
 * @param {EventType} eventToPublish
 */
function handleDeletion(e, callback, windowToClose, eventToPublish) {
    const id = e.target.dataset.id;

    if (!callback(id)) return;

    windowToClose.close();
    pubSub.publish(eventToPublish, id);
}
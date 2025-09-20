import {pubSub} from "./pub-sub";
import {EventType} from "./enums/event-type";
import {editNote, editTaskDetails, getNote, getProjectName, getTaskDetails} from "./project-service";
import {Priority} from "./enums/priority";

/**
 * @module contentEditController
 * @description Handles UI interactions and requests for content edits (tasks, notes)
 * including modal dialogs and publishing edit events via PubSub
 */

const noteEditWindow = document.querySelector("#edit-note-window");
const noteEditForm = document.querySelector("#edit-note-window form");
const noteEditProjectDisplay = document.querySelector("#edit-note-project-name");

const taskEditWindow = document.querySelector("#edit-task-window");
const taskEditForm = document.querySelector("#edit-task-window form");
const taskEditProjectDisplay = document.querySelector("#edit-task-project-name");

document.querySelector("#btn-cancel-note-edit").addEventListener("click", () => noteEditWindow.close());
noteEditForm.addEventListener("submit", handleNoteEdit);

document.querySelector("#btn-cancel-task-edit").addEventListener("click", () => taskEditWindow.close());
taskEditForm.addEventListener("submit", handleTaskEdit);

pubSub.subscribe(EventType.NOTE_EDIT_REQUESTED, (noteId) => {
    const note = getNote(noteId);

    noteEditProjectDisplay.textContent = getProjectName();
    noteEditForm.title.value = note.title;
    noteEditForm.description.value = note.content;

    noteEditForm.dataset.id = noteId;

    noteEditWindow.showModal();
});

pubSub.subscribe(EventType.TASK_EDIT_REQUESTED, (taskId) => {
    const taskDetails = getTaskDetails(taskId);

    taskEditProjectDisplay.textContent = getProjectName();
    taskEditForm.title.value = taskDetails.title;
    taskEditForm.description.value = taskDetails.description;
    taskEditForm.date.value = taskDetails.dueDate.toISOString().split("T")[0];
    taskEditForm.priority.value = taskDetails.priority.name;
    taskEditForm.track.checked = taskDetails.trackable;

    taskEditForm.dataset.id = taskId;

    taskEditWindow.showModal();
});

function handleNoteEdit() {
    const formData = new FormData(noteEditForm);

    const noteId = noteEditForm.dataset.id;
    const noteTitle = formData.get("title");
    const noteContent= formData.get("description");

    if (!editNote(noteId, noteTitle, noteContent)) return;

    pubSub.publish(EventType.NOTE_EDITED, noteId);
}

function handleTaskEdit() {
    const formData = new FormData(taskEditForm);

    const taskId = taskEditForm.dataset.id;

    const taskDetails = /** @type module:projectService.TaskDetails */ {
        title: formData.get("title"),
        description: formData.get("description"),
        dueDate: new Date("" + formData.get("date")),
        priority: Priority.fromString(formData.get("priority")),
        trackable: formData.get("track") === "on",
    };

    if (!editTaskDetails(taskId, taskDetails)) return;

    pubSub.publish(EventType.TASK_EDITED, taskId);
}
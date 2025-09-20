import {pubSub} from "./pub-sub";
import {EventType} from "./enums/event-type";
import {editNote, getNote, getProjectName} from "./project-service";

/**
 * @module contentEditController
 * @description Handles UI interactions and requests for content edits (tasks, projects, notes)
 * including modal dialogs and publishing edit events via PubSub
 */

const noteEditWindow = document.querySelector("#edit-note-window");
const noteEditForm = document.querySelector("#edit-note-window form");
const noteEditProjectDisplay = document.querySelector("#edit-note-project-name");

document.querySelector("#btn-cancel-note-edit").addEventListener("click", () => noteEditWindow.close());
noteEditForm.addEventListener("submit", handleNoteEdit);

pubSub.subscribe(EventType.NOTE_EDIT_REQUESTED, (noteId) => {
    const note = getNote(noteId);

    noteEditProjectDisplay.textContent = getProjectName();
    noteEditForm.title.value = note.title;
    noteEditForm.description.value = note.content;

    noteEditForm.dataset.id = noteId;

    noteEditWindow.showModal();
});

function handleNoteEdit() {
    const formData = new FormData(noteEditForm);

    const noteId = noteEditForm.dataset.id;
    const noteTitle = formData.get("title");
    const noteContent= formData.get("description");

    if (!editNote(noteId, noteTitle, noteContent)) return;

    pubSub.publish(EventType.NOTE_EDITED, noteId);
}



import {pubSub} from "./pub-sub";
import {EventType} from "./enums/event-type";
import {getTaskDetails} from "./project-service";

/**
 * @module contentViewController
 * @description Handles UI interactions for viewing content (tasks details, notes)
 */

const taskWindow = document.querySelector("#view-task-window");
const taskTitleDisplay = document.querySelector("#view-task-title");
const taskDescriptionDisplay = document.querySelector("#view-task-description");
const taskDateDisplay = document.querySelector("#view-task-date");
const taskPriorityDisplay = document.querySelector("#view-task-priority");
const taskTrackDisplay = document.querySelector("#view-task-track");

document.querySelector("#btn-close-task-view").addEventListener("click", () => taskWindow.close());

pubSub.subscribe(EventType.TASK_VIEW_REQUESTED, (taskId) => {
    const taskDetails = getTaskDetails(taskId);

    taskTitleDisplay.textContent = taskDetails.title;
    taskDescriptionDisplay.textContent = taskDetails.description;
    taskDateDisplay.textContent = taskDetails.dueDate.toISOString().split("T")[0];
    taskPriorityDisplay.textContent = taskDetails.priority.name;
    taskTrackDisplay.textContent = taskDetails.trackable ? "Yes" : "No";

    taskWindow.showModal();
});
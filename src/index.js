import "./reset.css";
import "./styles.css";
import * as projectService from "./project-service.js";
import "./content-creation-controller.js";
import * as mainUIController from "./content-display-controller.js";
import {createTask} from "./model/task";
import {Priority} from "./enums/priority";
import {Status} from "./enums/status";

document.addEventListener("DOMContentLoaded", initApp);

function initApp() {
    projectService.initializeDefaultProject();
    // just for the sake of testing
    const task = createTask("Sample", "Nothing there...", new Date ("2025-09-17"),Priority.MEDIUM,Status.NOT_STARTED,true);
    projectService.addTask(task);

    const allProjects = projectService.getAllProjects();
    mainUIController.displayProjects(allProjects);
}
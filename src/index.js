import "./reset.css";
import "./styles.css";
import {retrieveAllProjects} from "./storage-service.js"
import {loadProjects, initializeDefaultProject, getAllProjects} from "./project-service.js";
import "./content-creation-controller.js";
import "./content-deletion-controller.js";
import "./content-edit-controller.js";
import "./content-view-controller.js";
import {displayProjects} from "./content-display-controller.js";

document.addEventListener("DOMContentLoaded", initApp);

function initApp() {
    const retrievedProjects = retrieveAllProjects();

    if (retrievedProjects) {
        loadProjects(retrievedProjects);
    } else {
        initializeDefaultProject();
    }

    const allProjects = getAllProjects();
    displayProjects(allProjects);
}
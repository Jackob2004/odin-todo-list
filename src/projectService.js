/**
 * @module projectService responsible for managing projects and their corresponding tasks
 */

/**
 *
 * @type {Map<string, module:project.Project>}
 */
const projects = new Map();

/**
 *
 * @type {string|null}
 */
let selectedProjectId = null;

/**
 *
 * @param {module:project.Project} project
 */
function addProject(project) {
    projects.set(project.id, project);
}

/**
 *
 * @param {module:task.Task} task
 * @param {string} projectID provided argument or currently selected project as default
 * @returns {boolean} true if operation was successful
 */
function addTask(task, projectID = selectedProjectId) {
    if (!projects.has(projectID)) {
        return false;
    }

    projects.get(projectID).tasks.set(task.id, task);

    return true;
}

/**
 *
 * @param {module:note.Note} note
 * @param {string} projectID provided argument or currently selected project as default
 * @returns {boolean} true if operation was successful
 */
function addNote(note, projectID = selectedProjectId) {
    if (!projects.has(projectID)) {
        return false;
    }

    projects.get(projectID).notes.set(note.id, note);

    return true;
}

/**
 *
 * @param {string} projectID
 * @returns {boolean} true if operation was successful
 */
function selectProject(projectID) {
    if (!projects.has(projectID)) {
        return false;
    }

    selectedProjectId = projectID;

    return true;
}
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
 * @param {string} projectId provided argument or currently selected project as default
 * @returns {boolean} true if operation was successful
 */
function addTask(task, projectId = selectedProjectId) {
    if (!projects.has(projectId)) {
        return false;
    }

    projects.get(projectId).tasks.set(task.id, task);

    return true;
}

/**
 *
 * @param {module:note.Note} note
 * @param {string} projectId provided argument or currently selected project as default
 * @returns {boolean} true if operation was successful
 */
function addNote(note, projectId = selectedProjectId) {
    if (!projects.has(projectId)) {
        return false;
    }

    projects.get(projectId).notes.set(note.id, note);

    return true;
}

/**
 *
 * @param {string} projectId
 * @returns {boolean} true if operation was successful
 */
function deleteProject(projectId) {
    const existed = projects.delete(projectId);

    if (existed && projectId === selectedProjectId) {
        selectedProjectId = null;
    }

    return existed;
}

/**
 * Deletes task from currently selected project
 * @param {string} taskId
 * @returns {boolean} true if operation was successful
 */
function deleteTask(taskId) {
    if (!projects.has(selectedProjectId)) {
        return false;
    }

    return projects.get(selectedProjectId).tasks.delete(taskId);
}

/**
 * Deletes note from currently selected project
 * @param {string} noteId
 * @returns {boolean} true if operation was successful
 */
function deleteNote(noteId) {
    if (!projects.has(selectedProjectId)) {
        return false;
    }

    return projects.get(selectedProjectId).notes.delete(noteId);
}

/**
 *
 * @param {string} projectId
 * @returns {boolean} true if operation was successful
 */
function selectProject(projectId) {
    if (!projects.has(projectId)) {
        return false;
    }

    selectedProjectId = projectId;

    return true;
}
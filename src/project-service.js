import {createProject} from "./model/project.js";
import * as storage from "./storage-service.js";

/**
 * @module projectService responsible for managing projects and their corresponding contents
 */

/**
 * @typedef module:projectService.ProjectSummary
 * @type {Object}
 * @property {string} title
 * @property {number} tasks
 * @property {number} notes
 * @property {string} id
 */

/**
 * @typedef module:projectService.TaskDetails
 * @type {Object}
 * @property {string} title
 * @property {string} description
 * @property {Date} dueDate
 * @property {Priority} priority
 * @property {boolean} trackable
 */

/**
 * @typedef module:projectService.TaskSummary
 * @type {Object}
 * @property {string} title
 * @property {Date} dueDate
 * @property {Status} status
 * @property {Priority} priority
 * @property {string} id needed for binding summary with its UI representation
 */

/**
 *
 * @type {Map<string, module:project.Project>}
 */
const projects = new Map();

/**
 * certain operations are based on which project is currently selected
 * @type {string|null}
 */
let selectedProjectId = null;

const SAVE_ERROR_MESSAGE = "Failed to save task. In-memory state has been reverted";

/**
 *
 * @param {module:project.Project} project
 * @returns {boolean} true if operation was successful
 */
function addProject(project) {
    if (!project) return false;
    if (!storage.saveProject(project)) return false;

    projects.set(project.id, project);

    return true;
}

/**
 *
 * @param {module:task.Task} task
 * @param {string} projectId provided argument or currently selected project as default
 * @returns {boolean} true if operation was successful
 */
function addTask(task, projectId = selectedProjectId) {
    if (!projects.has(projectId) || !task) return false;

    const project = projects.get(projectId);
    project.tasks.set(task.id, task);

    if (!storage.saveProject(project)) {
        project.tasks.delete(task.id);
        console.error(SAVE_ERROR_MESSAGE);
        return false;
    }

    return true;
}

/**
 *
 * @param {module:note.Note} note
 * @param {string} projectId provided argument or currently selected project as default
 * @returns {boolean} true if operation was successful
 */
function addNote(note, projectId = selectedProjectId) {
    if (!projects.has(projectId) || !note) return false;

    const project = projects.get(projectId);
    project.notes.set(note.id, note);

    if (!storage.saveProject(project)) {
        project.notes.delete(note.id);
        console.error(SAVE_ERROR_MESSAGE);
        return false;
    }

    return true;
}

/**
 *
 * @param {string} projectId
 * @returns {boolean} true if operation was successful
 */
function deleteProject(projectId) {
    if (!storage.removeProject(projectId)) return false;
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
    if (!projects.has(selectedProjectId)) return false;

    const project = projects.get(selectedProjectId);
    const task = project.tasks.get(taskId);

    if (!task) return false;

    project.tasks.delete(taskId);

    if (!storage.saveProject(project)) {
        project.tasks.set(taskId, task);
        console.error(SAVE_ERROR_MESSAGE);
        return false;
    }

    return true;
}

/**
 * Deletes note from currently selected project
 * @param {string} noteId
 * @returns {boolean} true if operation was successful
 */
function deleteNote(noteId) {
    if (!projects.has(selectedProjectId)) return false;

    const project = projects.get(selectedProjectId);
    const note = project.notes.get(noteId);

    if (!note) return false;

    project.notes.delete(noteId);

    if (!storage.saveProject(project)) {
        project.notes.set(noteId, note);
        console.error(SAVE_ERROR_MESSAGE);
        return false;
    }

    return true;
}

/**
 * Edits task status in currently selected project
 * @param taskId
 * @param {Status} updatedStatus
 * @returns {boolean} true if operation was successful
 */
function editTaskStatus(taskId, updatedStatus) {
    if (!projects.has(selectedProjectId) || !updatedStatus) return false;

    const project = projects.get(selectedProjectId);
    const task = project.tasks.get(taskId);
    const oldStatus = task.status;

    if (!task) return false;

    task.status = updatedStatus;

    if (!storage.saveProject(project)) {
        task.status = oldStatus;
        console.error(SAVE_ERROR_MESSAGE);
        return false;
    }

    return true;
}

/**
 * Edits task details in currently selected project
 * @param {string} taskId
 * @param {module:projectService.TaskDetails} details
 * @returns {boolean} true if operation was successful
 */
function editTaskDetails(taskId, details) {
    if (!projects.has(selectedProjectId) || !details) return false;

    const project = projects.get(selectedProjectId);
    const oldTask = structuredClone(project.tasks.get(taskId));
    const task = project.tasks.get(taskId);

    if (!task) return false;

    task.title = details.title;
    task.description = details.description;
    task.dueDate = details.dueDate;
    task.priority = details.priority;
    task.trackable = details.trackable;

    if (!storage.saveProject(project)) {
        task.title = oldTask.title;
        task.description = oldTask.description;
        task.dueDate = oldTask.dueDate;
        task.priority = oldTask.priority;
        task.trackable = oldTask.trackable;
        console.error(SAVE_ERROR_MESSAGE);
        return false;
    }

    return true;
}

/**
 * Edits note in currently selected project
 * @param noteId
 * @param title
 * @param content
 * @returns {boolean} true if operation was successful
 */
function editNote(noteId, title, content) {
    if (!projects.has(selectedProjectId) || !title || !content) return false;

    const project = projects.get(selectedProjectId);
    const oldNote = structuredClone(project.notes.get(noteId));
    const note = projects.get(selectedProjectId).notes.get(noteId);

    if (!note) return false;

    note.title = title;
    note.content = content;

    if (!storage.saveProject(project)) {
        note.title = oldNote.title;
        note.description = oldNote.description;
        console.error(SAVE_ERROR_MESSAGE);
        return false;
    }

    return true;
}

/**
 *
 * @param {string} projectId provided argument or currently selected project by default
 * @returns {string|null} null if project doesn't exist
 */
function getProjectName(projectId = selectedProjectId) {
    if (!projects.has(projectId)) return null;

    return projects.get(projectId).title;
}

/**
 *
 * @param {string} taskId
 * @returns {string|null} null if no project is opened or task doesn't exist
 */
function getTaskName(taskId) {
    if (!projects.has(selectedProjectId)) return null;

    const task = projects.get(selectedProjectId).tasks.get(taskId);

    if (!task) return null;

    return task.title;
}

/**
 *
 * @param {string} noteId
 * @returns {string|null} null if no project is opened or note doesn't exist
 */
function getNoteName(noteId) {
    if (!projects.has(selectedProjectId)) return null;

    const note = projects.get(selectedProjectId).notes.get(noteId);

    if (!note) return null;

    return note.title;
}

/**
 *
 * @returns {string|null} id or nll if no project is currently selected
 */
function getSelectedProjectId() {
    return selectedProjectId;
}

/**
 * @returns {Array<module:projectService.ProjectSummary>}
 */
function getAllProjects() {
    return Array.from(projects,
        ([name, value]) => ({
            title: value.title,
            tasks: value.tasks.size,
            notes: value.notes.size,
            id: name
        })
    );
}

/**
 * @returns {Array<module:projectService.TaskSummary>|null}
 * tasks in currently selected project or null if no project is selected
 */
function getAllTasks() {
    if (!projects.has(selectedProjectId)) return null;

    return Array.from(projects.get(selectedProjectId).tasks,
        ([name, value]) => ({
            title: value.title,
            dueDate: value.dueDate,
            status: value.status,
            priority: value.priority,
            id: name
        })
    );
}

/**
 * @returns {Array<module:note.Note>|null} notes in currently selected project or null if no project is selected
 */
function getAllNotes() {
    if (!projects.has(selectedProjectId)) return null;

    return Array.from(projects.get(selectedProjectId).notes.values());
}

/**
 *
 * @param taskId
 * @returns {module:projectService.TaskDetails|null}
 * task details if task in currently selected project exists null otherwise
 */
function getTaskDetails(taskId) {
    if (!projects.has(selectedProjectId)) return null;

    const task = projects.get(selectedProjectId).tasks.get(taskId);

    if (!task) return null;

    return {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        trackable: task.trackable
    };
}

/**
 *
 * @param noteId
 * @returns {module:note.Note|null} note if it exists in currently selected project null otherwise
 */
function getNote(noteId) {
    if (!projects.has(selectedProjectId)) return null;

    const note = projects.get(selectedProjectId).notes.get(noteId);

    if (!note) return null;

    return note;
}

/**
 *
 * @param {string} projectId
 * @returns {boolean} true if operation was successful
 */
function selectProject(projectId) {
    if (!projects.has(projectId)) return false;

    selectedProjectId = projectId;

    return true;
}

/**
 * Deselects currently selected project
 */
function leaveProject() {
    selectedProjectId = null;
}

/**
 * @param {Array<module:project.Project>} projects
 */
function loadProjects(projects) {
    if (!projects) return;

    for (const project of projects) {
        addProject(project);
    }
}

function initializeDefaultProject() {
    if (projects.size !== 0) return;

    const defaultProject = createProject("Default");
    projects.set(defaultProject.id, defaultProject);
}

export {
    addProject,
    addTask,
    addNote,
    deleteProject,
    deleteTask,
    deleteNote,
    editTaskStatus,
    editTaskDetails,
    editNote,
    getProjectName,
    getTaskName,
    getNoteName,
    getSelectedProjectId,
    getAllProjects,
    getAllTasks,
    getAllNotes,
    getTaskDetails,
    getNote,
    selectProject,
    leaveProject,
    loadProjects,
    initializeDefaultProject,
}
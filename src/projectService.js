import {createProject} from "./model/project.js";

/**
 * @module projectService responsible for managing projects and their corresponding contents
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

/**
 *
 * @param {module:project.Project} project
 * @returns {boolean} true if operation was successful
 */
function addProject(project) {
    if (!project) return false;
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
    if (!projects.has(projectId) || !note) return false;

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
    if (!projects.has(selectedProjectId)) return false;

    return projects.get(selectedProjectId).tasks.delete(taskId);
}

/**
 * Deletes note from currently selected project
 * @param {string} noteId
 * @returns {boolean} true if operation was successful
 */
function deleteNote(noteId) {
    if (!projects.has(selectedProjectId)) return false;

    return projects.get(selectedProjectId).notes.delete(noteId);
}

/**
 * Edits task status in currently selected project
 * @param taskId
 * @param {Status} updatedStatus
 * @returns {boolean} true if operation was successful
 */
function editTaskStatus(taskId, updatedStatus) {
    if (!projects.has(selectedProjectId) || !updatedStatus) return false;

    const task = projects.get(selectedProjectId).tasks.get(taskId);

    if (!task) return false;

    task.status = updatedStatus;

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

    const task = projects.get(selectedProjectId).tasks.get(taskId);

    if (!task) return false;

    task.title = details.title;
    task.description = details.description;
    task.dueDate = details.dueDate;
    task.priority = details.priority;
    task.trackable = details.trackable;

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

    const note = projects.get(selectedProjectId).notes.get(noteId);

    if (!note) return false;

    note.title = title;
    note.content = content;

    return true;
}

/**
 * @returns {Array<{title:string, id:string}>}
 */
function getAllProjects() {
    return Array.from(projects,
        (v, k) => ({ title: v.title, id: k })
    );
}

/**
 * @returns {Array<module:projectService.TaskSummary>|null}
 * tasks in currently selected project or null if no project is selected
 */
function getAllTasks() {
    if (!projects.has(selectedProjectId)) return null;

    return Array.from(projects.get(selectedProjectId).tasks,
        (v, k) => ({
            title: v.title,
            dueDate: v.dueDate,
            status: v.status,
            priority: v.priority,
            id: k
        })
    );
}

/**
 *
 * @param {SortBy} sortBy
 * @param {boolean} ascending determines order
 * @returns {Array<module:projectService.TaskSummary>|null} tasks in a sorted manner or null if no project is selected
 */
function getAllTasksSorted(sortBy, ascending) {
    if (!sortBy || !ascending) return null;

    const unsortedTasks = getAllTasks();
    if (!unsortedTasks) return null;

    const sortedTasks = unsortedTasks.sort(sortBy.comparator);

    return ascending ? sortedTasks : sortedTasks.reverse();
}

/**
 *
 * @returns {Array<module:projectService.TaskSummary>|null} overdue tasks or null if no project is selected
 */
function getOverdueTasks() {
    const allTasks = getAllTasks();
    if (!allTasks) return null;

    const currentTime= new Date().getTime();

    return allTasks.filter((task) => task.dueDate.getTime() < currentTime);
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
 * @param {string} projectId
 * @returns {boolean} true if operation was successful
 */
function selectProject(projectId) {
    if (!projects.has(projectId)) return false;

    selectedProjectId = projectId;

    return true;
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
    selectedProjectId = defaultProject.id;
}
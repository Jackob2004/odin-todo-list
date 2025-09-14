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
    if (!projects.has(projectId)) return false;

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
    if (!projects.has(projectId)) return false;

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
    if (!projects.has(selectedProjectId)) return false;

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
    if (!projects.has(selectedProjectId)) return false;

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
    if (!projects.has(selectedProjectId)) return false;

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
 * @returns {Array<{title:string, dueDate:Date, status:Status, priority:Priority, id:string}>|null}
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
 * @returns {Array<module:note.Note>|null} notes in currently selected project or null if no project is selected
 */
function getAllNotes() {
    if (!projects.has(selectedProjectId)) return null;

    return Array.from(projects.get(selectedProjectId).notes.values());
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
/**
 * @module storageService
 * @description provides data persistence through localStorage
 */

const STORAGE_NAME = "localStorage";

function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return (
            e instanceof DOMException &&
            e.name === "QuotaExceededError" &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage &&
            storage.length !== 0
        );
    }
}

/**
 * Convert Project with Maps to storage-friendly object
 * @param {module:project.Project} project
 * @returns {Object}
 */
function projectToStorageFormat(project) {
    return {
        title: project.title,
        tasks: Array.from(project.tasks.entries()),
        notes: Array.from(project.notes.entries()),
        id: project.id
    };
}

/**
 *
 * @param {Object} project in storage format
 * @returns {module:project.Project}
 */
function projectFromStorageFormat(project) {
    const modifiedTasks = project.tasks.map(([id, task]) => {
        return [id, { ...task, dueDate: new Date(task.dueDate) }];
    });

    return {
        title: project.title,
        tasks: new Map(modifiedTasks),
        notes: new Map(project.notes),
        id: project.id,
    }
}

/**
 *
 * @param {module:project.Project} project
 * @returns {boolean}
 */
function saveProject(project) {
    if (!storageAvailable(STORAGE_NAME)) return false;

    localStorage.setItem(project.id, JSON.stringify(projectToStorageFormat(project)));
    retrieveAllProjects()
    return true;
}

/**
 *
 * @param {string} projectId
 */
function removeProject(projectId) {
    if (!storageAvailable(STORAGE_NAME)) return false;

    localStorage.removeItem(projectId);

    return true;
}

/**
 *
 * @returns {Array<module:project.Project>|null}
 */
function retrieveAllProjects() {
    if (!storageAvailable(STORAGE_NAME)) return null;
    if (localStorage.length === 0) return null;

    const allItems= {...localStorage};

    return Object.values(allItems).map((item) => projectFromStorageFormat(JSON.parse(item)));
}

export {saveProject, removeProject, retrieveAllProjects}
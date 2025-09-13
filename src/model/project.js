/**
 * @module project
 */

/**
 * @typedef module:project.Project
 * @type {Object}
 * @property {string} title
 * @property {Map<string, module:task.Task>} tasks task id as a key and task obj as a value
 * @property {Map<string, module:note.Note>} notes note id as a key and note obj as a value
 * @property {string} id A string containing a randomly generated, 36 character long v4 UUID
 */

/**
 * @param {string} title
 * @returns {module:project.Project}
 */
function createProject(title) {
    const id = crypto.randomUUID();
    const tasks = new Map();
    const notes = new Map();

    return {title, tasks, notes, id};
}

export {createProject};
import {Priority} from "../enums/priority.js"
import {Status} from "../enums/status.js"

/**
 * @typedef {Object} Task
 * @property {string} title
 * @property {string} description
 * @property {Date} dueDate
 * @property {Priority} priority
 * @property {Status} status
 * @property {boolean} trackable If true task will be used for analytics available in form of charts
 * @property {string} id A string containing a randomly generated, 36 character long v4 UUID
 */

/**
 * @param {string} title
 * @param {string} description
 * @param {Date} dueDate
 * @param {Priority} priority
 * @param {Status} status
 * @param {boolean} trackable
 * @returns {Task}
 */
function createTask(title, description, dueDate, priority, status, trackable) {
    const id = crypto.randomUUID();

    return {title, description, dueDate, priority, status, trackable, id};
}

export {createTask};

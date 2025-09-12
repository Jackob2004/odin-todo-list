/**
 * @module note
 */

/**
 * @typedef module:note.Note
 * @type {Object}
 * @property {string} title
 * @property {string} content
 * @property {string} id A string containing a randomly generated, 36 character long v4 UUID
 */

/**
 *
 * @param {string} title
 * @param {string} content
 * @returns {module:note.Note}
 */
function createNote(title, content) {
    const id = crypto.randomUUID();

    return {title, content, id};
}

export {createNote};
import {Enum} from "./enum.js";

/**
 * @module priority
 */

class Priority extends Enum {
    static LOW = new Priority("Low", 1);
    static MEDIUM = new Priority("Medium", 2);
    static HIGH = new Priority("High", 3);
    static URGENT = new Priority("Urgent", 4);

    /**
     *
     * @param {string} name
     * @param {number} priorityLevel makes priority sortable
     */
    constructor(name, priorityLevel) {
        super(name);
        this.priorityLevel = priorityLevel;
    }
}

export {Priority};
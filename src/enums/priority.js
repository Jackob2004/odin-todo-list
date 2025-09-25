import {Enum} from "./enum.js";

/**
 * @module priority
 */

class Priority extends Enum {
    static LOW = new Priority("Low", 1, "low");
    static MEDIUM = new Priority("Medium", 2, "medium");
    static HIGH = new Priority("High", 3, "high");
    static URGENT = new Priority("Urgent", 4, "urgent");

    /**
     *
     * @param {string} name
     * @param {number} priorityLevel makes priority sortable
     * @param {string} style css style
     */
    constructor(name, priorityLevel, style) {
        super(name);
        this.priorityLevel = priorityLevel;
        this.style = style;
    }
}

export {Priority};
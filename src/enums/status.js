import {Enum} from "./enum.js";

/**
 * @module status
 */

class Status extends Enum {
    static NOT_STARTED = new Status("Not Started", 1, "not-started");
    static IN_PROGRESS= new Status("In Progress", 2, "in-progress");
    static DONE= new Status("Done", 3, "done");

    /**
     *
     * @param {string} name
     * @param {number} statusLevel makes status sortable
     * @param {string} style css style
     */
    constructor(name, statusLevel, style) {
        super(name);
        this.statusLevel = statusLevel;
        this.style = style;
    }
}

export {Status};

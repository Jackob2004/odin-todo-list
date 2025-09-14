import {Enum} from "./enum.js";

/**
 * @module status
 */

class Status extends Enum {
    static NOT_STARTED = new Status("Not Started", 1);
    static IN_PROGRESS= new Status("In Progress", 2);
    static DONE= new Status("Done", 3);

    /**
     *
     * @param {string} name
     * @param {number} statusLevel makes status sortable
     */
    constructor(name, statusLevel) {
        super(name);
        this.statusLevel = statusLevel;
    }
}

export {Status};

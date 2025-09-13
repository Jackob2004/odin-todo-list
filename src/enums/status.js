import {Enum} from "./enum.js";

/**
 * @module status
 */

class Status extends Enum {
    static NOT_STARTED = new Status("Not Started");
    static IN_PROGRESS= new Status("In Progress");
    static DONE= new Status("Done");
}

export {Status};

import {Enum} from "./enum";

/**
 * @module eventType defining events used by publishers and subscribers
 */

class EventType extends Enum {
    static PROJECT_CREATED = new EventType("Project Create");
    static TASK_CREATED = new EventType("Task Create");
    static NOTE_CREATED = new EventType("Note Create");
    static PROJECT_DELETE_REQUESTED = new EventType("Project Delete REQUEST");
    static PROJECT_DELETED= new EventType("Project Delete");
}

export {EventType};
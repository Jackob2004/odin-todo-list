import {Enum} from "./enum";

/**
 * @module eventType defining events used by publishers and subscribers
 */

class EventType extends Enum {
    static PROJECT_CREATED = new EventType("Project Create");
    static TASK_CREATED = new EventType("Task Create");
    static NOTE_CREATED = new EventType("Note Create");
    static PROJECT_DELETE_REQUESTED = new EventType("Project Delete Request");
    static PROJECT_DELETED= new EventType("Project Delete");
    static TASK_DELETE_REQUESTED = new EventType("Task Delete Request");
    static TASK_DELETED = new EventType("Task Delete");
    static NOTE_DELETE_REQUESTED = new EventType("Note Delete Request");
    static NOTE_DELETED = new EventType("Note Delete");
    static NOTE_EDIT_REQUESTED = new EventType("Note Edit Request");
    static NOTE_EDITED = new EventType("Note Edit");
}

export {EventType};
import {Enum} from "./enum";

/**
 * @module displayState
 */

class DisplayState extends Enum {
    static VIEW_PROJECTS  = new DisplayState("View Projects");
    static VIEW_Tasks = new DisplayState("View Tasks");
    static VIEW_Notes= new DisplayState("View Notes");
}

export { DisplayState };
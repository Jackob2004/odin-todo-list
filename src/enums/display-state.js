import {Enum} from "./enum";

/**
 * @module displayState
 */

class DisplayState extends Enum {
    static VIEW_PROJECTS  = new DisplayState("View Projects", "projects");
    static VIEW_Tasks = new DisplayState("View Tasks", "tasks");
    static VIEW_Notes= new DisplayState("View Notes", "notes");

    /**
     *
     * @param {string} name
     * @param {string} style css style
     */
    constructor(name, style) {
        super(name);
        this.style = style;
    }
}

export { DisplayState };
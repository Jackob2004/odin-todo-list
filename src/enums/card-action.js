import {Enum} from "./enum";

/**
 * @module cardAction
 * @description represents possible UI actions while interacting with various cards
 */

class CardAction extends Enum {
    static OPEN_PROJECT = new CardAction("Open Project");
    static OPEN_TASK = new CardAction("Open Task");
    static DELETE_PROJECT = new CardAction("Delete Project");
    static DELETE_TASK = new CardAction("Delete Task");
    static DELETE_NOTE = new CardAction("Delete Note");
    static CHANGE_TASK_STATUS = new CardAction("Change Task Status");
    static EDIT_NOTE = new CardAction("Edit Note");
    static EDIT_TASK = new CardAction("Edit Task");
}

export {CardAction};
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
    static DELETE_NOTES = new CardAction("Delete Note");
}

export {CardAction};
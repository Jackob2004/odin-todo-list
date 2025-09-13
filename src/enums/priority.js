import {Enum} from "./enum.js";

/**
 * @module priority
 */

class Priority extends Enum {
    static LOW = new Priority("Low");
    static MEDIUM = new Priority("Medium");
    static HIGH = new Priority("High");
    static URGENT = new Priority("Urgent");
}

export {Priority};
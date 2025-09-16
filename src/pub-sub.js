/**
 * @module pubSub
 * @description Centralized event system for component communication using the pub/sub pattern.
 */

class PubSub {

    constructor() {
        /**
         *
         * @type {Map<EventType, Array<Function>>}
         */
        this.events = new Map();
    }

    /**
     *
     * @param {EventType} event
     * @param {Function} callback
     */
    subscribe(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event).push(callback);
    }

    /**
     *
     * @param {EventType} event
     * @param {Function} callback
     */
    unsubscribe(event, callback) {
        if (!this.events.has(event)) return;
        this.events.set(event, this.events.get(event).filter(fn => fn !== callback));
    }

    /**
     *
     * @param {EventType} event
     * @param {Object} data
     */
    publish(event, data) {
        if (!this.events.has(event)) return;
        this.events.get(event).forEach(callback => callback(data));
    }
}

const pubSub = new PubSub();

export { pubSub };
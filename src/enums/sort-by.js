import {Enum} from './enum.js';

/**
 * @module sortBy provides different types of TaskSummary sorting
 */

class SortBy extends Enum {
    static PRIORITY = new SortBy("priority",
        /**
         * @param {module:projectService.TaskSummary} a
         * @param {module:projectService.TaskSummary} b
         */
        (a, b) => a.priority.priorityLevel - b.priority.priorityLevel
    );

    static DUE_DATE= new SortBy("date",
        /**
         * @param {module:projectService.TaskSummary} a
         * @param {module:projectService.TaskSummary} b
         */
        (a, b) => a.dueDate - b.dueDate
    );

    static STATUS= new SortBy("status",
        /**
         * @param {module:projectService.TaskSummary} a
         * @param {module:projectService.TaskSummary} b
         */
        (a, b) => a.status.statusLevel - b.status.statusLevel
    );

    /**
     *
     * @param {string} name
     * @param {Function} comparator
     */
    constructor(name, comparator) {
        super(name);
        this.comparator = comparator;
    }
}

export {SortBy};
import { Enum } from "./enum";
import {Status} from "./status";

/**
 * @module filterBy provides different types of TaskSummary filtering
 */

class FilterBy extends Enum {
    static FINISHED = new FilterBy("Finished",
        /**
         * @param {module:projectService.TaskSummary} task
         */
        (task) => task.status === Status.DONE
    );

    static UNFINISHED = new FilterBy("Unfinished",
        /**
         * @param {module:projectService.TaskSummary} task
         */
        (task) => task.status !== Status.DONE
    );

    static OVERDUE = new FilterBy("Overdue",
        /**
         * @param {module:projectService.TaskSummary} task
         */
        (task) => {
            const currentDate= new Date();
            currentDate.setHours(0,0,0);

            const currentTime = currentDate.getTime();

            return task.status !== Status.DONE && task.dueDate.getTime() < currentTime;
        }
    );

    constructor(name, predicate) {
        super(name);
        this.predicate = predicate;
    }
}

export { FilterBy };
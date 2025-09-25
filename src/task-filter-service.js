/**
 * @module taskFilterService
 * @description provides functionality for sorting and filtering tasks
 */

/**
 * @param {Array<module:projectService.TaskSummary>} allTasks
 * @param {SortBy} sortBy
 * @param {boolean} ascending determines order
 * @returns {Array<module:projectService.TaskSummary>|null} tasks in a sorted manner or null if provided arguments are not valid
 */
function sortedTasks(allTasks, sortBy, ascending) {
    if (!sortBy) return null;
    if (!allTasks) return null;

    const sortedTasks =  [...allTasks].sort(sortBy.comparator);

    return ascending ? sortedTasks : sortedTasks.reverse();
}

/**
 * @param {Array<module:projectService.TaskSummary>} allTasks the array to filter
 * @returns {Array<module:projectService.TaskSummary>|null} overdue tasks or null if provided argument is not valid
 */
function filteredOverdueTasks(allTasks) {
    if (!allTasks) return null;

    const currentDate= new Date();
    currentDate.setHours(0,0,0);

    const currentTime = currentDate.getTime();

    return allTasks.filter((task) => task.dueDate.getTime() < currentTime);
}

export {sortedTasks, filteredOverdueTasks};

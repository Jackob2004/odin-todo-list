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
 * @param {FilterBy} filterBy
 * @returns {Array<module:projectService.TaskSummary>|null} filtered tasks or null if provided arguments are not valid
 */
function filteredTasks(allTasks, filterBy) {
    if (!allTasks) return null;
    if (!filterBy) return null;

    return [...allTasks].filter(filterBy.predicate);
}

export {sortedTasks, filteredTasks};

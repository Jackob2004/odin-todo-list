/**
 * @module pager
 * @description Provides functionality to access array elements as pages
 */

let pageSize = 3;

let currPage = 1;

/**
 *
 * @param {Array} allElements - The complete array of elements to paginate
 * @returns {Array} An array containing the elements for the current page
 */
function getCurrentPage(allElements) {
    const pageElements = [];

    const firstIndex = (currPage - 1) * pageSize;
    const possibleLastIndex = firstIndex + pageSize;
    const lastIndex = (possibleLastIndex > allElements.length) ? allElements.length : possibleLastIndex;

    for (let i = firstIndex; i < lastIndex; i++) {
        pageElements.push(allElements[i]);
    }

    return pageElements;
}

/**
 *
 * @returns {boolean} True if successfully moved to previous page, false if already at first page
 */
function prevPage() {
    const canGo = currPage - 1 > 0;

    if (canGo) {
        currPage--;
    }

    return canGo;
}

/**
 *
 * @param {Array} allElements - The complete array of elements to paginate
 * @returns {boolean} True if successfully moved to next page, false if already at last page
 */
function nextPage(allElements) {
    const firstIndex = (currPage) * pageSize;
    const canGo = firstIndex < allElements.length;

    if (canGo) {
        currPage++;
    }

    return canGo;
}

/**
 *
 * @param {Array} allElements - The complete array of elements to paginate
 * @returns {boolean} True if current page is valid, false otherwise
 */
function isCurrentPageValid(allElements) {
    const firstIndex = (currPage - 1) * pageSize;

    return firstIndex < allElements.length;
}

/**
 *
 * @returns {number}
 */
function getCurrPageNumber() {
    return currPage;
}

function resetPageNumber() {
    currPage = 1;
}

/**
 * Sets page size, size must be in range (1-15) otherwise it is set to the closet boundary
 * @param {number} size
 */
function setPageSize(size) {
    const max = 15;
    const min = 1;

    if (size > max) {
        size = max;
    } else if (size < min) {
        size = min;
    }

    pageSize = size;
}

export {getCurrentPage, nextPage, prevPage, isCurrentPageValid, getCurrPageNumber,resetPageNumber, setPageSize};

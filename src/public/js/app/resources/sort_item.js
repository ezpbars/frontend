/**
 * the ability to sort by the given key; a sort can consist of multiple sort
 * items in a particular order - such as when sorting first by name and then by
 * age
 * @template {string} K the name of the key
 * @typedef {{key: K, dir: "asc" | "asc_eq" | "desc" | "desc_eq", before: any, after: any}} SortItem
 */

/**
 * describes a sort option with a name
 * @template T the sort item type; typically a restriction on SortItem
 * @typedef {{name: string, val: T}} SortOption
 */

/**
 * determines if there are additional items in the listing after the current
 * value which could be retrieved using the given sort returned by the api
 * @param {?Array.<SortItem.<string>>} sort the sort returned by the backend
 * @returns {boolean} if the sort could be used to get the next page
 */
export function sortHasAfter(sort) {
    if (sort === undefined || sort === null) {
        return false;
    }
    for (let item of sort) {
        if (item.after !== undefined && item.after !== null) {
            return true;
        }
    }
    return false;
}

/**
 * determines if there are additional items in the listing before the current
 * value which could be retrieved using the information contained in the
 * given sort returned by the api
 * @param {?Array.<SortItem.<string>>} sort the sort returned by the backend
 * @returns {boolean} if the sort could be used to get the previous page
 */
export function sortHasBefore(sort) {
    if (sort === undefined || sort === null) {
        return false;
    }
    for (let item of sort) {
        if (item.before !== undefined && item.before !== null) {
            return true;
        }
    }
    return false;
}

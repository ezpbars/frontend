/**
 * converts the given search term to the appropriate filter
 * @param {string} term the term the user input
 * @returns {import("/js/app/resources/filter_text_item.js").FilterTextItem} the filter to use
 */
export function termToFilter(term) {
    if (term === "" || term === null || term === undefined) {
        return null;
    }
    return {
        operator: "ilike",
        value: `%${term.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")}%`,
    };
}
/**
 * given a filter produced as if by termToFilter, returns the term that would
 * produce that filter
 * @param {import("/js/app/resources/filter_text_item.js").FilterTextItem}
 * filter the filter to recover from
 * @returns {string} the original term used to create the filter
 */
export function filterToTerm(filter) {
    if (filter === null) {
        return "";
    }
    const result = filter.value.substring(1, filter.value.length - 1);
    if (!result.includes("\\")) {
        return result;
    }
    let escaped = false;
    let term = "";
    for (let i = 0; i < result.length; ++i) {
        if (escaped) {
            term += result[i];
            escaped = false;
        } else if (result[i] === "\\") {
            escaped = true;
        } else {
            term += result[i];
        }
    }
    return term;
}

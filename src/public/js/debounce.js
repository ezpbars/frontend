/**
 * Creates a new function which calls the given function after the given number
 * of milliseconds; combining multiple calls to the returned function within the
 * given number of milliseconds such that it will only call the given function
 * once
 * @param {function() : any} fn The function to debounce
 * @param {number} ms The number of milliseconds to debounce; null to not debounce
 *   (returns the function immediately)
 * @returns {function() : any} The debounced function
 */
export function debounce(fn, ms) {
    if (ms === null) {
        return fn;
    }
    let timeoutId = null;
    return function () {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            timeoutId = null;
            fn();
        }, ms);
    };
}

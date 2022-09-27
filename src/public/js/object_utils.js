/**
 * Shallow compares the properties of the two objects.
 * @param {object} a
 * @param {object} b
 * @returns {boolean} true if the objects have the same properties and the values of those properties are the same
 *   (both are compared using ===)
 */
export function shallowCompare(a, b) {
    if (a === null || a === undefined || b === null || b === undefined) {
        return a === b;
    }

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) {
        return false;
    }

    for (const key of keysA) {
        if (a[key] !== b[key]) {
            return false;
        }
    }
    return true;
}

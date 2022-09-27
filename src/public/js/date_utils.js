/**
 * Converts the value of a datetime-local input, which is represented as the number
 * of milliseconds since the unix epoch in GMT, to a Date object which is the users
 * intent.
 *
 * So, for example, if the user puts in midnight january 1st 1970, the datetime-local
 * input always gives zero, but this will give the users timezone offset.
 *
 * @param {number} valueAsNumber The valueAsNumber for the datetime-local input
 */
export function fromDateTimeLocalInputToDate(valueAsNumber) {
    const stdDate = new Date();
    const offset = stdDate.getTimezoneOffset() * 60 * 1000;
    return new Date(valueAsNumber + offset);
}

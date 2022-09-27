/**
 * Describes a filter which is applied to a particular field. The field
 * the filter is applied to is from context.
 *
 * @template T The value type
 * @typedef {{operator: import("/js/app/resources/standard_operator.js").StandardOperator, value: T}} FilterItem
 */

// We need to export something for visual code to consider this a module :/
export function foo() {} // @@type-hint

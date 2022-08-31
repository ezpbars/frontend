/**
 * Describes an operator which can apply to a text field.
 * Options:
 * - `eq`: Case sensitive equals
 * - `neq`: Case sensitive not equals
 * - `ieq`: Case insensitive equals
 * - `ineq`: Case insensitive not equals
 * - `gt`: Greater than
 * - `gte`: Greater than or equal
 * - `lt`: Less than
 * - `lte`: Less than or equal
 * - `ilike`: Case insensitive like (supports % and _, but not groups)
 * @typedef {'eq'|'neq'|'ieq'|'ineq'|'gt'|'gte'|'lt'|'lte'|'ilike'} StandardTextOperator
 */

// We need to export something for visual code to consider this a module :/
export function foo() {} // @@type-hint

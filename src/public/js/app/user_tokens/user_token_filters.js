/**
 * the filters that can be used on user tokens
 * @typedef {{userSub: ?import("/js/app/resources/filter_text_item.js").FilterTextItem, name: ?import("/js/app/resources/filter_text_item.js").FilterTextItem, createdAt: ?import("/js/app/resources/filter_item.js").FilterItem.<Date>, expiresAt: ?import("/js/app/resources/filter_item.js").FilterItem.<?Date>}} UserTokenFilters
 */

/**
 * creates a new set of user filters which has no filters except wehre specified
 * @param {object} kwargs the initial filters
 * @param {?import("/js/app/resources/filter_text_item.js").FilterTextItem} [kwargs.userSub]
 *   the subject of the user the token is for
 * @param {?import("/js/app/resources/filter_text_item.js").FilterTextItem} [kwargs.name]
 *   the human-readable name for the token
 * @param {?import("/js/app/resources/filter_item.js").FilterItem.<Date>} [kwargs.createdAt]
 *   when the token was created
 * @param {?import("/js/app/resources/filter_item.js").FilterItem.<Date>} [kwargs.expiresAt]
 *   when the token expires, if applicable
 * @returns {UserTokenFilters}
 */
export function newUserTokenFilters({
    userSub = undefined,
    name = undefined,
    createdAt = undefined,
    expiresAt = undefined,
}) {
    return {
        userSub: userSub === undefined ? null : userSub,
        name: name === undefined ? null : name,
        createdAt: createdAt === undefined ? null : createdAt,
        expiresAt: expiresAt === undefined ? null : expiresAt,
    };
}
/**
 * converts the given user token filters to the format expected by the api
 * @param {UserTokenFilters} filters the filters to convert
 * @returns {any} the api representation
 */
export function userTokenFiltersToApi(filters) {
    return {
        user_sub: filters.userSub,
        name: filters.name,
        created_at:
            filters.createdAt === null
                ? null
                : {
                      operator: filters.createdAt.operator,
                      value: filters.createdAt.value.getTime() / 1000,
                  },
        expires_at:
            filters.expiresAt === null
                ? null
                : {
                      operator: filters.expiresAt.operator,
                      value: filters.expiresAt.value === null ? null : filters.expiresAt.value.getTime() / 1000,
                  },
    };
}

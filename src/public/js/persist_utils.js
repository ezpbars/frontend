/**
 * @typedef {{store: function(string, Object.<string, string>): any, retrieve: function(string, Object.<string, string>=): Object.<string, string>}} Persister
 */

/**
 * @type {{query: Persister, notPersisted: Persister}}
 */
export const PERSISTERS = {
    query: {
        store: (prefix, data) => {
            const query = new URLSearchParams();
            for (const key in data) {
                if (data[key] !== null) {
                    query.set(key, data[key]);
                }
            }
            const fullQuery = new URLSearchParams(window.location.search);
            fullQuery.set(prefix, btoa(query.toString()));
            history.replaceState(null, null, "?" + fullQuery.toString());
        },
        retrieve: (prefix, defaults) => {
            const fullQuery = new URLSearchParams(window.location.search);
            const query = new URLSearchParams(atob(fullQuery.get(prefix)));
            /** @type {Object.<string, string>} */
            const data = Object.assign({}, defaults);
            for (const key of query.keys()) {
                data[key] = query.get(key);
            }
            return data;
        },
    },
    notPersisted: {
        store: () => {},
        retrieve: (prefix, defaults) => Object.assign({}, defaults),
    },
};

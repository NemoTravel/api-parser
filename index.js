let pool = {};

/**
 * Check if string looks like a reference to another object.
 *
 * @param {String} potentialRef
 * @returns {boolean}
 */
const isRef = function(potentialRef) {
	return potentialRef[0] === '$' || potentialRef.indexOf('$ref_') !== -1;
};

/**
 * Convert object reference to a valid API URI.
 *
 * @param {string} ref
 * @returns {string}
 */
const getURIByRef = function(ref) {
	return ref.replace('$ref_', '');
};

/**
 * Get object by API URI or return the URI itself if object doesn't exist.
 *
 * @param {string} uri
 * @returns {*}
 */
const getModelByURI = function(uri) {
	return pool.hasOwnProperty(uri) ? pool[uri] : uri;
};

/**
 * Loop through all properties in object and replace `$ref_xxx` links with objects from pool.
 *
 * @param {Object} object
 * @returns {*}
 */
const replaceRefsInObjects = function(object) {
	for (const paramName in object) {
		if (object.hasOwnProperty(paramName)) {
			const paramValue = object[paramName];

			if (typeof paramValue === 'string' && isRef(paramValue)) {
				object[paramName] = getModelByURI(getURIByRef(paramValue));
			}
			else if (typeof paramValue === 'object') {
				object[paramName] = replaceRefsInObjects(paramValue);
			}
		}
	}

	return object;
};

module.exports = function(response) {
	pool = response;

	// Loop through all objects in response.
	for (const uri in response) {
		if (response.hasOwnProperty(uri)) {
			const object = response[uri];

			pool[uri] = replaceRefsInObjects(object);
		}
	}

	return pool;
};
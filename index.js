/**
 * Check if string looks like a reference to another object.
 *
 * @param {String} potentialRef
 * @returns {boolean}
 */
var isRef = function(potentialRef) {
	return potentialRef[0] === '$' || potentialRef.indexOf('$ref_') !== -1;
};

/**
 * Convert object reference to a valid API URI.
 *
 * @param {string} ref
 * @returns {string}
 */
var getURIByRef = function(ref) {
	return ref.replace('$ref_', '');
};

/**
 * Get object by API URI or return the URI itself if object doesn't exist.
 *
 * @param {string} uri
 * @param {Object} pool
 * @returns {*}
 */
var getModelByURI = function(uri, pool) {
	return pool.hasOwnProperty(uri) ? pool[uri] : uri;
};

/**
 * Loop through all properties in object and replace `$ref_xxx` links with objects from pool.
 *
 * @param {Object} object
 * @param {Object} pool
 * @returns {*}
 */
var replaceRefsInObjects = function(object, pool) {
	for (var paramName in object) {
		if (object.hasOwnProperty(paramName)) {
			var paramValue = object[paramName];

			if (typeof paramValue === 'string' && isRef(paramValue)) {
				object[paramName] = getModelByURI(getURIByRef(paramValue), pool);
			}
			else if (typeof paramValue === 'object') {
				object[paramName] = replaceRefsInObjects(paramValue, pool);
			}
		}
	}

	return object;
};

var parse = function(response) {
	var pool = response;

	// Loop through all objects in response.
	for (var uri in response) {
		if (response.hasOwnProperty(uri)) {
			var object = response[uri];

			pool[uri] = replaceRefsInObjects(object, pool);
		}
	}

	return pool;
};

module.exports = parse;

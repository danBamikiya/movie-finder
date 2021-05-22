export function isFunction(func) {
	return typeof func === 'function';
}

export function isArray(arr) {
	return Array.isArray(arr);
}

export function objectOrFunction(item) {
	const type = typeof item;
	return item !== null && (type === 'object' || type === 'function');
}

export function arrayOrFunction(item) {
	const type = item.constructor;
	return type === Array || type === Function;
}

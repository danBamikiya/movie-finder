export function isFunction(func) {
	return typeof func === 'function';
}

export function objectOrFunction(item) {
	let type = typeof item;
	return item !== null && (type === 'object' || type === 'function');
}

export function isFunction(func: any) {
	return typeof func === 'function';
}

export function isArray(arr: any) {
	return Array.isArray(arr) && arr.length !== 0;
}

export function isObjectOrFunction(item: any) {
	const type = typeof item;
	return item !== null && (type === 'object' || type === 'function');
}

export function isArrayOrFunction(item: any) {
	const type = item.constructor;
	return type === Array || type === Function;
}

export function isEmptyObject(targetObject: any) {
	return (
		targetObject.constructor === Object &&
		Object.keys(targetObject).length === 0
	);
}

export * from './errorhandlers';
export * from './webScrapper';

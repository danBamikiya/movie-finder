export function isFunction(func: any) {
	return typeof func === 'function';
}

export function isArray(arr: any) {
	return Array.isArray(arr);
}

export function objectOrFunction(item: any) {
	const type = typeof item;
	return item !== null && (type === 'object' || type === 'function');
}

export function arrayOrFunction(item: any) {
	const type = item.constructor;
	return type === Array || type === Function;
}

export function checkEmptyObject(targetObject: any) {
	return (
		Object.keys(targetObject).length === 0 &&
		targetObject.constructor === Object
	);
}

export * from './errorhandlers';
export * from './webScrapper';

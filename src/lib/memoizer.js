export function defaultHash(...args) {
	// JSON.stringify ellides `undefined` and function values by default. We do not want that.
	return JSON.stringify(args, (key, value) =>
		typeof value === 'object' ? value : String(value)
	);
}

export default function memoize(fn, options = {}) {
	const { hash = defaultHash, cache = new Map() } = options;

	return (...args) => {
		const id = hash.apply(this, args);
		if (cache.has(id)) return cache.get(id);

		const result = fn.apply(this, args);
		cache.set(id, result);
		return result;
	};
}

//INFO: Inspired by https://www.npmjs.com/package/@github/memoize
// An alternative to this implementation - memoizee

import { MemoizableFunction } from '../types';

function hash(...args: unknown[]): string {
	// JSON.stringify ellides `undefined` and function values by default. We do not want that.
	return JSON.stringify(args, (_key, value) =>
		typeof value === 'object' ? value : String(value)
	);
}

export default function memoize<
	A extends unknown[],
	R extends unknown,
	T extends unknown
>(fn: MemoizableFunction<A, R, T>): MemoizableFunction<A, R, T> {
	const cache = new Map();

	return function (this: T, ...args: A) {
		const id = hash.apply(this, args);
		if (cache.has(id)) return cache.get(id);

		let result = fn.apply(this, args);
		if (result instanceof Promise) {
			result = result.catch(error => {
				cache.delete(id);
				throw error;
			}) as R;
		}
		cache.set(id, result);
		return result;
	};
}

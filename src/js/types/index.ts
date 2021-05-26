type Callback = (arg: any) => any;

type MemoizableFunction<
	A extends unknown[],
	R extends unknown,
	T extends unknown
> = (this: T, ...args: A) => R;

type RendererParams = {
	actor: string;
	imdbPage: string;
	imgUrl?: string;
};

type RendererFunction = (div: HTMLElement, {}: RendererParams) => HTMLElement;

type Actor = {
	actor: string;
	actor_id: string;
	character: string;
	actorImgURL: string;
};

type Movie = {
	title: string;
	year: string;
	length: string;
	rating: string;
	poster: string;
	plot: string;
	cast: Actor[];
};

type FetchParams = {
	url: string;
	options?: RequestInit;
	callback?: Callback | Callback[];
};

export {
	Callback,
	Actor,
	Movie,
	MemoizableFunction,
	RendererParams,
	RendererFunction,
	FetchParams
};

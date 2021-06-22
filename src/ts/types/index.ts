type Position = {
	containerTop: number;
	containerLeft: number;
	contentClassSuffix: string;
};

type Callback = (arg: any) => any;

type MemoizableFunction<
	A extends unknown[],
	R extends unknown,
	T extends unknown
> = (this: T, ...args: A) => R;

type HoverRendererParams = {
	actor: string;
	imdbPage: string;
	imgUrl?: string;
};

type RendererFunction<P> = (parent: HTMLElement, {}: P) => HTMLElement;

type Actor = {
	actor: string;
	actor_id: string;
	character: string;
	actorImgURL: string | undefined;
};

type Trailer = {
	id: string;
	link: string;
};

type Movie = {
	title: string;
	year: string;
	length: string;
	rating: string;
	poster: string;
	plot: string;
	cast: Actor[];
	trailer: Trailer;
};

type FetchParams = {
	url: RequestInfo;
	callback: Callback | Callback[];
	options?: RequestInit;
};

type ScrapedVideoData = {
	definition: string;
	mimeType: string;
	url: string;
};

export {
	Position,
	Callback,
	Actor,
	Movie,
	MemoizableFunction,
	HoverRendererParams,
	RendererFunction,
	FetchParams,
	ScrapedVideoData
};

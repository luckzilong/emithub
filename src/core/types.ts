type EmithubListenerFunction<Args extends unknown[] = any[]> = (...args: Args) => void;

type EmithubEventName = string;

type EmithubEventMap = Record<EmithubEventName, EmithubListenerFunction>;

export type { EmithubListenerFunction, EmithubEventName, EmithubEventMap };

import type { EmithubEventMap, EmithubEventName, EmithubListenerFunction } from "./types";

class Emithub<T extends EmithubEventMap> {
  private readonly _listenerMap = new Map<Extract<keyof T, EmithubEventName>, Set<EmithubListenerFunction>>();

  public constructor(eventMap: T | null = null) {
    if (eventMap) {
      for (const key in eventMap) {
        this._listenerMap.set(key, new Set());
      }
    }
  }

  public on<E extends Extract<keyof T, EmithubEventName>>(eventName: E, listenerFunc: T[E] | null = null): this {
    if (!this._listenerMap.has(eventName)) {
      this._listenerMap.set(eventName, new Set());
    }
    this._listenerMap.get(eventName)?.add(listenerFunc as T[E]);
    return this;
  }

  public once<E extends Extract<keyof T, EmithubEventName>>(eventName: E, listenerFunc: T[E]): this {
    const wrapListenerFunc = ((...args: any[]) => {
      listenerFunc(...args);
      this.off(eventName, wrapListenerFunc);
    }) as T[E];
    this._listenerMap.get(eventName)?.add(wrapListenerFunc);
    return this;
  }

  public off<E extends Extract<keyof T, EmithubEventName>>(eventName: E, listenerFunc: T[E] | null = null): this {
    listenerFunc ? this._listenerMap.get(eventName)?.delete(listenerFunc) : this._listenerMap.delete(eventName);
    return this;
  }

  public emit<E extends Extract<keyof T, EmithubEventName>>(eventName: E, ...args: Parameters<T[E]>): this {
    this._listenerMap.get(eventName)?.forEach((listenerFunc) => listenerFunc(...args));
    return this;
  }

  public has<E extends Extract<keyof T, EmithubEventName>>(eventName: E, listenerFunc: T[E] | null = null): boolean {
    return listenerFunc
      ? this._listenerMap.has(eventName) && this._listenerMap.get(eventName)!.has(listenerFunc as T[E])
      : this._listenerMap.has(eventName);
  }

  public it() {
    type _EventName = Extract<keyof T, EmithubEventName>;
    type _ListenerFunc = T[_EventName];
    return this._listenerMap.entries() as unknown as [_EventName, _ListenerFunc];
  }
}

export { Emithub as default };

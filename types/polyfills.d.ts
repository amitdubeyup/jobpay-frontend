// Type declarations for polyfill modules
declare module 'intersection-observer' {
  // IntersectionObserver polyfill
  export {};
}

declare module '@juggle/resize-observer' {
  export class ResizeObserver {
    constructor(callback: ResizeObserverCallback);
    observe(target: Element): void;
    unobserve(target: Element): void;
    disconnect(): void;
  }
  export interface ResizeObserverEntry {
    readonly target: Element;
    readonly contentRect: DOMRectReadOnly;
    readonly borderBoxSize?: readonly ResizeObserverSize[];
    readonly contentBoxSize?: readonly ResizeObserverSize[];
    readonly devicePixelContentBoxSize?: readonly ResizeObserverSize[];
  }
  export interface ResizeObserverSize {
    readonly inlineSize: number;
    readonly blockSize: number;
  }
  export type ResizeObserverCallback = (
    entries: ResizeObserverEntry[],
    observer: ResizeObserver
  ) => void;
}

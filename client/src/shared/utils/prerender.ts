declare global {
  interface Window {
    __PRERENDER_INJECTED?: { isPrerendering?: boolean };
  }
}

/** True when vite-plugin-prerender is capturing this page (see vite.config inject). */
export const isPrerendering = (): boolean =>
  typeof window !== "undefined" &&
  Boolean(window.__PRERENDER_INJECTED?.isPrerendering);

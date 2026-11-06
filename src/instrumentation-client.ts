/** Next invokes this for push, replace and history traversal, before a new route commits. */
export function onRouterTransitionStart(url: string) {
  window.dispatchEvent(new CustomEvent("srm-route-start", {
    detail: new URL(url, window.location.href).pathname,
  }));
}

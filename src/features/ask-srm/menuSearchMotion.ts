export function bindMenuSearchMotion(
  dialog: HTMLDialogElement,
  launcher: HTMLButtonElement,
  menuButton: HTMLButtonElement,
  dockLauncher: () => void,
) {
  const face = menuButton.querySelector(".ask-menu-face");
  const crest = menuButton.querySelector(".site-crest");
  const label = menuButton.querySelector(".ask-menu-content");
  const dockCrest = launcher.querySelector(".site-crest");
  const dock = launcher.closest(".ask-dock");
  if (!face || !crest || !label || !dockCrest || !dock) return;

  const compact = window.matchMedia("(max-width: 760px)");
  const motion = window.matchMedia("(max-width: 760px) and (prefers-reduced-motion: no-preference)");
  const canAnimate = () => motion.matches && !document.documentElement.hasAttribute("data-quiet-motion");
  const duration = 620;
  const timing: KeyframeAnimationOptions = { duration, fill: "both" };

  const glide = "cubic-bezier(.4,0,.3,1)";
  const handoff = .1;

  // Measure with the bar at rest. The hidden launcher can move as the preview docks or the viewport resizes.
  const frames = (): Keyframe[] => {
    const source = dockCrest.getBoundingClientRect();
    const destination = crest.getBoundingClientRect();
    const dx = source.left + source.width / 2 - (destination.left + destination.width / 2);
    const dy = source.top + source.height / 2 - (destination.top + destination.height / 2);
    const diameter = face.getBoundingClientRect().height;
    const bubble = { width: `${diameter}px`, borderRadius: `${diameter / 2}px` };
    return [
      // Travel and width have separate keyframes so the bar opens as the crest eases into place.
      { ...bubble, transform: `translate(${dx}px, ${dy}px)`, opacity: 0, easing: glide },
      { opacity: 1, offset: handoff },
      { ...bubble, offset: .42, easing: glide },
      { transform: "translate(0px, 0px)", offset: .76 },
      { width: "100%", borderRadius: getComputedStyle(menuButton).borderRadius, transform: "none", opacity: 1 },
    ];
  };

  let morph: Animation | undefined;
  let reveal: Animation | undefined;
  let dockFade: Animation | undefined;
  let correction: Animation | undefined;
  if (canAnimate()) {
    morph = face.animate(frames(), timing);
    reveal = label.animate([
      { opacity: 0 }, { opacity: 0, offset: .76, easing: glide }, { opacity: 1, offset: .98 }, { opacity: 1 },
    ], timing);
    dockFade = dock.animate([
      { opacity: 1, easing: glide }, { opacity: 0, offset: handoff }, { opacity: 0 },
    ], timing);
  }

  const dismiss = (event: Event) => {
    if (!compact.matches) return;
    dockLauncher();
    if (!morph || !reveal || !dockFade || !canAnimate()) return;
    event.preventDefault();
    if (dialog.hasAttribute("data-returning")) return;

    const playhead = Math.min(duration, Number(morph.currentTime ?? 0));
    if (playhead <= 0) { dialog.close(); return; }

    const before = face.getBoundingClientRect();
    dialog.dataset.returning = "";
    dialog.inert = true;
    morph.currentTime = duration;
    (morph.effect as KeyframeEffect).setKeyframes(frames());
    for (const animation of [morph, reveal, dockFade]) {
      animation.currentTime = playhead;
      animation.reverse();
    }

    // Closing during the rise can change the landing from the expanded preview to the edge.
    // Preserve the current frame and blend out just that positional difference on the way down.
    const after = face.getBoundingClientRect();
    const x = before.left - after.left;
    const y = before.top - after.top;
    if (Math.abs(x) > 1 || Math.abs(y) > 1) {
      correction = face.animate([{ translate: `${x}px ${y}px` }, { translate: "0px 0px" }],
        { duration: playhead, easing: "ease-out" });
    }
    morph.onfinish = () => dialog.close();
  };
  const stop = () => {
    if (morph) morph.onfinish = null;
    morph?.cancel();
    reveal?.cancel();
    dockFade?.cancel();
    correction?.cancel();
  };
  const motionChanged = () => {
    stop();
    if (dialog.hasAttribute("data-returning")) dialog.close();
    morph = reveal = undefined;
  };
  dialog.addEventListener("cancel", dismiss);
  motion.addEventListener("change", motionChanged);
  return () => {
    dialog.removeEventListener("cancel", dismiss);
    motion.removeEventListener("change", motionChanged);
    dialog.inert = false;
    delete dialog.dataset.returning;
    stop();
  };
}

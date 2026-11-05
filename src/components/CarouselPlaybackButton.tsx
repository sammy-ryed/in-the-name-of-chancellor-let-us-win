type PlaybackButtonProps = {
  playing: boolean;
  onToggle: () => void;
  controls: string;
  className?: string;
};

export function CarouselPlaybackButton({ playing, onToggle, controls, className }: PlaybackButtonProps) {
  const action = playing ? "Pause" : "Play";
  return (
    <button type="button" className={className} data-carousel-playback
      aria-controls={controls} aria-label={action + " slideshow"} onClick={onToggle}>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        {playing ? <path d="M4 2h3v12H4zm5 0h3v12H9z" /> : <path d="M4 2v12l9-6z" />}
      </svg>
      <span>{action}</span>
    </button>
  );
}

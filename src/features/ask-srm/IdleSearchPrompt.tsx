import { useState } from "react";
import { promptsFor } from "./prompts";

export function IdleSearchPrompt({ path }: { path: string }) {
  const [index, setIndex] = useState(0);
  const examples = promptsFor(path).map(prompt => prompt.question);
  const hints = [examples[0], "Ask anything about SRM", ...examples.slice(1)];

  return (
    <span className="ask-prompt" aria-hidden="true">
      <span key={index} className="ask-idle-hint" onAnimationEnd={event => {
        if (event.animationName === "ask-hint-cycle") {
          setIndex(current => (current + 1) % hints.length);
        }
      }}>{hints[index]}</span>
    </span>
  );
}

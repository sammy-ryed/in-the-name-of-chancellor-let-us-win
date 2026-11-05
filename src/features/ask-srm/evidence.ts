import type { Source } from "./types";

// Guard important figures against unsupported dates and amounts even when the model
// selects a valid source number. Accept equivalent Indian number formatting.
function figures(text: string): number[] {
  const clean = text.replace(/(?<!\S)\d{1,2}[.)]\s+/g, "").replace(/(?<=\d),(?=\d)/g, "");
  return [...clean.matchAll(/\d+(?:\.\d+)?(?:\s*(?:lakhs?|lacs?|crores?|lpa)\b)?/gi)].map(([part]) => {
    const multiplier = /crore/i.test(part) ? 10000000 : /la[ck]|lpa/i.test(part) ? 100000 : 1;
    return Number.parseFloat(part) * multiplier;
  });
}

export function figuresAreSupported(answer: string, sources: Source[]): boolean {
  const supported = new Set(figures(sources.map((s) => s.title + " " + s.summary).join("\n")));
  // A comparison may express the difference between two published tuition amounts.
  // Never combine an annual amount with a semester or total-course fee.
  const tuition = sources.map((source) => source.summary.match(/(annual tuition|semester tuition|total (?:course|tuition) fee)\s*:\s*₹([\d,]+)/i));
  if (tuition.length === 2 && tuition[0] && tuition[1] && tuition[0][1].toLowerCase() === tuition[1][1].toLowerCase()) {
    const amounts = tuition.map((fee) => Number(fee![2].replace(/,/g, "")));
    supported.add(Math.abs(amounts[0] - amounts[1]));
  }
  return figures(answer).every((figure) => supported.has(figure));
}

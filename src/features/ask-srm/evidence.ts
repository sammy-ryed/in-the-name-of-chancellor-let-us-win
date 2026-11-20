import type { Source } from "./types";

type Figure = { value: number; unit: "number" | "rupees" | "percent" };

// Accept equivalent Indian currency notation, but don't allow an exam rank or
// an amount of money to substantiate a percentage in an answer.
function figures(text: string): Figure[] {
  const clean = text.replace(/(\d+(?:\.\d+)?)\s*([–—-]|to)\s*(\d+(?:\.\d+)?)\s*(%|per cent\b|percent\b)/gi, "$1% $2 $3$4")
    .replace(/(?<!\S)\d{1,2}[.)]\s+/g, "").replace(/(?<=\d),(?=\d)/g, "");
  const pattern = /(?:(₹|\bINR\b|\bRs\.?)\s*)?(\d+(?:\.\d+)?)(?:\s*(lakhs?|lacs?|crores?|lpa)\b)?(?:\s*(%|per cent\b|percent\b|rupees\b))?/gi;
  return [...clean.matchAll(pattern)].map(([, prefix, amount, scale, suffix]) => {
    const multiplier = /crore/i.test(scale ?? "") ? 10000000 : scale ? 100000 : 1;
    const unit = suffix && /%|cent/i.test(suffix) ? "percent"
      : prefix || /lpa|rupees/i.test((scale ?? "") + (suffix ?? "")) ? "rupees" : "number";
    return { value: Number(amount) * multiplier, unit };
  });
}

export function figuresAreSupported(answer: string, sources: Source[]): boolean {
  const supported = figures(sources.map(s => s.title + " " + s.summary).join("\n"));
  // A comparison may express the difference between two published tuition amounts.
  // Never combine an annual amount with a semester or total-course fee.
  const tuition = sources.map((source) => /Fee sources differ|Confirm conditions before comparing amounts/i.test(source.summary) ? null : source.summary.match(/(annual tuition|semester tuition|total (?:course|tuition) fee)\s*:\s*₹([\d,]+)/i));
  if (tuition.length === 2 && tuition[0] && tuition[1] && tuition[0][1].toLowerCase() === tuition[1][1].toLowerCase()) {
    const amounts = tuition.map((fee) => Number(fee![2].replace(/,/g, "")));
    supported.push({ value: Math.abs(amounts[0] - amounts[1]), unit: "rupees" });
  }
  return figures(answer).every(claim => supported.some(fact =>
    fact.value === claim.value && (claim.unit === "number" || fact.unit === claim.unit)));
}

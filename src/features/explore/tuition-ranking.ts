type Fee = { fee: string; amount: number | null; period: string; conflict?: string };
type Slot = { short: string; campus: string; fee: Fee } | null;
type Entry = { slot: number; name: string; campus: string; amount: number };
const periods = new Set(["Annual tuition", "Full programme fee", "First semester"]);

export const rupees = (amount: number) => "₹" + amount.toLocaleString("en-IN");

export function rankTuition(slots: Slot[]) {
  const eligible = new Map<string, Entry[]>();
  const excluded: { slot: number; explanation: string }[] = [];
  slots.forEach((course, slot) => {
    if (!course) return;
    const { fee } = course;
    if (fee.amount === null || !periods.has(fee.period) || fee.conflict) {
      const reason = fee.conflict ? "The programme and faculty fee sources disagree."
        : !periods.has(fee.period) ? "The billing period is unspecified."
        : "The listing includes conditions or gives no single tuition amount.";
      excluded.push({ slot, explanation: fee.fee + " · " + reason });
      return;
    }
    const group = eligible.get(fee.period) ?? [];
    group.push({ slot, name: course.short, campus: course.campus, amount: fee.amount });
    eligible.set(fee.period, group);
  });

  const groups = Array.from(eligible, ([period, entries]) => {
    entries.sort((a, b) => b.amount - a.amount || a.slot - b.slot);
    const highest = entries[0].amount;
    const lowest = entries.at(-1)!.amount;
    const rows = entries.map(entry => {
      const tied = entries.filter(other => other.amount === entry.amount).length > 1;
      let rank = "";
      if (entries.length > 1) {
        if (highest === lowest) rank = "Same tuition";
        else if (entry.amount === highest) rank = tied ? "Joint highest" : "Highest";
        else if (entry.amount === lowest) rank = tied ? "Joint lowest" : "Lowest";
        else rank = "Middle";
      }
      return { ...entry, rank, aboveLowest: entry.amount - lowest };
    });
    return { period, rows, highest, lowest, difference: highest - lowest };
  });
  return { groups, excluded };
}
export type TuitionRanking = ReturnType<typeof rankTuition>;

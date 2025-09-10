import { BodyMetricsLogType } from "../types/BodyMetricsLogType";

export function fatMassChange(data: BodyMetricsLogType[]) {
  const sorted = data
    .filter(
      (d) => typeof d.bodyFat === "number" && typeof d.weight === "number"
    )
    .sort(
      (a, b) => new Date(a.id.date).getTime() - new Date(b.id.date).getTime()
    );

  if (sorted.length < 2) return 0;

  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  const firstFatMass = first.weight! * (first.bodyFat! / 100);
  const lastFatMass = last.weight! * (last.bodyFat! / 100);

  return lastFatMass - firstFatMass; // lbs gained or lost
}

export function fatMass(data: BodyMetricsLogType) {
  return data.weight! * (data.bodyFat! / 100);
}

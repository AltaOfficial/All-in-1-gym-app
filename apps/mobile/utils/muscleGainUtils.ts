import { BodyMetricsLogType } from "../types/BodyMetricsLogType";
import { format } from "date-fns";

export function leanBodyMassChange(data: BodyMetricsLogType[]) {
  const sorted = data
    .filter(
      (d) => typeof d.bodyFat === "number" && typeof d.weight === "number"
    )
    .sort(
      (a, b) =>
        new Date(format(a.id.date, "yyyy-MM-dd")).getTime() -
        new Date(format(b.id.date, "yyyy-MM-dd")).getTime()
    );

  if (sorted.length < 2) return 0;

  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  const firstLeanMass = first.weight! * (1 - first.bodyFat! / 100);
  const lastLeanMass = last.weight! * (1 - last.bodyFat! / 100);

  return lastLeanMass - firstLeanMass; // lbs gained or lost
}

export function leanBodyMass(data: BodyMetricsLogType) {
  return data.weight! * (1 - data.bodyFat! / 100);
}

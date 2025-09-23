import React from "react";
import * as d3 from "d3";
import { Svg, Path, Circle, G, Text as SvgText } from "react-native-svg";
import { BodyMetricsLogType } from "../types/BodyMetricsLogType";
import { GroceryListItemType } from "../types/groceryListItemType";
import { format } from "date-fns";
import { BodyMetricEnum } from "../types/bodyMetricEnum";
import { leanBodyMass } from "../utils/muscleGainUtils";
import { fatMass } from "../utils/fatGainLossUtils";

export default function BodyMetricsChart({
  data,
  className,
  width,
  height,
  startDate,
  endDate,
  selectedDate,
  metricType,
}: {
  data: BodyMetricsLogType[] | GroceryListItemType[];
  className?: string;
  width: number;
  height: number;
  startDate?: string;
  endDate?: string;
  selectedDate?: string;
  metricType?: BodyMetricEnum;
}) {
  const margin = {
    top: 10,
    right: 0,
    bottom: 30,
    left: 40,
  };

  let yScale = d3.scaleLinear();
  let xScale = d3
    .scaleTime()
    .domain([new Date(startDate as string), new Date(endDate as string)])
    .range([margin.left, width - margin.right]);
  let chartData: { date: Date; value: number }[] = [];

  // Convert data to chart format and filter out zero values
  if (metricType === BodyMetricEnum.FOOD_EXPENSES) {
    // Group items by date and sum their values
    const groupedData = new Map<string, number>();

    data.forEach((d) => {
      const date = (d as GroceryListItemType).groceryListEntityIdDateTo;
      const value =
        (d as GroceryListItemType).cost * (d as GroceryListItemType).quantity;

      if (groupedData.has(date)) {
        groupedData.set(date, groupedData.get(date)! + value);
      } else {
        groupedData.set(date, value);
      }
    });

    chartData =
      Array.from(groupedData.entries()).map(([date, value]) => ({
        date: new Date(date),
        value: value,
      })) || [];

    yScale = d3
      .scaleLinear()
      .domain(d3.extent(chartData.map((d) => d.value)) as [number, number])
      .range([height - margin.bottom - 40, margin.top]);

    if (
      (selectedDate === "1W" || selectedDate === "1M") &&
      chartData.length > 0
    ) {
      xScale = d3
        .scaleTime()
        .domain([
          new Date(chartData[0].date),
          new Date(chartData[chartData.length - 1].date),
        ])
        .range([margin.left, width - margin.right]);
    }
  } else if (metricType === BodyMetricEnum.MUSCLE_GAIN_LOSS) {
    chartData = data
      .filter(
        (d) =>
          (d as BodyMetricsLogType).weight && (d as BodyMetricsLogType).bodyFat
      )
      .map((d) => ({
        date: new Date((d as BodyMetricsLogType).id?.date),
        value: leanBodyMass(d as BodyMetricsLogType),
      }));

    yScale = d3
      .scaleLinear()
      .domain(d3.extent(chartData.map((d) => d.value)) as [number, number])
      .range([height - margin.bottom - 40, margin.top]);
  } else if (metricType === BodyMetricEnum.FAT_GAIN_LOSS) {
    chartData = data
      .filter(
        (d) =>
          (d as BodyMetricsLogType).weight && (d as BodyMetricsLogType).bodyFat
      )
      .map((d) => ({
        date: new Date((d as BodyMetricsLogType).id?.date),
        value: fatMass(d as BodyMetricsLogType),
      }));

    yScale = d3
      .scaleLinear()
      .domain(d3.extent(chartData.map((d) => d.value)) as [number, number])
      .range([height - margin.bottom - 40, margin.top]);
  } else {
    chartData = data
      .map((d) => ({
        date: new Date((d as BodyMetricsLogType).id?.date),
        value:
          Number(
            (d as BodyMetricsLogType)[metricType as keyof BodyMetricsLogType]
          ) || 0,
      }))
      .filter((d) => d.value > 0);

    yScale = d3
      .scaleLinear()
      .domain(d3.extent(chartData.map((d) => d.value)) as [number, number])
      .range([height - margin.bottom - 40, margin.top]);
  }

  let line = d3
    .line<{ date: Date; value: number }>()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.value));
  let d = line(chartData);

  return (
    <Svg
      className={`bg-gray1 ${className}`}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      {xScale
        .ticks(
          selectedDate === "1W"
            ? 7
            : selectedDate === "1M"
              ? 10
              : selectedDate === "3M"
                ? 3
                : selectedDate === "6M"
                  ? 6
                  : selectedDate === "1Y"
                    ? 12
                    : 10
        )
        .map((date: Date, index: number) => {
          return (
            <SvgText
              x={xScale(date)}
              y={height - margin.bottom - 10}
              fill="white"
              key={index}
              fontSize="12"
              textAnchor="middle"
            >
              {selectedDate == "1W" && format(date, "E")}
              {selectedDate == "1M" && format(date, "d")}
              {selectedDate == "3M" && format(date, "LLL")}
              {selectedDate == "6M" && format(date, "MMM")}
              {selectedDate == "1Y" && format(date, "MMM")}
              {selectedDate == "All" && format(date, "yyyy")}
            </SvgText>
          );
        })}
      <Path
        d={d || ""}
        fill="none"
        stroke="white"
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <G fill="black" stroke="#F43A45" strokeWidth="2">
        {chartData.map((d, i) => (
          <Circle key={i} cx={xScale(d.date)} cy={yScale(d.value)} r="4" />
        ))}
      </G>
      {yScale.ticks().map((value, index) => {
        return (
          <SvgText y={yScale(value)} fill="white" key={index}>
            {value.toFixed(2)}
          </SvgText>
        );
      })}
    </Svg>
  );
}

import React, { useEffect, useMemo, useRef } from "react";
import { Bar, BarGroup, BarRounded, LinePath } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridRows } from "@visx/grid";
import { LinearGradient } from "@visx/gradient";
import { curveMonotoneX } from "@visx/curve";
import { Tooltip, useTooltip } from "@visx/tooltip";
import { getStringWidth } from "@visx/text";

import { ScaleOrdinal } from "@visx/vendor/d3-scale";

import { MonthlyData } from "../../../API/reports.api";
import { IncomeExpenseTooltipContent } from "./IncomeExpenseTooltipContent";
import { getUserJurisdictionCurrencyCode } from "../../../utilities/user_attributes";

import {
  getIncomeBeforeTax,
  getApprovedExpenses,
  getDate,
  getProfit,
  formatDateMon,
  graphHeight,
  graphWidth,
} from "./helpers";

import { GraphLayoutType } from "./types";

// Visual configuration
export const padding = {
  top: 20,
  right: 0,
  bottom: 40,
  left: 0,
};

const colours = {
  label: "#6b7280",
  grid: "#F2F4F7",
};

const IncomeExpenseGraph = ({
  colorScale,
  data,
  height,
  keys,
  width,
}: {
  colorScale: ScaleOrdinal<string, { from: string; to: string }>;
  data: MonthlyData[];
  height: number;
  keys: string[];
  width: number;
}) => {
  /*
   * Layout dimensions for the graph within the svg.
   */
  const layout: GraphLayoutType = useMemo(
    () => ({
      left: padding.left,
      right: width - padding.right,
      top: padding.top,
      bottom: height - padding.bottom,
      width,
      height,
    }),
    [width, height],
  );

  /*
   * Determine the min and max values for the y-axis
   * These are used to set the domain of the yScale
   * And also to determine how much padding we need on the left
   * which is why we need to calculate them here
   */
  const yScaleMax =
    Math.max(
      ...data.map(getIncomeBeforeTax),
      ...data.map(getApprovedExpenses),
      ...data.map(getProfit),
    ) || 1;

  const yScaleMin = Math.min(
    0,
    ...data.map(getProfit),
    ...data.map(getApprovedExpenses),
  );

  /*
   * Scales with dynamic data dependencies, memoized for performance
   * The scales map our data to the pixel dimensions
   * See https://airbnb.io/visx/docs/scale
   */

  /*
   * yScale maps the data to the y-axis
   * We use a linear scale as the data is continuous
   */
  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [graphHeight(layout), 0],
        round: true,
        domain: [yScaleMin, yScaleMax],
        nice: 10,
      }),
    [layout, yScaleMax, yScaleMin],
  );

  /*
   * Using Visx/text to better calculate y-axis label length
   * Math.max of the string width of the largest and smallest number in the domain
   * If the string is under a certain length,
   * we want to force a minimum width to ensure
   * the full string is always visible.
   * Otherwise we use the string length with a little bit of padding
   */

  const stringLength = Math.max(
    Math.ceil(getStringWidth(yScale.domain()[1].toString())),
    Math.ceil(getStringWidth(yScale.domain()[0].toString()))
  );
  layout.left = stringLength <= 22 ? 32 : stringLength + 10;

  /*
   * dateScale maps the data to the x-axis into date based groups
   */
  const dateScale = useMemo(
    () =>
      scaleBand<Date>({
        range: [0, graphWidth(layout)],
        round: true,
        domain: data.map((d) => getDate(d)),
        padding: 0.2,
      }),
    [data, layout],
  );

  /*
   * keyScale splits the bar into income/expense groups
   */
  const keyScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, dateScale.bandwidth()],
        domain: keys,
      }),
    [dateScale, keys],
  );

  /*
   * yTicks determines how many ticks to show on the y-axis
   * We need to control this number to ensure the ticks are not too tight
   * and still show a minimum and maximum tick on the axis
   * It is centralised here as it's used on both the axis and the grid
   */
  let yTicks = height / 50 > 5 ? 5 : Math.round(height / 50);

  if (Math.ceil(yScaleMax) - Math.floor(yScaleMin) < yTicks) {
    yTicks = Math.ceil(yScaleMax) - Math.floor(yScaleMin);
  }

  /*
   * Tooltip prints the legend when hovering over a bar
   */
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const {
    showTooltip,
    hideTooltip,
    tooltipOpen,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
  } = useTooltip<React.ReactNode>({
    tooltipOpen: false,
  });

  const handlePointerMove = (monthData: MonthlyData, posX: number) => {
    const tooltipContent = IncomeExpenseTooltipContent({
      colorScale,
      dateScale,
      layout,
      monthData,
      posX: posX + layout.left,
      tooltipElement: tooltipRef.current,
      yScale,
    });
    if (!tooltipContent) return;
    showTooltip(tooltipContent);
  };

  window.addEventListener("scroll", hideTooltip);

  const lineData = data.filter(
    (d) =>
      getProfit(d) !== 0 ||
      getIncomeBeforeTax(d) !== 0 ||
      getIncomeBeforeTax(d) !== 0,
  );

  const tooltipOpenTimer = useRef(null);

  useEffect(() => {
    if (tooltipOpen) {
      tooltipOpenTimer.current = setTimeout(() => {
        window.analytics.track("dashboard_income_expense_graph_engagement");
      }, 2000);
    } else {
      clearTimeout(tooltipOpenTimer.current);
    }
    return () => clearTimeout(tooltipOpenTimer.current);
  }, [tooltipOpen]);

  /*
   * The graph is rendered as an svg
   * See https://airbnb.io/visx/docs/svg
   */
  return (
    <div className="tw-relative" onMouseLeave={hideTooltip}>
      <svg width={layout.width} height={layout.height}>
        {colorScale.range().map((color, i) => (
          <LinearGradient
            from={color.from}
            to={color.to}
            rotate={-90}
            id={`gradient-${i}`}
            key={i}
          />
        ))}
        <Group top={layout.top} left={layout.left}>
          <GridRows
            scale={yScale}
            width={graphWidth(layout)}
            height={height}
            numTicks={yTicks}
            stroke={colours.grid}
          />
          <BarGroup
            data={data}
            keys={keys}
            height={graphHeight(layout)}
            x0={getDate}
            x0Scale={dateScale}
            x1Scale={keyScale}
            yScale={yScale}
            color={() => null} // We don't use this color prop as we're using a gradient fill
            offset="diverging"
          >
            {(barGroups) =>
              barGroups.map((barGroup) => (
                <Group
                  key={`bar-group-${barGroup.index}-${barGroup.x0}`}
                  left={barGroup.x0}
                >
                  {barGroup.bars.map((bar) => {
                    /*
                     * In order to have the bars originate from 0 on the yAxis we need to
                     * recalculate the height of the bar based on the yValue
                     * Thanks to https://github.com/airbnb/visx/issues/662
                     */
                    // @ts-ignore TODO: The scale expects a number, but we've got an object
                    const yValue = bar.value.amount || 0;
                    const [yDomainMin] = yScale.domain();
                    const barObj = {
                      x: bar.value || 0,
                      y: yScale(yValue > 0 ? yValue : 0),
                      width: bar.width,
                      height: Math.abs(
                        yScale(yValue) -
                          (yValue > 0
                            ? yScale(Math.max(0, yDomainMin))
                            : yScale(0)),
                      ),
                      value: bar.value,
                    };

                    return (
                      bar.height && (
                        <BarRounded
                          key={`bar-group-bar-${barGroup.index}-${bar.index}-${bar.value}-${bar.key}`}
                          x={bar.x}
                          y={barObj.y}
                          width={bar.width}
                          height={barObj.height}
                          fill={`url("#gradient-${bar.index}")`}
                          radius={4}
                          topLeft={yValue > 0}
                          topRight={yValue > 0}
                          bottomLeft={yValue < 0}
                          bottomRight={yValue < 0}
                        />
                      )
                    );
                  })}
                </Group>
              ))
            }
          </BarGroup>

          <LinePath
            data={lineData}
            x={(d) => dateScale(getDate(d)) + dateScale.bandwidth() * 0.25}
            y={(d) => yScale(getProfit(d))}
            curve={curveMonotoneX}
            stroke={colorScale("profit").from}
            strokeWidth={3}
            strokeOpacity={1}
          />
        </Group>
        <AxisBottom
          top={layout.bottom}
          left={layout.left}
          scale={dateScale}
          tickFormat={formatDateMon}
          strokeWidth={0}
          numTicks={Math.round(width / 60)}
          tickStroke={"#a44afe"}
          tickLabelProps={{
            fill: colours.label,
            fontSize: 12,
            textAnchor: "middle",
          }}
        />
        <AxisLeft
          top={layout.top}
          left={layout.left}
          scale={yScale.nice(yTicks)}
          strokeWidth={0}
          numTicks={yTicks}
          tickFormat={(d) =>
            d.toLocaleString("default", {
              style: "currency",
              currency: getUserJurisdictionCurrencyCode(),
              maximumFractionDigits: 0,
              currencyDisplay: "narrowSymbol",
            })
          }
          tickLabelProps={{
            fill: "#888",
            fontSize: 12,
            textAnchor: "end",
          }}
        />
        {/*
         * We render invisible bars over the whole graph to capture pointer events
         */}
        <Group top={layout.top} left={layout.left}>
          {data.map((d) => {
            const date = getDate(d);
            const barWidth = dateScale.bandwidth();
            const barHeight = graphHeight(layout);
            const barX = dateScale(date);
            const barY = 0;
            return (
              <Bar
                key={`bar-${date}`}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight >= 0 ? barHeight : 0}
                fill="none"
                pointerEvents="visible"
                onTouchStart={() => handlePointerMove(d, barX)}
                onPointerMove={() => handlePointerMove(d, barX)}
              />
            );
          })}
        </Group>
      </svg>
      {tooltipOpen && (
        /* @ts-expect-error https://github.com/airbnb/visx/issues/1755 */
        <Tooltip
          left={tooltipLeft}
          top={tooltipTop}
          offsetTop={0}
          unstyled={true}
          ref={tooltipRef}
          className="tw-absolute tw-pointer-events-none tw-transition-all"
        >
          <>{tooltipData}</>
        </Tooltip>
      )}
    </div>
  );
};

export default IncomeExpenseGraph;

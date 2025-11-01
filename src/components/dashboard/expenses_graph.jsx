import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useLayoutEffect,
} from "react";
import classNames from "classnames";
import { VictoryPie, VictoryLabel, VictoryAnimation } from "victory";
import { truncate } from "../utils/base_helper";
import {
  BRAND_BLUE,
  EXPENSE_GRAPH_COLOURS,
  BRAND_GREEN,
  GREY_SUPERLIGHT,
  DEFAULT_FONT_FAMILY,
} from "../utils/styles";
import PieCenterLabel from "./data_visualisation/PieCenterLabel";
import PieLegend from "./data_visualisation/PieLegend";

const BASE_COLOURS = [BRAND_GREEN, GREY_SUPERLIGHT];
const EXPENSES_LABEL = "Claimable total";

const splitText = (text) => {
  if (text.length <= 25) return text;

  let firstLine = text.substring(0, 22);
  const lastIndexOfSpace = firstLine.lastIndexOf(" ");

  if (lastIndexOfSpace > 0 && lastIndexOfSpace < text.length) {
    firstLine = firstLine.substring(0, lastIndexOfSpace);
    const secondLine = truncate(text.slice(firstLine.length).trim(), 24);

    return [firstLine, secondLine];
  }

  return [firstLine];
};

const ExpensesGraph = ({
  centerLabel,
  isAnimated,
  expensesCategories,
  total,
  maxHeight,
  isMobile,
  hideLegend,
  disableMouseEvents,
  expensesGraph = false,
}) => {
  const [centerLabelText, setCenterLabelText] = useState(EXPENSES_LABEL);
  const [centerLabelValue, setCenterLabelValue] = useState(0);
  const [graphData, setGraphData] = useState([]);
  const [labelPadding, setLabelPadding] = useState(0);
  const [piePadding, setPiePadding] = useState(0);
  const [colours, setColours] = useState(BASE_COLOURS);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  // New settings for view under hnry-ui feature flag
  const [innerRadius, setInnerRadius] = useState(80);
  const [svgWidth, setSvgWidth] = useState(280);
  const [svgHeight, setSvgHeight] = useState(220);
  const [graphPosX, setGraphPosX] = useState(18);
  const [legendOrientation, setLegendOrientation] = useState("horizontal");
  const [truncateText, setTruncateText] = useState(false);
  const [maxCharacters, setMaxCharacters] = useState(20);
  const [legendFont, setLegendFont] = useState(10.5);

  const ref = useRef(null);

  useEffect(() => {
    setLabelPadding(hideLegend || isMobile ? 150 : 280);
    setPiePadding(hideLegend || isMobile ? 20 : 155);
  }, [hideLegend, isMobile]);

  useLayoutEffect(() => {
    if (expensesGraph) {
      const pWidth = ref.current.offsetWidth;
      const pHeight = ref.current.offsetHeight;
      const screenWidth = window.innerWidth;

      if (screenWidth < 640) {
        // Settings for 1-col or mobile screen
        const w = screenWidth < 375 ? 320 : 350;
        const h = screenWidth < 375 ? 200 : 250;

        setWidth(w);
        setHeight(h);
        setGraphPosX((pWidth - w) / 2);
        setInnerRadius(screenWidth < 375 ? 70 : 90);
        setTruncateText(false);
        setLegendOrientation(screenWidth >= 550 ? "horizontal" : "vertical");
        setLegendFont(screenWidth >= 550 ? 11 : 10.5);
        setSvgHeight(125 + h);
      } else if (screenWidth >= 1280 || (screenWidth >= 768 && pWidth < 400)) {
        // Settings for 3-cols (>= Tailwinds xl)
        // Settings for 2-cols (Tailwinds md: 768 - 925px)
        const h = 200;
        setWidth(280);
        setHeight(h);
        setInnerRadius(70);
        setGraphPosX((pWidth - 280) / 2);
        setTruncateText(pWidth < 360);
        setLegendOrientation(pWidth >= 360 ? "vertical" : "horizontal");
        setMaxCharacters(24);
        setSvgHeight((pWidth >= 360 ? 125 : 60) + h);
      } else {
        // Settings for 2-cols (926 - 1023px)
        // Settings for 1-col (Tailwinds sm: 640px - 767px)
        const h = 230;

        setWidth(320);
        setHeight(h);
        setGraphPosX((pWidth - 320) / 2);
        setTruncateText(false);
        setLegendOrientation(pWidth >= 560 ? "horizontal" : "vertical");
        setInnerRadius(80);
        setLegendFont(pWidth >= 560 ? 11 : 10.5);
        setSvgHeight(125 + h);
      }

      setSvgWidth(pWidth);
    } else {
      setWidth(hideLegend || isMobile ? 280 : 400);
      setHeight(maxHeight || isMobile ? 400 : 220);
    }
  }, [expensesGraph, hideLegend, isMobile, maxHeight]);

  useEffect(() => {
    setGraphData(expensesCategories);
  }, [expensesCategories]);

  useEffect(() => {
    setColours(expensesGraph ? EXPENSE_GRAPH_COLOURS : BASE_COLOURS);
  }, [expensesGraph]);

  useEffect(() => {
    setCenterLabelText(splitText(centerLabel || EXPENSES_LABEL));
  }, [centerLabel]);

  useEffect(() => {
    setCenterLabelValue(isAnimated ? 0 : total);

    // After a 1 second delay, set the initial graph data that was passed in
    // to replace the pre-animation values.
    if (isAnimated) {
      setTimeout(() => {
        setGraphData(expensesCategories);
        setCenterLabelValue(total);
      }, 300);
    }
  }, [isAnimated, total, expensesCategories]);

  useEffect(() => {
    setGraphData(isAnimated ? getInitialGraphData : expensesCategories);
  }, [isAnimated, expensesCategories]);

  // This will only be called for an isAnimated instance of the component.
  // It replaces the weighted value of each item on the graph with an item
  // with the same name, but its value set to 0 (unless it's the last value
  // which is set to 100)
  const getInitialGraphData = useMemo(() =>
    expensesCategories.map((dataPoint, index) => ({
      x: dataPoint.x,
      y: index < expensesCategories.length - 1 ? 0 : 100,
    })),
  );

  const engagedRecentlyRef = useRef(false);

  useEffect(() => {
    let channelingEngagementId;
    if (expensesGraph && centerLabelText !== EXPENSES_LABEL) {
      channelingEngagementId = setTimeout(() => {
        if (!engagedRecentlyRef.current) {
          window.analytics.track("dashboard_expenses_graph_engagement");
          engagedRecentlyRef.current = true;
        }
      }, 300);
    }

    // Whenever a different section of the donut is hovered, restart the 300ms timer
    return () => clearTimeout(channelingEngagementId);
  }, [centerLabelText]);

  useEffect(() => {
    let engagementCooldownId;
    if (expensesGraph && engagedRecentlyRef.current) {
      engagementCooldownId = setTimeout(() => {
        engagedRecentlyRef.current = false;
      }, 3000);
    }

    // Clearing to prevent from timeout cb running after the component unmounts (causes memory leaks)
    return () => clearTimeout(engagementCooldownId);
  }, [engagedRecentlyRef.current]);

  // using the same function for legend and graph, unfortunately props have different params
  // so I need to get the index differently
  const onMouseEnterEvent = (index, datum, style) => {
    const i = Number.isInteger(index) ? index : datum.index;
    const expense = expensesCategories[i];
    const { x, label } = expense;

    (setCenterLabelText(splitText(x)), setCenterLabelValue(label));

    return {
      style: {
        cursor: "pointer",
        opacity: 0.8,
        fill: style.fill,
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: 12,
      },
    };
  };

  const onMouseLeaveEvent = () => {
    setCenterLabelText(splitText(centerLabel || EXPENSES_LABEL));
    setCenterLabelValue(total);
  };

  if (expensesGraph) {
    return (
      <div ref={ref}>
        <svg width={svgWidth} height={svgHeight} title="Expenses pie graph">
          <g style={{ transform: `translateX(${graphPosX}px)` }}>
            <VictoryLabel
              textAnchor="middle"
              verticalAnchor={({ text }) =>
                text.length > 1 ? "middle" : "start"
              }
              x={width / 2}
              y={innerRadius * 1.1}
              text={centerLabelText}
              lineHeight={1.2}
              style={{
                fontSize: 11,
                fill: BRAND_BLUE,
                wordWrap: "break-word",
                fontWeight: "300",
                fontFamily: DEFAULT_FONT_FAMILY,
              }}
            />
            {isAnimated ? (
              <VictoryAnimation
                duration={1000}
                data={{
                  centerLabelText,
                  centerLabelValue,
                  graphData,
                  colours,
                }}
              >
                {(newProps) => (
                  <PieCenterLabel
                    label={`${Math.round(newProps.centerLabelValue)}%`}
                    labelPadding={labelPadding}
                    fill={BRAND_BLUE}
                  />
                )}
              </VictoryAnimation>
            ) : (
              <PieCenterLabel
                label={centerLabelValue}
                labelPadding={width / 2}
                fill={BRAND_BLUE}
                y={innerRadius * 1.5}
              />
            )}
            <VictoryPie
              standalone={false}
              colorScale={colours}
              innerRadius={innerRadius}
              padding={{ top: 10, bottom: 10 }}
              data={graphData}
              events={
                disableMouseEvents
                  ? null
                  : [
                      {
                        target: "data",
                        eventHandlers: {
                          onMouseEnter: () => [
                            {
                              mutation: ({ index, datum, style }) =>
                                onMouseEnterEvent(index, datum, style),
                            },
                          ],
                          onMouseLeave: () => [
                            {
                              mutation: () => onMouseLeaveEvent(),
                            },
                          ],
                        },
                      },
                    ]
              }
              width={width}
              height={height}
              labels={[]}
              style={{ labels: { display: "none" }, cursor: "pointer" }}
            />
          </g>
          <PieLegend
            x={0}
            y={height}
            data={expensesCategories}
            onMouseEnterEvent={onMouseEnterEvent}
            onMouseLeaveEvent={onMouseLeaveEvent}
            colours={colours}
            fill={BRAND_BLUE}
            orientation={legendOrientation}
            truncateText={truncateText}
            maxCharacters={maxCharacters}
            fontSize={legendFont}
            rowGutter={{ bottom: -2 }}
          />
        </svg>
      </div>
    );
  }

  const classes = classNames("hnry-donut-chart", {
    "hnry-donut-chart--mobile": isMobile,
  });

  return (
    <div className={classes}>
      <svg width={width} height={height}>
        {!hideLegend && (
          <PieLegend
            isMobile={isMobile}
            data={expensesCategories}
            onMouseEnterEvent={onMouseEnterEvent}
            onMouseLeaveEvent={onMouseLeaveEvent}
            colours={colours}
            fill={BRAND_BLUE}
            rowGutter={isMobile ? 2 : 6}
            truncateText={!isMobile}
          />
        )}

        {/* Move the graph over to the left to add spacing from legend, but not on mobile */}
        <g
          style={{
            transform: isMobile
              ? "translateX(-10px)"
              : "translate(18px, -18px)",
          }}
        >
          <g style={{ transform: !isMobile && "translate(-2px, 2px)" }}>
            <VictoryLabel
              textAnchor="middle"
              verticalAnchor={({ text }) =>
                text.length > 1 ? "middle" : "start"
              }
              x={labelPadding}
              y={centerLabelText.length > 0 ? 98 : 100}
              text={centerLabelText}
              lineHeight={1.2}
              style={{
                fontSize: 12,
                fill: BRAND_BLUE,
                wordWrap: "break-word",
                fontWeight: "400",
                fontFamily: DEFAULT_FONT_FAMILY,
              }}
            />
            {isAnimated ? (
              <VictoryAnimation
                duration={1000}
                data={{
                  centerLabelText,
                  centerLabelValue,
                  graphData,
                  colours,
                }}
              >
                {(newProps) => (
                  <PieCenterLabel
                    label={`${Math.round(newProps.centerLabelValue)}%`}
                    labelPadding={labelPadding}
                    fill={BRAND_BLUE}
                  />
                )}
              </VictoryAnimation>
            ) : (
              <PieCenterLabel
                label={centerLabelValue}
                labelPadding={labelPadding}
                fill={BRAND_BLUE}
              />
            )}
          </g>
          <VictoryPie
            standalone={false}
            colorScale={colours}
            innerRadius={80}
            data={graphData}
            events={
              disableMouseEvents
                ? null
                : [
                    {
                      target: "data",
                      eventHandlers: {
                        onMouseEnter: () => [
                          {
                            mutation: ({ index, datum, style }) =>
                              onMouseEnterEvent(index, datum, style),
                          },
                        ],
                        onMouseLeave: () => [
                          {
                            mutation: () => onMouseLeaveEvent(),
                          },
                        ],
                      },
                    },
                  ]
            }
            width={width}
            height={220}
            padding={{
              left: piePadding,
              top: 28,
              right: 0,
            }}
            labels={[]}
            style={{ labels: { display: "none" }, cursor: "pointer" }}
          />
        </g>
      </svg>
    </div>
  );
};

export default ExpensesGraph;

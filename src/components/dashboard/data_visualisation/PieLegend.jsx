import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { VictoryLabel, VictoryLegend } from "victory";
import { truncate } from "../../utils/base_helper";
import { DEFAULT_FONT_FAMILY } from "../../utils/styles";

const PieLegend = ({
  isMobile = false,
  data = [],
  onMouseEnterEvent,
  onMouseLeaveEvent,
  colours,
  fill,
  orientation = "vertical",
  x = 0,
  y = 10,
  truncateText = true,
  maxCharacters = 28,
  fontSize = 11,
  rowGutter = 6,
}) => {
  const arrayLegend = useMemo(
    () =>
      data.map(({ x }, i) => ({
        name:
          !truncateText || (i + 1 === data.length && data.length % 2 !== 0)
            ? x
            : truncate(x, maxCharacters),
        symbol: {
          fill: colours[i],
          type: "square",
          size: 6,
        },
        labels: { fill },
        index: i,
      })),
    [data, colours, maxCharacters, fill, truncateText],
  );

  return (
    <g style={{ transform: isMobile ? "translate(-20px, 50px)" : null }}>
      <VictoryLegend
        x={x}
        itemsPerRow={orientation === "vertical" ? null : 2}
        y={y}
        gutter={5}
        orientation={orientation}
        data={arrayLegend}
        borderPadding={{ top: isMobile ? 180 : 0 }}
        padding={{
          top: isMobile ? 220 : 10,
          left: 0,
          right: 0,
        }}
        style={{
          cursor: "pointer",
          fontWeight: "400",
          fontFamily: DEFAULT_FONT_FAMILY,
          fontSize,
        }}
        rowGutter={rowGutter}
        symbolSpacer={8}
        standalone={false}
        labelComponent={
          <VictoryLabel
            angle={0}
            style={{
              cursor: "pointer",
              fontWeight: "400",
              fontFamily: DEFAULT_FONT_FAMILY,
              fontSize,
            }}
          />
        }
        events={[
          {
            target: "labels",
            eventHandlers: {
              onMouseEnter: () => [
                {
                  target: "labels",
                  mutation: ({ index, datum, style }) =>
                    onMouseEnterEvent(index, datum, style),
                },
              ],
              onMouseLeave: () => [
                {
                  target: "labels",
                  mutation: () => onMouseLeaveEvent(),
                },
              ],
            },
          },
        ]}
      />
    </g>
  );
};

PieLegend.propTypes = {
  isMobile: PropTypes.bool,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      x: PropTypes.string,
      y: PropTypes.number,
    }),
  ),
  onMouseEnterEvent: PropTypes.func.isRequired,
  onMouseLeaveEvent: PropTypes.func.isRequired,
  colours: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  fill: PropTypes.string.isRequired,
  orientation: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  truncateText: PropTypes.bool,
  maxCharacters: PropTypes.number,
  fontSize: PropTypes.number,
  rowGutter: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      top: PropTypes.number,
      bottom: PropTypes.number,
    }),
  ]),
};

export default PieLegend;

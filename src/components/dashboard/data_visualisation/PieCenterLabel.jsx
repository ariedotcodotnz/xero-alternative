import React from "react";
import { VictoryLabel } from "victory";
import { DEFAULT_FONT_FAMILY } from "../../utils/styles";

const PieCenterLabel = ({ label, labelPadding, fill, y = 132 }) => (
  <VictoryLabel
    textAnchor="middle"
    verticalAnchor="middle"
    x={labelPadding}
    y={y}
    text={label}
    style={{
      fontSize: "22",
      fill,
      fontFamily: DEFAULT_FONT_FAMILY,
      fontWeight: "600",
    }}
  />
);

export default PieCenterLabel;

import React from "react";

import {
  VictoryChart, VictoryAxis, VictoryArea,
  VictoryScatter, VictoryLine, VictoryTooltip,
} from "victory";
import { DEFAULT_FONT_FAMILY } from "../utils/styles";

class AreaChart extends React.Component {
  // For some reason the data comes in from rails all as strings,
  // so we make the dates Dates and the numbers Numbers, you know
  chartData() {
    const toReturn = this.props.allocation_graph_data.map(function (datum) {
      datum.x = new Date(datum.x);
      datum.y = Number.parseFloat(datum.y);
      return datum;
    });
    return toReturn;
  }

  chartLabels() {
    return this.chartData().map((datum) => `${this.props.local_currency_symbol}${datum.y}`);
  }

  xAxisTickValues() {
    return this.chartData().map((datum) => datum.x);
  }

  onMouseEnterEvent() {
    return { size: 10 };
  }

  onMouseLeaveEvent() {
    return null;
  }

  render() {
    const chartData = this.chartData();
    const chartLabels = this.chartLabels();
    const xAxisTickValues = this.xAxisTickValues();
    const local_currency_symbol = this.props.local_currency_symbol;
    return (
      <VictoryChart
        scale={{ x: "time" }}
        minDomain={{ y: 0 }}
        padding={{
          left: 55, right: 45, top: 30, bottom: 50,
        }}
      >

        <VictoryAxis
          dependentAxis
          tickFormat={(tick) => `${local_currency_symbol}${tick}`}
          style={{
            grid: { stroke: "#767676", fillOpacity: 0.1, opacity: 0.1 },
            tickLabels: { fill: "#767676" },
            ticks: { fill: "#767676" },
            axis: { fill: "#767676" },
          }}

        />
        <VictoryAxis
          tickCount={chartData.length}
          tickValues={xAxisTickValues}
          tickFormat={(t) => `${t.toLocaleString("default", { month: "short" })}`}
          style={{
            tickLabels: { fill: "#767676" },
            ticks: { fill: "#767676" },
            axis: { fill: "#767676" },
          }}
        />

        <VictoryArea
          style={{
            data: { fill: "#33B082", fillOpacity: 0.2 },
          }}
          data={chartData}
        />

        <VictoryLine
          style={{
            data: { stroke: "#33B082", strokeWidth: 2 },
          }}
          data={chartData}
        />

        <VictoryScatter
          style={{ data: { fill: "#33B082" }, labels: { fill: "#FFFFFF", fontSize: "12px", fontFamily: DEFAULT_FONT_FAMILY } }}
          size={5}
          labelComponent={<VictoryTooltip
            cornerRadius={5}
            flyoutWidth={80}
            flyoutHeight={25}
            flyoutStyle={{
              fill: "black",
            }}
          />}

          events={[
            {
              target: "data",
              eventHandlers: {
                onMouseEnter: () => [
                  {
                    mutation: (props) => this.onMouseEnterEvent(props),
                  },
                ],
                onMouseLeave: () => [
                  {
                    mutation: (props) => this.onMouseLeaveEvent(props),
                  },
                ],
              },
            },
          ]}

          labels={chartLabels}
          data={chartData}
        />

      </VictoryChart>
    );
  }
}

export default AreaChart;

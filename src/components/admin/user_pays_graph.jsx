import React from "react";
import { subDays, differenceInDays } from "date-fns";

import {
  VictoryBar, VictoryBrushContainer, VictoryLine, VictoryScatter, VictoryChart, VictoryAxis, VictoryTooltip, VictoryClipContainer,
} from "victory";
import { colours } from "../utils/base_helper";
import { DEFAULT_FONT_FAMILY } from "../utils/styles";

class UserPaysGraph extends React.Component {
  constructor() {
    super();
    this.state = { selectedDomain: { x: [subDays(new Date(), 100), new Date()] } };
  }

  handleBrush(domain) {
    this.setState({ selectedDomain: domain });
  }

  visibleIncome() {
    return this.props.income.reduce((sum, datum) => {
      const date = new Date(datum.x);

      if (date >= this.state.selectedDomain.x[0] && date <= this.state.selectedDomain.x[1]) {
        return sum + Number(datum.y);
      }
      return sum;
    }, 0);
  }

  render() {
    const maxTax = Math.max(...this.props.tax.map((datum) => Number(datum.y)));
    const maxIncome = Math.max(...this.props.income.map((datum) => Number(datum.y)));
    const firstPayAt = Math.min(...this.props.income.map((datum) => new Date(datum.x)));
    const currencySymbol = this.props.currencySymbol;

    const domainDays = differenceInDays(this.state.selectedDomain.x[1].toDateString(), this.state.selectedDomain.x[0].toDateString());

    return (
      <React.Fragment>
        <h3>{`${currencySymbol}${Math.round(this.visibleIncome()).toLocaleString("en")}`}</h3>
        <p>{`earned over ${domainDays} days`}</p>
        <span>{`${this.state.selectedDomain.x[0].toDateString()} - ${this.state.selectedDomain.x[1].toDateString()}`}</span>
        <div id="pay-frequency-chart">
          <VictoryChart
            // Main chart
            height={400}
            width={1070}
            domain={this.state.selectedDomain}
            domainPadding={{ x: 10, y: 10 }}
            scale={{ x: "time" }}
          >
            <VictoryAxis
              height={10}
              tickCount={20}
              style={{
                tickLabels: { angle: -30, padding: 7, fontFamily: DEFAULT_FONT_FAMILY },
                ticks: { padding: 5, stroke: "#ACACAC", size: 10 },
              }}
            />
            <VictoryAxis
              // Income
              dependentAxis
              tickValues={[0.25, 0.5, 0.75, 1]}
              tickFormat={(t) => `${currencySymbol}${Math.round(t * maxIncome).toLocaleString("en")}`}
              style={{ tickLabels: { fontFamily: DEFAULT_FONT_FAMILY } }}
            />
            <VictoryAxis
              // Tax rate
              dependentAxis
              orientation="right"
              offsetX={50}
              tickValues={[0.25, 0.5, 0.75, 1]}
              tickFormat={(t) => `${Math.round(t * maxTax)}%`}
              style={{ tickLabels: { fontFamily: DEFAULT_FONT_FAMILY } }}
            />
            <VictoryBar
              // Income
              labelComponent={<VictoryTooltip style={{ fontFamily: DEFAULT_FONT_FAMILY }}/>}
              groupComponent={<VictoryClipContainer/>}
              barRatio={0.1}
              style={{
                data: { fill: colours.green.base },
              }}
              animate={{
                duration: 0,
                onLoad: { duration: 1000 },
              }}
              data={this.props.income}
              x={(datum) => new Date(datum.x) }
              y={(datum) => Number(datum.y) / maxIncome }
            />
            <VictoryLine
              // Tax rate
              data={this.props.tax}
              labelComponent={<VictoryTooltip style={{ fontFamily: DEFAULT_FONT_FAMILY }}/>}
              groupComponent={<VictoryClipContainer/>}
              style={{
                data: { stroke: colours.grey.light },
              }}
              x={(datum) => new Date(datum.x) }
              y={(datum) => Number(datum.y) / maxTax}
            />
            <VictoryScatter
              // Tax rate
              data={this.props.tax}
              labelComponent={<VictoryTooltip style={{ fontFamily: DEFAULT_FONT_FAMILY }}/>}
              groupComponent={<VictoryClipContainer/>}
              style={{
                data: { fill: colours.blue.base },
              }}
              x={(datum) => new Date(datum.x) }
              y={(datum) => Number(datum.y) / maxTax}
            />
          </VictoryChart>
          <VictoryChart
            // Bottom slider chart
            domain={{ x: [firstPayAt, new Date()] }}
            width={1080}
            height={90}
            scale={{ x: "time" }}
            padding={{
              top: 0, left: 50, right: 50, bottom: 30,
            }}
            domainPadding={{ x: 10, y: 10 }}
            containerComponent={
              <VictoryBrushContainer
                brushDimension="x"
                brushDomain={this.state.selectedDomain}
                onBrushDomainChange={this.handleBrush.bind(this)}
                // allowResize={false}
                defaultBrushArea="move"
              />
            }
          >
            <VictoryAxis/>
            <VictoryAxis dependentAxis tickFormat={(t) => ""} />
            <VictoryBar
              labelComponent={<VictoryTooltip style={{ fontFamily: DEFAULT_FONT_FAMILY }}/>}
              barRatio={0.1}
              style={{
                data: { fill: colours.green.base },
              }}
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 },
              }}
              data={this.props.income}
              x={(datum) => new Date(datum.x) }
              y={(datum) => Number(datum.y) / maxIncome }
            />
          </VictoryChart>
        </div>
      </React.Fragment>

    );
  }
}

export default UserPaysGraph;

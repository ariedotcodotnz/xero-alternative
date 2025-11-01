import React from "react";
import ReactDOM from "react-dom";
import {
  VictoryBar, VictoryStack, VictoryChart, VictoryAxis, VictoryTheme,
  VictoryLabel, VictoryTooltip,
} from "victory";
import { colours } from "../utils/base_helper";
import { DEFAULT_FONT_FAMILY } from "../utils/styles";

class IncomeTaxPositionGraph extends React.Component {
  render() {
    const paid = Math.min(Number(this.props.taxIdeallyPaidByNow), Number(this.props.taxPaid));
    const behind = Math.max(Number(this.props.taxIdeallyPaidByNow) - Number(this.props.taxPaid), 0);
    const ahead = Math.max(Number(this.props.taxPaid) - Number(this.props.taxIdeallyPaidByNow), 0);
    const toGo = Math.max(Number(this.props.expectedTax) - paid - behind - ahead, 0);
    const currencySymbol = this.props.currencySymbol;

    return (
      <VictoryChart theme={VictoryTheme.material} height={171} width={350} >
        <VictoryAxis
          dependentAxis
          orientation="top"
          tickValues={[Number(this.props.taxIdeallyPaidByNow), Number(this.props.expectedTax)]}
          tickFormat={[`${currencySymbol}${Math.round(Number(this.props.taxIdeallyPaidByNow)).toLocaleString("en")}\nIdeally collected by now`, ""]}
          style={{ tickLabels: { padding: 7, fontFamily: DEFAULT_FONT_FAMILY, fontSize: 8 } }}
        />
        <VictoryAxis
          dependentAxis
          orientation="bottom"
          tickValues={[Number(this.props.taxIdeallyPaidByNow), Number(this.props.expectedTax)]}
          tickFormat={["", `${currencySymbol}${Math.round(Number(this.props.expectedTax)).toLocaleString("en")}\nExpected obligation for year`]}
          style={{ tickLabels: { padding: 7, fontFamily: DEFAULT_FONT_FAMILY, fontSize: 8 } }}
        />
        <VictoryStack>
          <VictoryBar
            horizontal
            data={[{ x: "a", y: 0, label: `${currencySymbol}${Math.round(Number(this.props.taxPaid)).toLocaleString("en")} collected` }]}
            labelComponent={<VictoryLabel style={{ fontFamily: DEFAULT_FONT_FAMILY, fontSize: 15 }}/>}
            style={{
              data: { fill: colours.green.light },
            }}
          />
          <VictoryBar
            horizontal
            animate={{
              duration: 2000,
              onLoad: { duration: 1000 },
            }}
            barRatio={6}
            data={[{ x: "a", y: paid }]}
            style={{
              data: { fill: colours.green.light },
            }}
          />
          <VictoryBar
            horizontal
            animate={{
              duration: 2000,
              onLoad: { duration: 1000 },
            }}
            style={{
              data: { fill: colours.orange.base },
            }}
            barRatio={6}
            labelComponent={<VictoryTooltip style={{ fontFamily: DEFAULT_FONT_FAMILY }}/>}
            data={[{ x: "a", y: behind, label: `Behind by ${currencySymbol}${Math.round(behind).toLocaleString("en")}\n${Math.round((100 * behind) / Number(this.props.taxIdeallyPaidByNow))}%` }]}
          />
          <VictoryBar
            horizontal
            animate={{
              duration: 2000,
              onLoad: { duration: 1000 },
            }}
            barRatio={6}
            data={[{ x: "a", y: ahead, label: `Ahead by ${currencySymbol}${Math.round(ahead).toLocaleString("en")}\n${Math.round((100 * ahead) / Number(this.props.taxIdeallyPaidByNow))}%` }]}
            labelComponent={<VictoryTooltip style={{ fontFamily: DEFAULT_FONT_FAMILY }}/>}
            style={{
              data: { fill: colours.green.base },
            }}
          />
          <VictoryBar
            horizontal
            animate={{
              duration: 2000,
              onLoad: { duration: 1000 },
            }}
            barRatio={6}
            data={[{ x: "a", y: toGo }]}
            style={{
              data: { fill: colours.grey.light },
            }}
          />
        </VictoryStack>
      </VictoryChart>
    );
  }
}

export default IncomeTaxPositionGraph;

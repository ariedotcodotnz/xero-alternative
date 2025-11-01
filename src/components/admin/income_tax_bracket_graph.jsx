import React from "react";
import {
  VictoryBar,
  VictoryStack,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryLabel,
  VictoryTooltip,
} from "victory";
import { colours } from "../utils/base_helper";
import { DEFAULT_FONT_FAMILY } from "../utils/styles";

class IncomeTaxBracketGraph extends React.Component {
  render() {
    const currencySymbol = this.props.currencySymbol;

    return (
      <VictoryChart theme={VictoryTheme.material} height={400} width={350}>
        <VictoryStack colorScale={[colours.grey.light, colours.green.base]}>
          <VictoryBar
            animate={{
              duration: 2000,
              onLoad: { duration: 1000 },
            }}
            barRatio={6}
            data={[
              {
                x: 1,
                y: Number(this.props.base),
                label: `${currencySymbol}${Math.round(
                  this.props.base,
                ).toLocaleString("en")} non self-employed`,
              },
            ]}
            labelComponent={
              <VictoryTooltip style={{ fontFamily: DEFAULT_FONT_FAMILY }} />
            }
          />
          <VictoryBar
            animate={{
              duration: 2000,
              onLoad: { duration: 1000 },
            }}
            barRatio={6}
            data={[
              {
                x: 1,
                y: Number(this.props.toCollectTaxOn),
                label: `${currencySymbol}${Math.round(
                  this.props.toCollectTaxOn,
                ).toLocaleString("en")} self-employed`,
              },
            ]}
            labelComponent={
              <VictoryTooltip style={{ fontFamily: DEFAULT_FONT_FAMILY }} />
            }
          />
        </VictoryStack>
        {this.props.brackets.map((bracket, index, brackets) => {
          const nextBracket = brackets[index + 1];
          const nextBracketAmount = nextBracket
            ? Number(nextBracket.lowerBound)
            : Math.max(
                Number(this.props.toCollectTaxOn),
                Number(bracket.lowerBound) + 10000,
              );
          const offsetY = (nextBracketAmount - Number(bracket.lowerBound)) / 2;

          return (
            <VictoryLabel
              key={bracket.lowerBound}
              dx={-90}
              text={`${(Number(bracket.marginalRate) * 100).toFixed(1)}%`}
              datum={{ x: 1, y: Number(bracket.lowerBound) + offsetY }}
              textAnchor="middle"
              style={{ fontFamily: DEFAULT_FONT_FAMILY }}
            />
          );
        })}
        <VictoryLabel
          dx={90}
          text={`${(Number(this.props.taxRate) * 100).toFixed(1)}%`}
          datum={{
            x: 1,
            y: Number(this.props.base) + Number(this.props.toCollectTaxOn) / 2,
          }}
          textAnchor="middle"
          style={{ fontFamily: "Inter" }}
        />
        <VictoryAxis
          dependentAxis
          tickValues={this.props.brackets.map((bracket) =>
            Number(bracket.lowerBound),
          )}
          tickFormat={(lowerBound) =>
            `${currencySymbol}${Number(lowerBound) / 1000}k `
          }
          style={{ tickLabels: { fontFamily: DEFAULT_FONT_FAMILY } }}
        />
      </VictoryChart>
    );
  }
}

export default IncomeTaxBracketGraph;

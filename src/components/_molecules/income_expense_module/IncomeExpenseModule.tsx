import React, { useEffect, useRef, useState } from "react";
import { scaleOrdinal } from "@visx/scale";
import { ParentSize } from "@visx/responsive";
import { LegendOrdinal } from "@visx/legend";

import { iIncomeExpense, incomeExpense } from "../../../API/reports.api";

import IncomeExpenseGraph from "./IncomeExpenseGraph";
import Select, { SelectOptionType } from "../../_atoms/select/Select";
import { formatToLocalCurrency } from "../../../utilities/currency/currency_format";
import { getUserJurisdictionCode } from "../../../utilities/user_attributes";
import {
  defaultFinancialYear,
  friendlyLabel,
  hasAnyIncomeOrExpenses,
} from "./helpers";
import Tooltip from "../../_atoms/tooltip/Tooltip";
import I18n from "../../../utilities/translations";

const barKeys = ["incomeBeforeTax", "approvedExpenses"];
const lineKeys = ["profit"];

const gradients = [
  { from: "#272754", to: "#00066A" },
  { from: "#7A7ABA", to: "#444698" },
  { from: "#57DBAB", to: "#57DBAB" },
];

/* Scales without dynamic data dependencies
 * The scales map our data to the pixel dimensions
 * See https://airbnb.io/visx/docs/scale
 * colorScale is a special case, it maps the keys to the color range
 */
const colorScale = scaleOrdinal<string, { from: string; to: string }>({
  domain: [...barKeys, ...lineKeys],
  range: gradients,
});

const IncomeExpenseModule = ({
  defaultFy,
  emptyStateImageUrl,
  financialYears,
}: {
  defaultFy?: string;
  emptyStateImageUrl: string;
  financialYears?: SelectOptionType[];
}) => {
  const [data, setData] = useState<iIncomeExpense>(null);
  const monthlyData = (() => data?.monthlyData || [])();
  const [fy, setFy] = useState(defaultFinancialYear(defaultFy, financialYears));
  const isInitialRender = useRef(true);

  /*
   * Fetch the data from the API
   */
  useEffect(() => {
    if (isInitialRender.current === false) {
      window.analytics.track("dashboard_income_expense_graph_fy_selection");
    }
    isInitialRender.current = false;

    const fetchData = async () => {
      const reportData = await incomeExpense(fy);
      setData(reportData.data);
    };
    try {
      fetchData();
    } catch (err) {
      if (typeof Rollbar !== "undefined") {
        Rollbar.warning(
          "Unable to retrieve income expense data for dashboard graph",
        );
      }
    }
  }, [fy]);

  /*
   * If we have no data to show we'll display a loader
   */
  const graph = data ? (
    <>
      <div>
        <div className="tw-text-xs tw-uppercase">
          Total profit before tax in {fy || "YTD"}
        </div>
        <div>
          <span className="tw-text-gray-900">
            {formatToLocalCurrency(
              data.totalProfit.amount,
              getUserJurisdictionCode(),
              {
                decimals: true,
              },
            )}
          </span>
          <span className="tw-text-xs tw-uppercase tw-text-gray-500 tw-ml-2">
            {data.totalProfit.currency}
          </span>
        </div>
      </div>
      <div className="tw-grow">
        <div className="tw-flex tw-flex-col tw-w-full tw-h-full">
          <div className="tw-grow tw-min-h-[200px] sm:tw-min-h-[40vw] md:tw-min-h-fit tw-relative">
            <ParentSize>
              {({ width, height }) => (
                <div className="tw-absolute">
                  <IncomeExpenseGraph
                    colorScale={colorScale}
                    data={monthlyData}
                    height={height}
                    keys={barKeys}
                    width={width}
                  />
                </div>
              )}
            </ParentSize>
          </div>

          {/* We render the legend as html as it allows for simpler responsive handling */}
          <LegendOrdinal scale={colorScale}>
            {(labels) => (
              <div className="tw-flex tw-gap-1 tw-flex-col xs:tw-flex-row tw-flex-wrap xs:tw-gap-3 xs:tw-mx-auto">
                {labels.map((label, i) => (
                  <div
                    key={`legend-quantile-${i}`}
                    className="tw-flex tw-gap-2 tw-items-center tw-text-xs"
                  >
                    <div
                      className="tw-inline-block tw-w-3 tw-h-3 tw-rounded-full"
                      style={{
                        backgroundColor: label.value.from,
                      }}
                    ></div>
                    <span>{friendlyLabel(label.text)}</span>
                  </div>
                ))}
              </div>
            )}
          </LegendOrdinal>
        </div>
      </div>
    </>
  ) : (
    <div className="tw-w-full tw-h-full tw-bg-gray-100 tw-flex tw-justify-center tw-items-center tw-min-h-[250px]">
      <div className="tw-animate-opacityShowDelayed">
        <div className="loader-icecream tw-animate-opacityShowDelayed"></div>
      </div>
    </div>
  );

  return (
    <div className="tw-flex tw-flex-col tw-h-full">
      <div className="hui-card-heading">
        <h2 className="hui-card-heading__title tw-flex tw-items-center">
          <span className="tw-pr-1 tw-whitespace-nowrap">
            Income & Expenses
          </span>
          <Tooltip
            popoverMessage={I18n.t(
              "home.index.income_and_expenditure_tooltip_text",
            )}
            learnMore={I18n.t("home.index.income_and_expenditure_tooltip_link")}
            onShow={() =>
              window.analytics.track(
                "dashboard_income_expenses_tooltip_clicked",
              )
            }
          />
        </h2>
        {fy && (
          <div className="hui-card-heading__actions tw-shrink-0 !tw-ml-2">
            <Select
              options={financialYears}
              id="income_expense_fy"
              name="income_expense_fy"
              selectedValue={fy}
              onChange={setFy}
              label="Financial Year to display"
              hideLabel
            />
          </div>
        )}
      </div>

      {data && !hasAnyIncomeOrExpenses(data) ? (
        <div className="hui-card-empty">
          <img
            src={emptyStateImageUrl}
            alt="Bar graph"
            width="140"
            height="100"
          />
          <h3 className="hui-card-empty__title">
            {I18n.t("home.index.cards.empty_state.income_exp_title")}
          </h3>
          <p className="hui-card-empty__subtext">
            {I18n.t("home.index.cards.empty_state.income_exp_subtext")}
          </p>
        </div>
      ) : (
        graph
      )}
    </div>
  );
};

export default IncomeExpenseModule;

import React, { useEffect, useState } from "react";
import ExpensesContent from "./ExpensesContent";
import Select, { SelectOptionType } from "../_atoms/select/Select";
import Icon from "../_atoms/icons/icon/Icon";
import Tooltip from "../_atoms/tooltip/Tooltip";
import { getExpensesGraphData } from "../../API/dashboard.api";
import ExpensesEmptyState from "./ExpensesEmptyState";

import I18n from "../../utilities/translations";

const EXPENSES_DATA_URL = "/expenses/business_category_chart_data";
const YEAR_TO_DATE = "YTD";

interface ExpensesModuleProps {
  addNewDisabled: boolean;
  beenPay: boolean;
  filterMenu: SelectOptionType[];
  showPrevFyByDefault: boolean;
  showExpensesSummary: boolean;
  emptyStateImageSrc: string;
}

const ctx = { scope: "home.index.cards" };
const ctxExpense = { scope: "home.index.cards.empty_state.expenses" };

const ExpensesModule = ({
  filterMenu,
  beenPay,
  showPrevFyByDefault,
  addNewDisabled,
  showExpensesSummary,
  emptyStateImageSrc,
}: ExpensesModuleProps) => {
  const [graphDataByFy, setGraphDataByFy] = useState({});
  const [selectedFy, setSelectedFy] = useState(
    showPrevFyByDefault ? filterMenu[1].value : YEAR_TO_DATE,
  );
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState([
    { name: YEAR_TO_DATE, value: YEAR_TO_DATE },
  ]);
  const [showSavings, setShowSavings] = useState(false);

  const fetchData = async (fy) => {
    const response = await getExpensesGraphData({
      url: EXPENSES_DATA_URL,
      yearFilter: fy === YEAR_TO_DATE ? undefined : fy,
    });
    const { status } = response;

    if (status === "ok") {
      const {
        data,
        total,
        total_savings: totalSavings,
        pending,
        formatted_total_savings: formattedTotalSavings,
        formatted_total: formattedTotal,
      } = response;

      setGraphDataByFy({
        ...graphDataByFy,
        [fy]: {
          data,
          total,
          totalSavings,
          pending,
          formattedTotal,
          formattedTotalSavings,
        },
      });
      updateSelectedFy(fy, totalSavings);
    }
  };

  useEffect(() => {
    if (showExpensesSummary) {
      if (filterMenu !== null) {
        setFilterOptions(filterMenu);
      }

      fetchData(selectedFy);
    }
  }, []);

  const updateSelectedFy = (fy, totalSavings) => {
    setSelectedFy(fy);
    setTimeout(() => {
      setLoading(false);
    }, 300);
    setShowSavings(YEAR_TO_DATE === fy && parseFloat(totalSavings) > 0);
  };

  const handleSelectChange = (value) => {
    setLoading(true);

    if (graphDataByFy[value]) {
      updateSelectedFy(value, graphDataByFy[value].totalSavings);
    } else {
      fetchData(value);
    }

    window.analytics.track("dashboard_expenses_fy_dropdown_applied");
  };

  const windowInnerWidth = window.innerWidth;

  return (
    <>
      <div className="hui-card-heading">
        <h2 className="hui-card-heading__title tw-flex tw-items-center">
          <a href="/expenses" className="hui-card-heading__title tw-mr-1">
            {I18n.t("home.index.cards.expenses")}
          </a>
          <Tooltip
            popoverMessage={I18n.t("home.index.business_expenses_savings")}
            learnMore={I18n.t("home.index.business_expenses_savings_link")}
            onShow={() =>
              window.analytics.track("dashboard_expenses_tooltip_clicked")
            }
          />
        </h2>
        {showExpensesSummary && (
          <div className="hui-card-heading__actions tw-items-end">
            <div className="tw-mr-4">
              <Select
                options={filterOptions}
                onChange={handleSelectChange}
                selectedValue={selectedFy}
                name="selectedFyFilter"
                id="selectedFyFilter"
                disabled={loading}
                label="Financial Year to display"
                hideLabel
              />
            </div>
            {addNewDisabled ? (
              <Tooltip
                popoverMessage={I18n.t("expenses.index.inactive_alert")}
                buttonClasses="hnry-button hnry-button--link hnry-button--icon-end"
              >
                <span className="tw-sr-only">
                  {I18n.t("action.expenses", ctx)}
                </span>
                <Icon type="PlusIcon" classes="!tw-ml-0" />
              </Tooltip>
            ) : (
              <a
                href="/expenses/expense_creation/expense_type"
                className="hnry-button hnry-button--link hnry-button--icon-end"
                data-remote
                data-track-click={JSON.stringify({
                  eventName: "dashboard_expenses_new_click",
                })}
              >
                <span className="tw-sr-only">
                  {I18n.t("action.expenses", ctx)}
                </span>
                <Icon type="PlusIcon" classes="!tw-ml-0" />
              </a>
            )}
          </div>
        )}
      </div>
      {showExpensesSummary ? (
        <ExpensesContent
          loading={loading}
          graphDataByFy={graphDataByFy}
          selectedFy={selectedFy}
          isMobile={windowInnerWidth && windowInnerWidth < 480}
          beenPay={beenPay}
          showSavings={showSavings}
          emptyStateImageSrc={emptyStateImageSrc}
          addNewDisabled={addNewDisabled}
        />
      ) : (
        <ExpensesEmptyState
          title={I18n.t("initial_title", ctxExpense)}
          subtext={I18n.t("initial_subtext", ctxExpense)}
          addNewDisabled={addNewDisabled}
          emptyStateImageSrc={emptyStateImageSrc}
        />
      )}
    </>
  );
};

export default ExpensesModule;

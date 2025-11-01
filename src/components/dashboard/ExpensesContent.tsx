import React from "react";
import classNames from "classnames";
import ExpensesGraph from "./expenses_graph";
import Loader from "../inputs/_elements/loader";
import ExpensesEmptyState from "./ExpensesEmptyState";
import I18n from "../../utilities/translations";

interface Data {
  label: string;
  x: string;
  y: string;
}

interface GraphDataByFy {
  data?: Data[];
  pending?: boolean;
  total?: number;
  totalSavings?: number;
  formattedTotal?: string;
  formatterTotalSavings?: string;
}

interface ExpensesContentProps {
  loading: boolean;
  graphDataByFy: GraphDataByFy;
  selectedFy: string;
  isMobile: boolean;
  beenPay: boolean;
  showSavings: boolean;
  emptyStateImageSrc: string;
  addNewDisabled: boolean;
}

const ctx = { scope: "home.index.cards.empty_state.expenses" };

const ExpensesContent = ({
  addNewDisabled,
  loading,
  graphDataByFy = {},
  selectedFy,
  isMobile,
  beenPay,
  showSavings,
  emptyStateImageSrc,
}: ExpensesContentProps) => {
  const bodyClasses =
    "tw-flex tw-justify-between tw-flex-col tw-text-center tw-p-4 tw-items-center tw-my-12 tw-text-gray-500";

  if (loading) {
    return (
      <div className={bodyClasses}>
        <Loader />
      </div>
    );
  }

  if (graphDataByFy[selectedFy]) {
    const { data, total, pending, formattedTotalSavings, formattedTotal } =
      graphDataByFy[selectedFy];

    // ensure demonstration pay fee doesn't show before the first accepted expense
    if (data.length > 0 && parseFloat(total) > 0.01) {
      return (
        <div
          className={classNames("tw-text-center", {
            "tw-mb-4 tw-mt-6": !showSavings,
            "-tw-mt-2": showSavings,
          })}
        >
          {showSavings && formattedTotalSavings && (
            <div className="tw-w-full tw-bg-gray-100 tw-p-1 tw-text-sm tw-text-brand">
              Your estimated reduction in Income Tax <br />
              <span className="tw-text-2xl tw-font-bold">
                {`${formattedTotalSavings}💰`}
              </span>
            </div>
          )}
          <ExpensesGraph
            isMobile={isMobile}
            expensesCategories={data}
            total={formattedTotal}
            expensesGraph
          />
        </div>
      );
    }

    if (pending) {
      const title = !beenPay
        ? I18n.t("not_paid_pending_title", ctx)
        : I18n.t("paid_pending_title", ctx);
      const subtext = !beenPay
        ? I18n.t("not_paid_pending_subtext", ctx)
        : I18n.t("paid_pending_subtext", ctx);

      return (
        <ExpensesEmptyState
          title={title}
          subtext={subtext}
          emptyStateImageSrc={emptyStateImageSrc}
          addNewDisabled={addNewDisabled}
        />
      );
    }
  }

  return (
    <ExpensesEmptyState
      title={I18n.t("new_fy_title", ctx)}
      subtext={I18n.t("new_fy_subtext", ctx)}
      emptyStateImageSrc={emptyStateImageSrc}
      addNewDisabled={addNewDisabled}
    />
  );
};

export default ExpensesContent;

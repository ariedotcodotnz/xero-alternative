import React from "react";
import I18n from "../../utilities/translations";
import EmptyStateModule from "./EmptyStateModule";

interface ExpensesEmptyStateProps {
  title: string;
  subtext: string;
  addNewDisabled?: boolean;
  emptyStateImageSrc: string;
}

const ExpensesEmptyState = ({
  title,
  subtext,
  addNewDisabled = false,
  emptyStateImageSrc,
}: ExpensesEmptyStateProps) => (
  <EmptyStateModule
    title={title}
    subtext={subtext}
    hideButton={addNewDisabled}
    emptyStateImageSrc={emptyStateImageSrc}
    altImgText="Expenses with background"
    createUrl="/expenses/expense_creation/expense_type"
    createBtnText={I18n.t("home.index.cards.empty_state.expenses.new_expense")}
    trackClick={{
      eventName: "dashboard_expenses_empty_state_new_click",
    }}
  />
);

export default ExpensesEmptyState;

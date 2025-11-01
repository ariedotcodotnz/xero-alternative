import { SelectOptionType } from "@hui/_atoms/select/Select";
import { iIncomeExpense, MonthlyData } from "../../../API/reports.api";

/*
 * Getters and helpers for graph data
 */
export const getApprovedExpenses = (d: MonthlyData) =>
  d.approvedExpenses?.amount;
export const getDate = (d: MonthlyData) => new Date(d.date);
export const getIncomeBeforeTax = (d: MonthlyData) => d.incomeBeforeTax?.amount;
export const getProfit = (d: MonthlyData) => d.profit?.amount;

export const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

export const formatDateMon = (date: Date) =>
  date.toLocaleString("default", { month: "short" });

export const formatDateMonYYYY = (date: Date) =>
  date.toLocaleString("default", {
    year: "numeric",
    month: "short",
  });

/*
 * As the graph width can change based on changes to padding we calculate them on the fly
 */
export const graphWidth = (layout) =>
  layout.width - layout.left - (layout.width - layout.right);

export const graphHeight = (layout) =>
  layout.height - layout.top - (layout.height - layout.bottom);

// General helpers
export const friendlyLabel = (key: string) => {
  switch (key) {
    case "incomeBeforeTax":
      return "Gross income";
    case "approvedExpenses":
      return "Claimed expenses";
    case "profit":
      return "Profit";
    default:
      return key;
  }
};

export const hasAnyIncomeOrExpenses = (data: iIncomeExpense) =>
  data?.monthlyData?.some(
    (month) => getIncomeBeforeTax(month) > 0 || getApprovedExpenses(month) > 0,
  ) || false;

export const defaultFinancialYear = (
  requestedFy?: string,
  availableFys?: SelectOptionType[],
) => {
  if (!availableFys) {
    return null;
  }

  if (availableFys.length === 0) {
    return null;
  }

  const matchedFy = availableFys.find((fy) => fy.value === requestedFy);
  if (matchedFy) {
    return matchedFy.value;
  }
  return availableFys[0].value;
};

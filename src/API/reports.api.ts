import { get, ResponseBody } from "./config/fetch.api";

export type Currency = {
  amount: number;
  currency: string;
};

export type MonthlyData = {
  date: string;
  incomeBeforeTax: Currency;
  approvedExpenses: Currency;
  profit: Currency;
};

export type iIncomeExpense = {
  totalProfit: Currency;
  monthlyData: MonthlyData[];
}
export interface iIncomeExpenseResponseBody extends ResponseBody {
  data: iIncomeExpense;
}

export const incomeExpense = async (
  yearFilter?: string,
): Promise<iIncomeExpenseResponseBody> =>
  get(Routes.api_reports_income_expense_path({ year_filter: yearFilter }));

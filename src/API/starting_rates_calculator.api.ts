import { get, ResponseBody } from "./config/fetch.api";

export interface iApiResponseBodyPercentage extends ResponseBody {
  data: { percentage: string};
}

export const getStartingEffectiveTaxRate = async (
  selfEmployedIncome: number,
  salaryIncome: number,
  otherIncome: number): Promise<iApiResponseBodyPercentage> =>
  get(Routes.get_starting_effective_tax_rate_starting_rates_calculator_index_path({
    self_employed_income: selfEmployedIncome,
    salary_income: salaryIncome,
    other_income: otherIncome }));

export const getStartingStudentLoanRate = async (
  totalIncome: number): Promise<iApiResponseBodyPercentage> =>
  get(Routes.get_starting_student_loan_rate_starting_rates_calculator_index_path({
    total_income: totalIncome }));

export const getStartingLeviesRate = async (
  totalIncome: number): Promise<iApiResponseBodyPercentage> =>
  get(Routes.get_starting_levies_rate_starting_rates_calculator_index_path({
    total_income: totalIncome }));

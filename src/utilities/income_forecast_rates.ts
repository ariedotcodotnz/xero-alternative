/* eslint-disable xss/no-mixed-html */
import { getIncomeEstimate } from "./income_estimates";
import formatToLocalCurrency from "./currency/currency_format";
import { getUserJurisdictionCode } from "./user_attributes";
import { getStartingEffectiveTaxRate, getStartingStudentLoanRate, getStartingLeviesRate } from "../API/starting_rates_calculator.api";

interface IncomeEstimate {
  selfEmployedIncome: number;
  salaryIncome: number;
  otherIncome: number;
  totalIncome: number;
}

const updateStartingTaxRate = async ({ selfEmployedIncome, salaryIncome, otherIncome }: IncomeEstimate) => {
  const startingIncomeTaxRateField = document.getElementById("starting-income-tax-rate") as HTMLInputElement;

  if (startingIncomeTaxRateField) {
    const {status, data: {percentage}} = await getStartingEffectiveTaxRate(
      selfEmployedIncome,
      salaryIncome,
      otherIncome,
    );

    if (status === "bad_request") {
      return toastr.error("Sorry, we're unable to estimate your starting tax rate right now");
    }

    startingIncomeTaxRateField.innerText = percentage;
  }
}

const updateStartingStudentLoanRate = async (totalIncome: number) => {
  const startingStudentLoanRateField = document.getElementById("starting-student-loan-rate") as HTMLInputElement;

  if (startingStudentLoanRateField) {

    const {status, data: {percentage}} = await getStartingStudentLoanRate(
      totalIncome
    );

    if (status === "bad_request") {
      return toastr.error("Sorry, we're unable to estimate your starting student loan rate right now");
    }

    startingStudentLoanRateField.innerText = percentage;
  }
}

const updateStartingLeviesRate = async (totalIncome: number) => {
  const startingLeviesRateField = document.getElementById("starting-levies-rate") as HTMLInputElement;

  if (startingLeviesRateField) {

    const {status, data: {percentage}} = await getStartingLeviesRate(
      totalIncome
    );

    if (status === "bad_request") {
      return toastr.error("Sorry, we're unable to estimate your starting rates right now");
    }

    startingLeviesRateField.innerText = percentage;
  }
}

const updateTotalEstimatedIncome = (totalIncome: number) => {
  const totalEstimatedIncome = document.getElementById("confirm-page-total-income") as HTMLInputElement;

  if (totalEstimatedIncome) {
    const formattedIncome = formatToLocalCurrency(
      totalIncome,
      getUserJurisdictionCode(),
      {
        decimals: true,
      },
    );
    totalEstimatedIncome.innerText = formattedIncome;
  };
}

const updateIncomeForecastRates = () => {
  const incomeEstimate: IncomeEstimate = getIncomeEstimate();

  if (incomeEstimate) {
    updateStartingTaxRate(incomeEstimate);
    updateStartingStudentLoanRate(incomeEstimate.totalIncome);
    updateTotalEstimatedIncome(incomeEstimate.totalIncome);
    updateStartingLeviesRate(incomeEstimate.totalIncome);
  }
}

export default updateIncomeForecastRates;

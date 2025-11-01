import formatToLocalCurrency from "./currency/currency_format";

document.addEventListener(("keyup"), function (e) {
  const idsArray = ["self-employed-income-amount", "salary-income-amount", "other-income-amount"];
  if (idsArray.includes(e.target.id)) {
    updateTotalEstimatedIncome();
  }
});

function updateTotalEstimatedIncome() {
  const totalEstimatedIncomeElement = document.getElementById("total-estimated-income");
  const incomeEstimate = getIncomeEstimate();
  if (totalEstimatedIncomeElement && incomeEstimate) {
    const incomeEstimateLocale = totalEstimatedIncomeElement?.dataset?.jsUserLocale;
    // format number to local currency
    const formattedNumber = formatToLocalCurrency(incomeEstimate.totalIncome, incomeEstimateLocale, { decimals: true });
    totalEstimatedIncomeElement.innerText = formattedNumber;
  }
}

function getIncomeEstimate() {
  const selfEmployedInput = document.getElementById("self-employed-income-amount");
  const salaryInput = document.getElementById("salary-income-amount");
  const otherInput = document.getElementById("other-income-amount");

  const selfEmployedIncome = cleanAndParseDollarAmount((selfEmployedInput) ? selfEmployedInput.value : 0);
  const salaryIncome = cleanAndParseDollarAmount((salaryInput) ? salaryInput.value : 0);
  const otherIncome = cleanAndParseDollarAmount((otherInput) ? otherInput.value : 0);
  const totalIncome = selfEmployedIncome + salaryIncome + otherIncome;

  return {
    selfEmployedIncome,
    salaryIncome,
    otherIncome,
    totalIncome,
  };
}

export { getIncomeEstimate };

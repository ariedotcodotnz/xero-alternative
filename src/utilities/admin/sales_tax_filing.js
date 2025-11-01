import { parse, addMonths, subDays, format } from "date-fns";

const addSalesTaxCalculator = (field) => {
  field.addEventListener("change", (event) => {
    const including = document.querySelector(
      `input[name^='${field.dataset.filing}[${field.dataset.amountIncludingSalesTaxField}']`,
    );
    including.value =
      Number(field.value) * field.dataset.salesTaxToAmountIncludingConverter;
  });
};

const addMonthsToStartDateField = (monthsToAdd) => {
  const startDateField = document.getElementById(
    "sales_tax_filing[start_date]",
  );
  const endDateField = document.getElementById("sales_tax_filing[end_date]");

  if (endDateField.value === "") {
    return;
  }

  const startDate = parse(startDateField.value, "dd/MM/yyyy", new Date());
  const newDate = subDays(addMonths(startDate, parseInt(monthsToAdd, 10)), 1);

  const formattedNewDate = format(newDate, "dd/MM/yyyy");
  endDateField.value = formattedNewDate;
};

document.addEventListener("turbolinks:load", () => {
  document
    .querySelectorAll(".calculates-sales-tax")
    .forEach((field) => addSalesTaxCalculator(field));

  $(document).on("change", "#sales_tax_filing_frequency", (e) => {
    addMonthsToStartDateField(e.target.value);
  });
});

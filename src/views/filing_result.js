$(document).on("change", "#filing_obligation_expected_residual_tax", function () {
  $(this).val($(this).val().replace(/[^\d.]/g, ""));
});

function handleResultChange() {
  if ($("#result_Zero:checked").val()) {
    $("#filing_obligation_expected_residual_tax").attr("disabled", true);
    $("#filing_obligation_expected_residual_tax").val(0.00);
  } else {
    $("#filing_obligation_expected_residual_tax").attr("disabled", false);
  }
}

$("#dialog").on("shown.bs.modal", function () {
  handleResultChange();
});

function handleBalanceChange() {
  const atoBalance = document.querySelector("#ato-activity-statement-balance");

  if (atoBalance.value > 0 && document.querySelector("#balance_Credit").checked) {
    atoBalance.value = -1 * atoBalance.value;
  } else if (atoBalance.value < 0 && document.querySelector("#balance_Debit").checked) {
    atoBalance.value = -1 * atoBalance.value;
  }
}

function handleOutcomeResultChange() {
  const outcomeResult = document.querySelector("#tax-return-result");

  if (outcomeResult.value > 0 && document.querySelector("#result_Refund").checked) {
    outcomeResult.value = -1 * outcomeResult.value;
  } else if (outcomeResult.value < 0 && document.querySelector("#result_Bill").checked) {
    outcomeResult.value = -1 * outcomeResult.value;
  } else if (document.querySelector("#result_Zero").checked) {
    outcomeResult.value = "0.00";
    document.querySelector("#tax-return-result-pretty").value = "$0.00";
  }
}

$(document).on("input", "#ato-activity-statement-balance", () => {
  handleBalanceChange();
});

$(document).on("input", "#tax-return-result", () => {
  handleOutcomeResultChange();
});

$(document).on("change", ".filing-result-radio-buttons", () => {
  handleResultChange();
});

$(document).on("change", ".ato-balance-radio-buttons", () => {
  handleBalanceChange();
});

$(document).on("change", ".third-party-outcome-radio-buttons", () => {
  handleOutcomeResultChange();
});

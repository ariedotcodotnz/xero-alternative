import { activityStatementSubscribe as adminPrefillSubscribe } from "../admin_channels/ato_prefill_channel";

document.addEventListener("turbolinks:load", () => {
  document.querySelectorAll("#outside_hnry").forEach((toggle) => {
    toggle.addEventListener("change", (event) => {
      if (!event.target.checked) {
        form = document.getElementById("outside-hnry-form");
        form.querySelectorAll("input.currency_field_formatting").forEach((input) => {
          hiddenInput = document.getElementById(input.dataset.inputId);
          input.value = "$0.00";
          hiddenInput.value = 0;
        });

        form.dispatchEvent(new Event("submit", { bubbles: true }));
      }
    });
  });
});

document.addEventListener("turbolinks:load", () => {
  document.querySelectorAll(".ato-balance-direction").forEach((radio) => {
    radio.addEventListener("change", setSignOfAtoBalance);
  });
});

document.addEventListener("turbolinks:load", () => {
  document.querySelectorAll("#signed-ato-balance").forEach((atoBalanceInput) => {
    atoBalanceInput.addEventListener("input", setSignOfAtoBalance);
  });
});

$(document).on("change", "#activity_statement_gst_required", (event) => {
  showHideChangingUserSalesTaxAlert(event.target.checked);

  changeRequirednessForSelectors(event.currentTarget.checked, ["[name='activity_statement\[gst_obligation\]\[frequency\]']", "[name='activity_statement\[gst_obligation\]\[period_start\]']", "[name='activity_statement\[gst_obligation\]\[period_end\]']"]);
});

$(document).on("change", "#activity_statement_payg_withholding", (event) => {
  changeRequirednessForSelectors(event.currentTarget.checked, ["[name='activity_statement\[payg_withholding_obligation\]\[frequency\]']", "[name='activity_statement\[payg_withholding_obligation\]\[period_start\]']", "[name='activity_statement\[payg_withholding_obligation\]\[period_end\]']"]);
});

$(document).on("change", "#activity_statement_payg_instalments", (event) => {
  changeRequirednessForSelectors(event.currentTarget.checked, ["[name='activity_statement\[payg_instalment_obligation\]\[frequency\]']", "[name='activity_statement\[payg_instalment_obligation\]\[period_start\]']", "[name='activity_statement\[payg_instalment_obligation\]\[period_end\]']"]);
});

const setSignOfAtoBalance = () => {
  const atoBalanceToSubmit = document.querySelector("#signed-ato-balance");
  if (atoBalanceToSubmit.value > 0 && document.querySelector(".ato-balance-direction:checked").value === "credit") {
    atoBalanceToSubmit.value = -1 * atoBalanceToSubmit.value;
  } else if (atoBalanceToSubmit.value < 0 && document.querySelector(".ato-balance-direction:checked").value === "debit") {
    atoBalanceToSubmit.value = -1 * atoBalanceToSubmit.value;
  } else if (atoBalanceToSubmit.value === "") {
    atoBalanceToSubmit.value = 0;
  }
};

function showHideChangingUserSalesTaxAlert(gstSelected) {
  const userSalesTax = $("#original_sales_tax_registration").data("original-sales-tax-registration");

  if (userSalesTax != null && userSalesTax != gstSelected) {
    $(".overriding-sales-tax-registration-status").show();
  } else {
    $(".overriding-sales-tax-registration-status").hide();
  }
}

const changeRequirednessForSelectors = function (requiredness, selectors) {
  selectors.forEach(function (selector) {
    const selectedElement = $(selector);
    if (requiredness) {
      selectedElement.prop("required", true);
    } else {
      selectedElement.removeProp("required");
      selectedElement.val(null);
    }
  });
};

const refreshPrefillBtn = document.querySelector("#refresh-activity-statement-button");
if (refreshPrefillBtn) {
  refreshPrefillBtn.addEventListener("click", (event) => event.target.value = "Loading...");
  const activityStatementId = refreshPrefillBtn.dataset.activityStatementId;

  adminPrefillSubscribe(activityStatementId, (data) => {
    if (data.success) {
      refreshPrefillBtn.value = "Request complete. Reloading page...";
      window.location.reload();
    } else {
      const errorMsg = document.createElement("div");
      errorMsg.className = "alert alert-danger";
      errorMsg.innerText = "Request failed. ";
      if (data.error) {
        errorMsg.innerText += data.error;
      }
      document.querySelector("#prefill-messages").appendChild(errorMsg);
    }
  });
}
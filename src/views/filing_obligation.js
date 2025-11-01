import { subscribe } from "../admin_channels/xero_prefill_channel";
import { filingObligationSubscribe as adminPrefillSubscribe } from "../admin_channels/ato_prefill_channel";
import { subscribe as userPrefillSubscribe } from "../channels/ato_prefill_channel";

document.addEventListener("turbolinks:load", function () {
  $(document).on("click", "#filing_obligation_data_source_attributes_current_self_employment", function (e) {
    $.ajax({
      type: "PATCH",
      url: $(this).data("form-route"),
      data: {
        filing_obligation: {
          data_source_attributes: {
            current_self_employment: $("#filing_obligation_data_source_attributes_current_self_employment").prop("checked"),
            id: $(this).data("data-source-id"),
          },
        },
      },
    });
  });

  initializeFormDisabledButtons();

  $(document).on("click", "#edit-refund-bank-account", function () {
    $("#refund-bank-account-fields").removeClass("hidden");
    $("#refund-bank-account").hide();
  });

  $(".xero-prefill-status").each((index, statusBox) => {
    subscribe($(statusBox).data("filingObligationId"), (data) => {
      // eslint-disable-next-line xss/no-mixed-html
      $(statusBox).html($(data.html).html());
    });
  });

  const loadingPrefillAlert = document.querySelector("#loading-prefill-alert");
  if (loadingPrefillAlert) {
    const prefillUserWarnings = document.querySelector("#prefill-warnings__container");
    const { filingObligationId, disableWhileLoadingPrefill } = loadingPrefillAlert.dataset;

    const disabledElements = document.querySelectorAll(disableWhileLoadingPrefill);
    disabledElements.forEach((e) => {
      e.classList.add("disabled-while-loading");
    });

    // Disable any buttons which are not currently disabled and have the appropriate class
    const buttons = document.querySelectorAll(".hnry-button.disable-when-refreshing-prefill:not([disabled])");
    buttons.forEach((b) => { b.disabled = true; })

    userPrefillSubscribe(filingObligationId, (data) => {
      loadingPrefillAlert.classList.add("hidden");
      if(prefillUserWarnings) { prefillUserWarnings.classList.remove("disabled-while-loading"); }
      disabledElements.forEach((e) => {
        e.classList.remove("disabled-while-loading");
      });

      // Re-enable any buttons disabled earlier
      buttons.forEach((b) => { b.disabled = false; })

      if (data.success) {
        if(prefillUserWarnings) { prefillUserWarnings.innerHTML = data.html; }
        initializeFormDisabledButtons();
      }

      if (data.error === "DELINKED") {
        if(prefillUserWarnings) { prefillUserWarnings.classList.add("hidden"); }
        document.querySelector("#delinked-message").classList.remove("hidden");
      } else {
        const prefillCompleteCheck = document.querySelector("#prefill_complete");
        if (prefillCompleteCheck) {
          prefillCompleteCheck.checked = true;
          flipSubmit(document.querySelector("#confirm-details-filing-form"));
        }
      }
    });
  }

  const refreshPrefillBtn = document.querySelector("#refresh-prefill-button");
  if (refreshPrefillBtn) {
    refreshPrefillBtn.addEventListener("click", (event) => event.target.value = "Loading...");
    const {filingObligationId} = refreshPrefillBtn.dataset;

    adminPrefillSubscribe(filingObligationId, (data) => {
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
});

const onChangeOfResult = () => {
  const resultOptionElements = document.querySelectorAll(".result-select");

  resultOptionElements.forEach((resultOptionElement) => {
    resultOptionElement.addEventListener("change", (event) => {
      event.preventDefault();

      const selectedValue = document.querySelector("input[name = result]:checked").value;
      const {filingObligationId} = document.querySelector("#email-modal").dataset;

      $.rails.ajax({
        type: "GET",
        url: Routes.update_filing_result_modal_admin_filing_obligation_path(filingObligationId),
        data: { selected_value: selectedValue },
        success: refreshModal,
      });
      return false;
    });
  });
};

const refreshModal = (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, "text/html");
  const newModal = doc.querySelector("#email-modal");
  const oldModal = document.querySelector("#email-modal");
  oldModal.parentNode.replaceChild(newModal, oldModal);
};

$(document).on("ajaxSuccess", onChangeOfResult);

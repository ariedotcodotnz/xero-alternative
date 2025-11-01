import { subscribe } from "../channels/receipt_scanning_channel";

function handleReceiptScanning() {
  $(".start-receipt-scanning").each((_, button) => {
    subscribe($(button).data("expense-id"), (data) => {
      if (!document.getElementsByClassName("stop-receipt-scanning").disabled) {
        $(document.getElementsByClassName("stop-receipt-scanning")).trigger("click");
        document.dispatchEvent(new CustomEvent("expenses-scan-completed", { detail: { expenseDate: data.expense_date } }));
        if (data.gst_inclusive_cost != null) {
          document.getElementById("expense_gst_inclusive_cost").value = data.gst_inclusive_cost;
        }
        if (data.includes_gst) {
          document.getElementById("expense_includes_gst_true").click();
          document.getElementById("expense_gst_amount").value = data.gst_amount;
        }
      }
    });
  });
}

function handleReceiptUpload() {
  const nextButton = document.querySelector("[data-handle-receipt-change]");

  if (!nextButton) { return; }

  const receiptUploadStartedField = document.querySelector("input[name='expense[changed_receipt_upload_started]']");

  const setReceiptUploadField = () => {
    if (receiptUploadStartedField) {
      receiptUploadStartedField.value = true;
    }
  };

  nextButton.removeEventListener("click", setReceiptUploadField);
  nextButton.addEventListener("click", setReceiptUploadField);
}

document.addEventListener("turbolinks:load", function () {
  $(document).on("next.bs.modal", "#dialog", () => {
    handleReceiptUpload();
    handleReceiptScanning();
  });
});

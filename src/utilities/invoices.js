// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

const toggleMobileActionMenu = require("./ellipsis_menus").toggleMobileActionMenu;

function scaleInvoicePreviewEvent() {
  $(document).on("shown.bs.modal", function () {
    windowWidth = $("#modal-preview-invoice .body-preview").width();
    elementWidth = $("#modal-preview-invoice #inv-tmpl").width();
    scale = windowWidth / elementWidth;
    $("#modal-preview-invoice #inv-tmpl").css({
      transform: `scale(${scale})`,
    });
    $("#modal-preview-invoice .modal-body").css({
      height: $("#modal-preview-invoice .inv-tmpl").height() * scale,
    });
  });
}

function togglePaidDirectInvoiceWarning() {
  $(document).on("change", ".edit_invoice input[name='status']", function () {
    if ($("#status_PENDING")[0].checked) {
      $("#paid_direct_invoice_warning").collapse("show");
    } else {
      $("#paid_direct_invoice_warning").collapse("hide");
    }
  });
}

function showConfirmationModal() {
  // the modal is only included on the page when we have been redirected to the show action
  // with a 'complete' param
  $("#payment-complete").modal("show");
}

$(document).ready(function () {
  scaleInvoicePreviewEvent();
  togglePaidDirectInvoiceWarning();
  showConfirmationModal();
});

$(window).resize(function () {
  toggleMobileActionMenu();
});

// using turbolinks means that "$(document).ready()" doesn't always fire
document.addEventListener("turbolinks:load", function () {
  toggleMobileActionMenu();
});

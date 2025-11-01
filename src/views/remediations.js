const onFormChange = () => {
  $(document).on("click", ".edit_transaction_reconciliation input[type='select'], input[type='checkbox'], input[type='text'], .clear-input", function (event) {
    const button = $(".edit_transaction_reconciliation :input[type='submit']");
    if (button.hasClass("btn-blue-hnry")) {
      button.removeClass("btn-blue-hnry");
      button.addClass("btn-primary");
      button.val("Save");
      button.data("disable-with", "Saving...");
    }
  });
};

$(document).ready(function () {
  onFormChange();
});

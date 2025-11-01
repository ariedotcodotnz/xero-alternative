$(document).ready(function () {
  $(document).on("change", ".checkbox-enabler", function () {
    enableDisableSubmitButtons(this);
  });

  function enableDisableSubmitButtons(trigger) {
    if ($(trigger).is(":checked")) {
      $(trigger).closest(".modal-content").find(".checkbox-enable-disable").each(function () {
        $(this).prop("disabled", false);
      });
    } else {
      $(trigger).closest(".modal-content").find(".checkbox-enable-disable").each(function () {
        $(this).prop("disabled", true);
      });
    }
  }
});

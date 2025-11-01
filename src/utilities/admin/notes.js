function uncheckAutoReconcileBlocking() {
  $(document).on("change", "#note_supplementary_user_show_on_reconciliation", () => {
    if (!$("#note_supplementary_user_show_on_reconciliation").is(":checked")) {
      $("#note_supplementary_user_block_auto_reconciliation").prop("checked", false);
    }
  });
}

document.addEventListener("turbolinks:load", function () {
  uncheckAutoReconcileBlocking();
});

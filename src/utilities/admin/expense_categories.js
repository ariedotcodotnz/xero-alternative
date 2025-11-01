function autoPopulatePlatformCode() {
  $(document).on("change", "#expense_category_name", () => {
    const persisted = $("#expense_category_platform_code").prop("readonly");
    const jurisdictionCode = $("#expense_category_name").data("jurisdiction-code");

    if (!persisted) {
      const platformCode = `${$("#expense_category_name").val().toLowerCase().replace(/ /g, "-")
        .replace(/[^a-z\d-]/g, "")}-${jurisdictionCode}`;
      $("#expense_category_platform_code").val(platformCode);
    }
  });
}

$(document).on("turbolinks:load", function () {
  autoPopulatePlatformCode();
});

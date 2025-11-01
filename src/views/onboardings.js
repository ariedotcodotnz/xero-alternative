import { subscribe } from "../admin_channels/payor_declared_income_channel";

$(document).on("click", ".no_income_account_available", function () {
  if ($(this).is(":checked")) {
    const onboardingPendingRoute = $(this).data("onboarding-pending-route");
    $.ajax({
      type: "POST",
      url: onboardingPendingRoute,
    });
    $(this).attr("disabled", true);
  } else {
    const updateRoute = $(this).data("update-route");
    $.ajax({
      type: "PATCH",
      url: updateRoute,
    });
  }
});

document.addEventListener("turbolinks:load", function () {
  function callCustomerApi() {
    const input = document.querySelector("#onboarding_jurisdiction_fields_attributes_linked_to_agency");
    $.ajax({
      type: "PATCH",
      url: input.dataset.customerInfoRoute,
    });
  }

  function callPayorApi() {
    const payorRoute = $(this).data("payor-income-route");
    $.ajax({
      type: "GET",
      url: payorRoute,
    })
  }

  $(document).on("click", ".refresh-bic-code", () => {
    callCustomerApi();
  });

  $(document).on("change", ".tax_agency_link", function () {
    if ($(this).is(":checked")) {
      const input = document.querySelector("#onboarding_jurisdiction_fields_attributes_linked_to_agency");
      $.ajax({
        type: "POST",
        url: input.dataset.irdBankAccountRoute,
      }).then(() => {
        callPayorApi();
      }).then(()=> {
        callCustomerApi();
      });
    }
  });

  function updateAdminAndTime(trigger) {
    const admin_id = $("#current_admin_id").val();
    const time = new Date().toLocaleString("en-GB");
    const target = $(trigger).attr("id");

    if ($(trigger).is(":checked")) {
      $(`#admin_user_id_${target}`).val(admin_id);
      $(`#completed_at_${target}`).val(time);
    } else {
      $(`#admin_user_id_${target}`).val("");
      $(`#completed_at_${target}`).val("");
    }
  }

  $(".payor-declared-income-info").each((index, infoBox) => {
    subscribe($(infoBox).data("userId"), (data) => {
      // eslint-disable-next-line xss/no-mixed-html
      $(infoBox).html($(data.html).html());
    });
  });
});

import {
  toggleMobileActionMenu,
} from "./ellipsis_menus";

const BILLER_CODE = "biller_code";
const CRN = "crn";
const NOT_VALID = "not-valid";
const VALID = "valid";
const NO_VALUE = "no-value";

$(document).on("keyup", "#allocationTemplateSearchInput", function () {
  const input = document.getElementById("allocationTemplateSearchInput");
  const filter = input.value.toUpperCase().trim();

  $(".allocation-card").each(function (_, element) {
    const txtValue = element.id.toUpperCase().replaceAll("_", " ");

    if (txtValue.indexOf(filter) > -1) {
      $(element).css("display", "flex");
    } else {
      $(element).css("display", "none");
    }
  });
});

$(document).on("blur", "#allocation_preference_bpay_biller_code", function (event) {
  normalizeBPAYBillerCode();
  validateBPAYCRN();
  validateBPAYBillerCode();
});

$(document).on("blur", "#allocation_preference_bpay_crn", function (event) {
  normalizeBPAYCRN();
  validateBPAYCRN();
  validateBPAYBillerCode();
});

// using turbolinks means that "$(document).ready()" doesn't always fire
document.addEventListener("turbolinks:load", function () {
  toggleMobileActionMenu();
});


// run BPAY field validation when the 'BPAY Payment' toggle is toggled on, but (re)enable the submit button if it is toggled off
$(document).on("change", "#allocation_preference_for_bpay", function () {
  if ($("#allocation_preference_for_bpay").prop("checked")) {
    toggleSaveButtonState();
    normalizeBPAYBillerCode();
    normalizeBPAYCRN();
    validateBPAYBillerCode();
    validateBPAYCRN();
    toggleReferenceLabel();
  } else {
    toggleReferenceLabel();
    $("#allocation-preference-form-submit").attr("disabled", false);
    $("#bpay-minimum-maximum-amounts-warning").addClass("hidden");
  }
});

// when BPAY toggle is on, the label should be "Description"
function toggleReferenceLabel() {
  const ref = $("label[for='allocation_preference_payee_reference']");

  if ($("#allocation_preference_for_bpay").prop("checked")) {
    ref.attr("data-original-label", ref.text());
    ref[0].innerHTML = "Description";
  } else {
    // eslint-disable-next-line xss/no-mixed-html
    ref[0].innerHTML = ref.data("original-label");
  }
}

$(window).resize(function () {
  toggleMobileActionMenu();
});

$(document).on("change", "#allocation_preference_cap", function () {
  if ($("#allocation_preference_cap_frequency").val() == "") {
    $("#allocation_preference_cap_frequency").val("In total");
    $("#allocation_preference_cap_frequency").siblings("input").val("In total");
  }
});

function normalizeBPAYBillerCode() {
  const billerCode = $("#allocation_preference_bpay_biller_code").val();
  $("#allocation_preference_bpay_biller_code").val(billerCode.replace(/[^0-9]/g, ""));
}

function normalizeBPAYCRN() {
  const customer_reference_number = $("#allocation_preference_bpay_crn").val();
  $("#allocation_preference_bpay_crn").val(customer_reference_number.replace(/[^0-9]/g, ""));
}

function validateBPAYBillerCode() {
  $("#bpay-minimum-maximum-amounts-warning").addClass("hidden");
  if ($("#allocation_preference_bpay_biller_code").val() != "") {
    $.rails.ajax({
      type: "GET",
      url: Routes.validate_bpay_biller_code_allocation_preferences_path(),
      data: {
        bpay_biller_code: $("#allocation_preference_bpay_biller_code").val(),
      },
      success(data) {
        $("#allocation_preference_bpay_biller_code").attr("valid", data.valid);
        if (data.valid) {
          toggleBPAYIconValidity(BILLER_CODE, VALID);
          toggleBPAYInputValidity(BILLER_CODE, VALID);
          updateBPAYMinimumMaximumWarningText(data.biller_name, data.minimum_payment_amount);
          updateMinimumAndMaximumPaymentHiddenFields(data.minimum_payment_amount, data.maximum_payment_amount);
        } else {
          toggleBPAYIconValidity(BILLER_CODE, NOT_VALID);
          toggleBPAYInputValidity(BILLER_CODE, NOT_VALID);
        }
        toggleSaveButtonState();
        toggleBPAYMinimumMaximumWarning();
      },
      error() {
        toastr.error("We could not validate your BPAY Biller Code, please try again in a moment");
        toggleBPAYIconValidity(BILLER_CODE, NOT_VALID);
        toggleBPAYInputValidity(BILLER_CODE, NOT_VALID);
      },
    });
  } else {
    toggleBPAYIconValidity(BILLER_CODE, NO_VALUE);
    toggleBPAYInputValidity(BILLER_CODE, NO_VALUE);
  }
}

function validateBPAYCRN() {
  if (($("#allocation_preference_bpay_crn").val() != "") && $("#allocation_preference_bpay_biller_code").val() != "") {
    $.rails.ajax({
      type: "GET",
      url: Routes.validate_bpay_crn_allocation_preferences_path(),
      data: {
        bpay_biller_code: $("#allocation_preference_bpay_biller_code").val(),
        bpay_crn: $("#allocation_preference_bpay_crn").val(),
      },
      success(data) {
        $("#allocation_preference_bpay_crn").attr("valid", data.valid);
        if (data.valid) {
          toggleBPAYIconValidity(CRN, VALID);
          toggleBPAYInputValidity(CRN, VALID);
        } else {
          toggleBPAYIconValidity(CRN, NOT_VALID);
          toggleBPAYInputValidity(CRN, NOT_VALID);
        }
        toggleSaveButtonState();
        toggleBPAYMinimumMaximumWarning();
      },
      error() {
        toastr.error("We could not validate your BPAY CRN, please try again in a moment");
        toggleBPAYIconValidity(CRN, NOT_VALID);
        toggleBPAYInputValidity(CRN, NOT_VALID);
      },
    });
  } else {
    toggleBPAYIconValidity(CRN, NO_VALUE);
    toggleBPAYInputValidity(CRN, NO_VALUE);
  }
}

function toggleSaveButtonState() {
  const bpayBillerCodeValid = (($("#allocation_preference_bpay_biller_code")).attr("valid") === "true");
  const bpayCrnValid = (($("#allocation_preference_bpay_crn").attr("valid")) === "true");
  const editable = $("#allocation_preference_locked")[0].value != "true";
  if (bpayBillerCodeValid && bpayCrnValid && editable) {
    $("#allocation-preference-form-submit").attr("disabled", false);
  } else {
    $("#allocation-preference-form-submit").attr("disabled", true);
  }
}

function toggleBPAYIconValidity(bpayField, validity) {
  // hide all 3 icons then show the correct one
  const bpayFieldIconClassSelector = `.bpay-${bpayField}-icon`;
  $(bpayFieldIconClassSelector).addClass("hidden");
  $(`#bpay-${bpayField}-${validity}-icon`).removeClass("hidden");
}

function toggleBPAYInputValidity(bpayField, validity) {
  const bpayFieldInputSelector = `#allocation_preference_bpay_${bpayField}`;
  $(bpayFieldInputSelector).removeClass("valid")
  $(bpayFieldInputSelector).removeClass("hnry-input--invalid")

  $(bpayFieldInputSelector).attr("valid", false);
  switch (validity) {
    case VALID:
      $(bpayFieldInputSelector).addClass("valid");
      $(bpayFieldInputSelector).attr("valid", true);
      break;
    case NOT_VALID:
      $(bpayFieldInputSelector).addClass("hnry-input--invalid");
      break;
  }
}

function toggleBPAYMinimumMaximumWarning(){
  const bpayBillerCodeValid = (($("#allocation_preference_bpay_biller_code")).attr("valid") === "true");
  const bpayCrnValid = (($("#allocation_preference_bpay_crn").attr("valid")) === "true");
  if (bpayBillerCodeValid && bpayCrnValid) {
    $("#bpay-minimum-maximum-amounts-warning").removeClass("hidden");
  }
}

function updateMinimumAndMaximumPaymentHiddenFields(minimumPaymentAmount, maximumPaymentAmount) {
  $("#allocation_preference_bpay_minimum_payment").val(Number(minimumPaymentAmount.replace(/[^0-9\.]+/g, "")));
  $("#allocation_preference_bpay_maximum_payment").val(Number(maximumPaymentAmount.replace(/[^0-9\.]+/g, "")));
}

function updateBPAYMinimumMaximumWarningText(billerName, minimumPaymentAmount) {
  $("#bpay-minimum-maximum-amounts-warning #bpay-alert-body").text(
    `These allocation payments will be sent to ${billerName}. Their minimum payment amount is ${minimumPaymentAmount}. Any payments below that amount will be sent to your personal bank account instead.`
  );

}

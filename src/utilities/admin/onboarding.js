// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

function toggleMinimumPaymentCriteriaAlert() {
  $(document).on("change", ".toggles-minimum-payment-criteria-alert", () => {
    showHideMinimumPaymentCriteriaAlert();
  });
}

function showHideMinimumPaymentCriteriaAlert() {
  const canProcessPaymentsOverride = $("#can-process-payments").html() !== undefined;
  const linkedToAgencyCheck = $(document.querySelector("#onboarding_jurisdiction_fields_attributes_linked_to_agency")).is(":checked") || $(document.querySelector("#user_onboarding_pending_linking")).is(":checked")
  const gstAccount = $(document.querySelector("#onboarding_jurisdiction_fields_attributes_gst_account_yes")).is(":checked")
    || $(document.querySelector("#onboarding_jurisdiction_fields_attributes_gst_account_no")).is(":checked")
    || $(document.querySelector("#onboarding_jurisdiction_fields_attributes_gst_account_previously_registered")).is(":checked");
  const vatAccount = $(document.querySelector("#onboarding_jurisdiction_fields_attributes_vat_account_yes")).is(":checked")
    || $(document.querySelector("#onboarding_jurisdiction_fields_attributes_vat_account_no")).is(":checked")
    || $(document.querySelector("#onboarding_jurisdiction_fields_attributes_vat_account_previously_registered")).is(":checked");
  const studentLoan = $(document.querySelector("#onboarding_jurisdiction_fields_attributes_student_loan_account_true")).is(":checked")
    || $(document.querySelector("#onboarding_jurisdiction_fields_attributes_student_loan_account_false")).is(":checked");

  if (canProcessPaymentsOverride || (linkedToAgencyCheck && (gstAccount || vatAccount) && studentLoan)) {
    $("#minimum-payment-processing-criteria-alert").hide();
  } else {
    $("#minimum-payment-processing-criteria-alert").show();
  }
}

function fetchUserDetailsFromAto() {
  $(document).on("change", "#onboarding_jurisdiction_fields_attributes_linked_to_agency", () => {
    const linkedToAgencyCheck = $(document.querySelector("#onboarding_jurisdiction_fields_attributes_linked_to_agency")).is(":checked");
    const auJurisdiction = document.body.getAttribute("data-jurisdiction-code") === "au"

    if (linkedToAgencyCheck && auJurisdiction) {
      const onboardingId = document.getElementById("onboarding-id").value
      const animation = $(document.getElementById("ato-linked-info"))

      $.rails.ajax({
        type: "GET",
        url: Routes.admin_onboardings_fetch_user_details_from_ato_path(),
        data: {
          id: onboardingId,
        },
        beforeSend() {
          animation.show()
        },
        success(data) {
          document.getElementById("au_financial_income_tax_payment_reference_number").value = data.income_tax_prn
          document.getElementById("au_financial_sales_tax_payment_reference_number").value = data.activity_statement_prn
          toastr.success("PRNs fetched from ATO")
        },
        complete() {
          animation.hide();
        },
      }).fail(r => {
        document.getElementById("au_financial_income_tax_payment_reference_number").value = r.responseJSON.data.income_tax_prn
        document.getElementById("au_financial_sales_tax_payment_reference_number").value = r.responseJSON.data.activity_statement_prn
        toastr.error(r.responseJSON.errors)
      });
    }
  });
}

function toggleChangingUserSpecifiedSalesTaxAlert() {
  $(document).on("change", ".toggles-changing-user-specified-sales-tax-alert", () => {
    showHideChangingUserSalesTaxAlert();
  });
}

function showHideChangingUserSalesTaxAlert() {
  const userSalesTax = $("#original_sales_tax_registration").data("original-sales-tax-registration");
  let adminSalesTaxAccount = "";

  if ($(document.querySelector("#onboarding_jurisdiction_fields_attributes_gst_account_yes")).is(":checked")
    || $(document.querySelector("#onboarding_jurisdiction_fields_attributes_vat_account_yes")).is(":checked")) {
    adminSalesTaxAccount = "yes";
  } else if ($(document.querySelector("#onboarding_jurisdiction_fields_attributes_gst_account_no")).is(":checked")
    || $(document.querySelector("#onboarding_jurisdiction_fields_attributes_gst_account_previously_registered")).is(":checked")
    || $(document.querySelector("#onboarding_jurisdiction_fields_attributes_vat_account_no")).is(":checked")
    || $(document.querySelector("#onboarding_jurisdiction_fields_attributes_vat_account_previously_registered")).is(":checked")) {
    adminSalesTaxAccount = "no";
  }

  if (userSalesTax != "" && adminSalesTaxAccount != "" && userSalesTax != adminSalesTaxAccount) {
    $(".overriding-sales-tax-registration-status").show();
  } else {
    $(".overriding-sales-tax-registration-status").hide();
  }
}

function toggleChangingUserSpecifiedStudentLoanAlert() {
  $(document).on("change", ".toggles-changing-user-specified-student-loan-alert", () => {
    showHideChangingUserStudentLoanAlert();
  });
}

function showHideChangingUserStudentLoanAlert() {
  const userStudentLoan = $("#original_student_loan_registration").data("original-student-loan-registration");
  let adminStudentLoanAccount = "";

  if ($(document.querySelector("#onboarding_jurisdiction_fields_attributes_student_loan_account_true")).is(":checked")) {
    adminStudentLoanAccount = true;
  } else if ($(document.querySelector("#onboarding_jurisdiction_fields_attributes_student_loan_account_false")).is(":checked")) {
    adminStudentLoanAccount = false;
  }

  if (adminStudentLoanAccount !== "" && adminStudentLoanAccount != userStudentLoan) {
    $(".overriding-student-loan-registration-status").show();
  } else {
    $(".overriding-student-loan-registration-status").hide();
  }
}

$(document).ready(function () {
  showHideMinimumPaymentCriteriaAlert();
  fetchUserDetailsFromAto();
});

document.addEventListener("turbolinks:load", function () {
  showHideMinimumPaymentCriteriaAlert();
  toggleMinimumPaymentCriteriaAlert();
  toggleChangingUserSpecifiedSalesTaxAlert();
  toggleChangingUserSpecifiedStudentLoanAlert();
});

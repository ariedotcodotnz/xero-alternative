import React, { useState, useEffect, useCallback, useMemo } from "react";
import FooterButtons from "./FooterButtons";
import ScheduleInputs from "./ScheduleInputs";
import {
  createInvoice,
  updateInvoice,
  InvoiceSuccessResponse,
} from "../../API/invoices.api";
import { useInvoiceQuoteContext } from "../invoice_quote/InvoiceQuoteContext";
import InvoicePreviewModal from "./modals/InvoicePreviewModal";
import NotSendingWarning from "../invoice_quote/sections/NotSendingWarning";
import InternationalClientWarning from "../invoice_quote/sections/InternationalClientWarning";
import { removeButtonPopOver } from "../utils/base_helper";
import AdditionalInputs from "./AdditionalInputs";
import { cancelUnsavedChangeAlert, getFormData, visitUrl } from "./helpers";
import I18n from "../../utilities/translations";
import { InvoiceStatusForForm } from "../../types/invoiceForm.type";
import ManageAllocations from "./ManageAllocations";

interface iSettingsAndFooter {
  advancedSettingsOpen: boolean;
  client: string;
  currencySymbol: string;
  depositsNotificationDismissed: boolean;
  handleInvoiceEmailClick: () => void;
  invoiceClientSelected: boolean;
  invoiceStatus: InvoiceStatusForForm;
  isImpersonating: boolean;
  invoiceCanBeSent: boolean;
  showDepositDefault: boolean;
  showManageAllocationsAccordion: boolean;
}

const SettingsAndFooter = ({
  client,
  currencySymbol,
  depositsNotificationDismissed,
  handleInvoiceEmailClick,
  invoiceClientSelected,
  invoiceStatus,
  isImpersonating = false,
  invoiceCanBeSent,
  showDepositDefault,
  showManageAllocationsAccordion,
}: iSettingsAndFooter) => {
  const [disabledSave, setDisabledSave] = useState<boolean>(false);
  const [invoiceDateInvalidText, setInvoiceDateInvalidText] =
    useState<string>("");
  const [dueDateInvalidText, setDueDateInvalidText] = useState<string>("");
  const [dateInvalidText, setDateInvalidText] = useState<string>("");
  const [timeInvalidText, setTimeInvalidText] = useState<string>("");
  const [periodDateInvalidText, setPeriodDateInvalidText] =
    useState<string>("");
  const [showDeposit, setShowDeposit] = useState(showDepositDefault);

  const {
    comments,
    dueDate,
    deposit,
    endDate,
    invoiceDate,
    invoiceTotalIncludingSalesTax,
    poNumber,
    scheduleDate,
    scheduleTime,
    setComments,
    setDueDate,
    setDeposit,
    setEndDate,
    setInvoiceDate,
    setPoNumber,
    setScheduleDate,
    setScheduleTime,
    setStartDate,
    startDate,
    otherProps,
    setOtherProps,
    grandTotal,
    lineItems,
    untaxedDepositAccepted,
    invoiceObject,
    setInvoiceObject,
    setLineItems,
    setRemovedLineItems,
    internationalClient
  } = useInvoiceQuoteContext();

  const handlePhoneNumber = (value) => {
    setOtherProps({
      ...otherProps,
      hide_phone_number: value,
    });
  };

  // Ticking off all the different requirements for the Next button to be enabled/disabled
  const requiredDatesValid = useCallback(
    () =>
      invoiceDateInvalidText.length === 0 && dueDateInvalidText.length === 0,
    [invoiceDateInvalidText, dueDateInvalidText],
  );

  const periodDatesValid = useCallback(
    () => periodDateInvalidText.length === 0,
    [periodDateInvalidText],
  );

  const datesTimesValid = useCallback(
    () => dateInvalidText.length === 0 && timeInvalidText.length === 0,
    [dateInvalidText, timeInvalidText],
  );

  const lineItemsValid = useCallback(() => {
    const nonEmptyLineItems = lineItems.filter(
      (item) => item.updated_name !== "" && item.total !== 0,
    );

    return nonEmptyLineItems.length > 0;
  }, [lineItems]);

  const grandTotalValid = useCallback(
    () => grandTotal !== 0 || (grandTotal === 0 && lineItemsValid()),
    [grandTotal, lineItemsValid],
  );

  const untaxedDepositValid = useCallback(
    () =>
      (showDeposit &&
        Number(deposit) > 0 &&
        untaxedDepositAccepted &&
        Number(deposit) <= grandTotal) ||
      !showDeposit,
    [showDeposit, deposit, untaxedDepositAccepted, grandTotal],
  );

  // Compose error messages, when there are
  const composedPopoverMessage = useMemo(() => {
    const ctx = { scope: "invoices.form", currency: currencySymbol };
    const messages = {
      grandTotal: I18n.t("grand_total_invalid_tooltip", ctx),
      untaxedDeposit: I18n.t("invoices.form.untaxed_deposit_consent_tooltip"),
      untaxedDepositTotal: I18n.t("untaxed_deposit_total_tooltip", ctx),
      untaxedDepositTotalTooBig: I18n.t(
        "untaxed_deposit_total_too_big_warning",
        ctx,
      ),
      clientNotValid: I18n.t("invoices.invalid.update_client"),
    };

    const compMessage = [];

    // Check for specific errors
    if (!grandTotalValid()) {
      compMessage.push(messages.grandTotal);
    }
    if (!untaxedDepositValid()) {
      if (deposit <= 0) {
        compMessage.push(messages.untaxedDepositTotal);
      }
      if (deposit > grandTotal) {
        compMessage.push(messages.untaxedDepositTotalTooBig);
      }
      if (!untaxedDepositAccepted) {
        compMessage.push(messages.untaxedDeposit);
      }
    }
    if (!invoiceCanBeSent) {
      compMessage.push(messages.clientNotValid);
    }
    // Return the messages with line breaks
    return compMessage.join("<br/>");
  }, [
    currencySymbol,
    deposit,
    grandTotalValid,
    untaxedDepositAccepted,
    untaxedDepositValid,
  ]);

  useEffect(() => {
    if (
      requiredDatesValid() &&
      periodDatesValid() &&
      datesTimesValid() &&
      invoiceTotalIncludingSalesTax >= 0 &&
      grandTotalValid() &&
      untaxedDepositValid() &&
      invoiceCanBeSent
    ) {
      setDisabledSave(false);
    } else if (
      !requiredDatesValid() ||
      !periodDatesValid() ||
      !datesTimesValid() ||
      invoiceTotalIncludingSalesTax < 0 ||
      !grandTotalValid() ||
      !untaxedDepositValid() ||
      !invoiceCanBeSent
    ) {
      setDisabledSave(true);
    }
  }, [
    dateInvalidText,
    timeInvalidText,
    periodDateInvalidText,
    periodDatesValid,
    setDisabledSave,
    invoiceTotalIncludingSalesTax,
    grandTotal,
    lineItems,
    untaxedDepositAccepted,
    deposit,
    showDeposit,
    requiredDatesValid,
    datesTimesValid,
    grandTotalValid,
    untaxedDepositValid,
  ]);

  const updateInvoiceAndLineItemsState = (data) => {
    const { id, line_items: items } = data.invoice;
    setInvoiceObject({ ...invoiceObject, id });
    setLineItems(
      lineItems.map((itm, index) => ({ ...itm, id: items[index].id })),
    );
    setRemovedLineItems([]);
  };

  const redirectToInvoicesPage = () => {
    cancelUnsavedChangeAlert();
    visitUrl(Routes.invoices_path());
  };

  const saveAndTrigger = async (
    callback: () => void,
    resetScheduleDateAndTime: boolean,
  ) => {
    try {
      let formObject = getFormData("form[id*='invoice']");

      // reset when user clicks the send_now button on the schedule date and time warning
      if (resetScheduleDateAndTime) {
        formObject = { ...formObject, schedule_date: "", schedule_time: "" };
      }

      const response = (
        invoiceObject.id === null
          ? await createInvoice(formObject)
          : await updateInvoice(formObject)
      ) as InvoiceSuccessResponse;
      const { status } = response.data;

      if (status === "ok") {
        updateInvoiceAndLineItemsState(response.data);
        cancelUnsavedChangeAlert();
        callback();
      } else {
        toastr.warning(response.data.error);
      }
    } catch (error) {
      if (typeof Rollbar !== "undefined") {
        Rollbar.warning("Unable to save invoice when next button is clicked", {
          error,
        });
      }
      toastr.warning("Error saving invoice", error);
    }
  };

  const handleSaveDraftClick = async () => {
    try {
      const formObject = getFormData("form[id*='invoice']");
      const response = (
        invoiceObject.id === null
          ? await createInvoice(formObject)
          : await updateInvoice(formObject)
      ) as InvoiceSuccessResponse;
      const { status } = response.data;

      if (status === "ok") {
        updateInvoiceAndLineItemsState(response.data);
        cancelUnsavedChangeAlert();
        redirectToInvoicesPage();
      } else {
        toastr.warning(response.data.error);
      }
    } catch (error) {
      if (typeof Rollbar !== "undefined") {
        Rollbar.warning("User unable to save invoice as draft", { error });
      }
      toastr.warning("Error saving invoice", error);
    }
  };

  const openConfirmationModal = () => {
    removeButtonPopOver();
    window.analytics?.track("invoice_email_modal_viewed", "");

    $("#modal-preview-invoice").modal("hide");
    handleInvoiceEmailClick();
  };

  const openPreviewModal = () => {
    $("#modal-preview-invoice").modal("show");
  };

  const handleSendNowClick = (event) => {
    event.preventDefault();
    setScheduleDate("");
    setScheduleTime("");
    setDisabledSave(true);
    saveAndTrigger(openConfirmationModal, true);
  };

  const handleDateInvalidText = (value) => {
    setDateInvalidText(value);
  };

  const handleTimeInvalidText = (value) => {
    setTimeInvalidText(value);
  };

  const handleInvoiceDateInvalidText = (value) => {
    setInvoiceDateInvalidText(value);
  };

  const handleDueDateInvalidText = (value) => {
    setDueDateInvalidText(value);
  };

  const handlePeriodDateInvalidText = (value) => {
    setPeriodDateInvalidText(value);
  };

  return (
    <>
      <NotSendingWarning
        client={client}
        invoiceClientSelected={invoiceClientSelected}
      />
      <InternationalClientWarning
        internationalClient={internationalClient}
      />
      <ScheduleInputs
        dateInvalidText={dateInvalidText}
        dueDate={dueDate}
        dueDateInvalidText={dueDateInvalidText}
        endDate={endDate}
        invoiceDate={invoiceDate}
        invoiceDateInvalidText={invoiceDateInvalidText}
        periodDateInvalidText={periodDateInvalidText}
        scheduleDate={scheduleDate}
        scheduleTime={scheduleTime}
        startDate={startDate}
        setDateInvalidText={handleDateInvalidText}
        setDueDate={setDueDate}
        setDueDateInvalidText={handleDueDateInvalidText}
        setEndDate={setEndDate}
        setInvoiceDate={setInvoiceDate}
        setInvoiceDateInvalidText={handleInvoiceDateInvalidText}
        setPeriodDateInvalidText={handlePeriodDateInvalidText}
        setScheduleDate={setScheduleDate}
        setScheduleTime={setScheduleTime}
        setStartDate={setStartDate}
        setTimeInvalidText={handleTimeInvalidText}
        timeInvalidText={timeInvalidText}
      />
      {showManageAllocationsAccordion && <ManageAllocations />}
      <AdditionalInputs
        comments={comments}
        setComments={setComments}
        poNumber={poNumber}
        setPoNumber={setPoNumber}
        hidePhoneNumber={otherProps?.hide_phone_number || false}
        setHidePhoneNumber={handlePhoneNumber}
        deposit={deposit}
        setDeposit={setDeposit}
        showDeposit={showDeposit}
        setShowDeposit={setShowDeposit}
        depositsNotificationDismissed={depositsNotificationDismissed}
      />
      <hr />
      {disabledSave && periodDateInvalidText && (
        <div className="alert alert-info" role="alert">
          End date is before start date, please correct before continuing.
        </div>
      )}
      {disabledSave && (timeInvalidText || dateInvalidText) && (
        <div className="alert alert-info" role="alert">
          Schedule date is in the past. If you no longer wish to schedule the
          invoice you can&nbsp;
          <button className="hui-link tw-pt-0" onClick={handleSendNowClick}>
            <strong>send now</strong>
          </button>
        </div>
      )}
      <FooterButtons
        invoiceStatus={invoiceStatus}
        isImpersonating={isImpersonating}
        disabledSave={disabledSave}
        handleNextClick={openConfirmationModal}
        handlePreviewClick={openPreviewModal}
        saveAndTrigger={saveAndTrigger}
        handleSaveDraftClick={handleSaveDraftClick}
        nextButtonPopover={composedPopoverMessage}
      />
      <InvoicePreviewModal
        disabledSave={disabledSave}
        openConfirmationModal={openConfirmationModal}
      />
    </>
  );
};

export default SettingsAndFooter;

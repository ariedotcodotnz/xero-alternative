import React, { useState } from "react";
import Modal from "@hui/_molecules/modal/Modal";
import { getUserJurisdictionLocale } from "../../../utilities/user_attributes";
import { useInvoiceQuoteContext } from "../../invoice_quote/InvoiceQuoteContext";
import NotSendingWarning from "../../invoice_quote/sections/NotSendingWarning";
import I18n from "../../../utilities/translations";
import { TimeZone } from "../../../types/invoices.type";
import InvoiceFooter from "./InvoiceFooter";
import SocialLinks from "./SocialLinks";
import ShowAttachment from "./ShowAttachment";
import MessageFooter from "./MessageFooter";
import PayNowLink from "./PayNowLink";
import DestinationAlert from "./DestinationAlert";
import CustomLogo from "./CustomLogo";
import InvoiceLink from "./InvoiceLink";
import OpeningParagraph from "./OpeningParagraph";
import EditableEmailText from "./EditableEmailText";
import DisableOverlay from "./DisableOverlay";
import { invoiceQuoteMessageType } from "./types";
import InternationalClientWarning from "../../invoice_quote/sections/InternationalClientWarning";

interface iInvoiceEmailModal {
  /**
   * Client's organisation name
   */
  client: string;
  /**
   * Client's billing name
   */
  clientName: string;
  /**
   * Determines if the invoice sending to client or not
   */
  invoiceClientSelected: boolean;
  open: boolean;
  setOpen: (boolean) => void;
  timeZone: TimeZone;
  tradingName?: string;
  userName: string;
  invoiceMessage: invoiceQuoteMessageType;
}

const ctx = { scope: "invoice_mailer.send_invoice" };

const InvoiceEmailModal = ({
  client,
  clientName,
  invoiceClientSelected,
  open,
  setOpen,
  timeZone,
  tradingName,
  userName,
  invoiceMessage,
}: iInvoiceEmailModal) => {
  const [editing, setEditing] = useState(false);
  const [prevEmailText, setPrevEmailText] = useState("");
  const [messageObject, setMessageObject] = useState<invoiceQuoteMessageType>(invoiceMessage);

  // Get all the relevant details for the email from Context,
  // and if it's not loaded (i.e: one of the items doesn't exist)
  // return null and the component will rerender when it isn't null
  const {
    invoiceObject,
    otherProps,
    grandTotal,
    startDate,
    endDate,
    dueDate,
    scheduleDate,
    scheduleTime,
    hideLegalName,
    internationalClient
  } = useInvoiceQuoteContext();
  if (!invoiceObject) return null;

  // Extact some more details out as top level variables
  // as they will be passed in to the various components that
  // make up the email modal
  const { invoice_number: invoiceNumber } = invoiceObject;
  const {
    attach_pdf_invoice: attachPDF,
    credit_card_minimum_amount: creditCardMinimumAmount,
    credit_card_surcharge: creditCardSurchange,
    custom_logo: customLogo,
    destination_email_addresses: destinationEmailAddresses,
    filename,
    payable_by_credit_card: payableByCreditCard,
  } = otherProps;

  const handleCancelClick = () => {
    setOpen(false);
    setEditing(false);
  }

  return (
    <Modal
      id="invoice-quote-email-modal"
      title={I18n.t("invoice_quotes.email_preview_title", { client })}
      open={open}
      setOpen={setOpen}
      onCancel={null}
      includesFooter={false}
      onOutsideCloseAction={(e) => { e.preventDefault(); }}
    >
      <NotSendingWarning
        client={client}
        invoiceClientSelected={invoiceClientSelected}
        onModal
      />
      <InternationalClientWarning
        internationalClient={internationalClient}
        onModal
      />
      <DestinationAlert
        destination={destinationEmailAddresses}
        scheduleDate={scheduleDate}
        scheduleTime={scheduleTime}
        timeZone={timeZone}
      />
      {customLogo && (
        <CustomLogo
          customLogo={customLogo}
          tradingName={tradingName}
          userName={userName}
        />
      )}
      <EditableEmailText
        clientName={clientName}
        editing={editing}
        setEditing={setEditing}
        prevEmailText={prevEmailText}
        setPrevEmailText={setPrevEmailText}
        model="invoice"
        invoiceQuoteId={invoiceObject.id}
        messageObject={messageObject}
        setMessageObject={setMessageObject}
      />
      <DisableOverlay editing={editing}>
        <OpeningParagraph
          invoiceLocation={attachPDF ? I18n.t("attached", ctx) : I18n.t("link", ctx)}
          invoiceNumber={invoiceNumber}
          startDate={startDate}
          endDate={endDate}
        />
        <InvoiceLink btnText={I18n.t("view_invoice", ctx)} />
        <PayNowLink
          payableByCreditCard={
            payableByCreditCard && grandTotal >= creditCardMinimumAmount
          }
          surcharge={creditCardSurchange}
        />
        <MessageFooter
          mainText={I18n.t("paragraph_2", { due_date: dueDate?.toLocaleDateString(getUserJurisdictionLocale()), ...ctx })}
          dueDate={dueDate}
          tradingName={tradingName}
          userName={userName}
          hideLegalName={hideLegalName}
        />
      </DisableOverlay>
      <SocialLinks />
      {attachPDF && <ShowAttachment filename={filename} />}
      <InvoiceFooter
        editing={editing}
        sendLater={Boolean(scheduleDate && scheduleTime)}
        handleCancelClick={handleCancelClick}
        setOpen={setOpen}
      />
    </Modal>
  );
};

export default InvoiceEmailModal;

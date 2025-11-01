import React, { useState } from "react";
import Modal from "@hui/_molecules/modal/Modal";
import NotSendingWarning from "../../invoice_quote/sections/NotSendingWarning";
import I18n from "../../../utilities/translations";
import SocialLinks from "./SocialLinks";
import ShowAttachment from "./ShowAttachment";
import MessageFooter from "./MessageFooter";
import DestinationAlert from "./DestinationAlert";
import CustomLogo from "./CustomLogo";
import InvoiceLink from "./InvoiceLink";
import OpeningParagraph from "./OpeningParagraph";
import QuoteFooter from "./QuoteFooter";
import EditableEmailText from "./EditableEmailText";
import DisableEmail from "./DisableOverlay";
import { invoiceQuoteMessageType } from "./types";

interface iQuoteEmailModal {
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
  tradingName?: string;
  userName: string;
  destinationEmailAddresses: string;
  /**
   * Quote expiry date
   */
  dueDate: string;
  /**
   * Is email includes pdf attachment
   */
  attachPdf: boolean;
  /**
   * The pdf attachment file name
   */
  filename: string;
  customLogo?: string;
  invoiceNumber: string;
  hideLegalName: boolean;
  totalQuote: string;
  submitUrl: string;
  quoteMessage: invoiceQuoteMessageType;
  quoteId: number;
}

const ctx = { scope: "quote_mailer.send_quote" };

const QuoteEmailModal = ({
  client,
  clientName,
  invoiceClientSelected,
  tradingName,
  userName,
  attachPdf,
  customLogo,
  destinationEmailAddresses,
  filename,
  invoiceNumber,
  hideLegalName,
  dueDate,
  totalQuote,
  submitUrl,
  quoteMessage,
  quoteId,
}: iQuoteEmailModal) => {
  const [open, setOpen] = useState(true);
  const [editing, setEditing] = useState(false);
  const [prevEmailText, setPrevEmailText] = useState("");
  const [messageObject, setMessageObject] = useState<invoiceQuoteMessageType>(quoteMessage);

  const handleCancelClick = () => {
    setOpen(false);
    setEditing(false);
  }

  return (
    <Modal
      title={I18n.t("invoice_quotes.email_preview_title", { client })}
      open={open}
      id="invoice-quote-email-modal"
      setOpen={setOpen}
      onCancel={null}
      includesFooter={false}
    >
      <NotSendingWarning
        client={client}
        invoiceClientSelected={invoiceClientSelected}
        onModal
      />
      <DestinationAlert
        destination={destinationEmailAddresses}
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
        model="quote"
        invoiceQuoteId={quoteId}
        messageObject={messageObject}
        setMessageObject={setMessageObject}
      />
      <DisableEmail editing={editing}>
        <OpeningParagraph
          invoiceLocation={
            attachPdf ? I18n.t("attached", ctx) : I18n.t("link", ctx)
          }
          invoiceNumber={invoiceNumber}
        />
        <InvoiceLink btnText={I18n.t("view_quote", ctx)} />
        <MessageFooter
          mainText={I18n.t("paragraph_2", {
            amount: totalQuote,
            attach_pdf_or_not: attachPdf ? I18n.t("attach_pdf.true", ctx) : I18n.t("attach_pdf.false", ctx),
            due_date: dueDate,
            ...ctx
          })}
          dueDate={new Date(dueDate)}
          tradingName={tradingName}
          userName={userName}
          hideLegalName={hideLegalName}
          model="quote"
        />
      </DisableEmail>
      <SocialLinks />
      {attachPdf && <ShowAttachment filename={filename} />}
      <QuoteFooter
        editing={editing}
        submitUrl={submitUrl}
        handleCancelClick={handleCancelClick}
      />
    </Modal>
  );
};

export default QuoteEmailModal;

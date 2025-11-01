import React, { useState, Fragment } from "react";
import classNames from "classnames";
import Button from "@hui/_atoms/button/Button";
import TextArea from "@hui/_atoms/textarea/Textarea";
import I18n from "../../../utilities/translations";
import { createInvoiceMessage, updateInvoiceMessage } from "../../../API/invoice_message.api";
import { createQuoteMessage, updateQuoteMessage } from "../../../API/quote_message.api";
import { invoiceQuoteMessageType } from "./types";

interface iEditableEmailText {
  editing: boolean;
  setEditing: (boolean) => void;
  clientName?: string;
  prevEmailText: string;
  setPrevEmailText: (string) => void;
  model: "invoice" | "quote";
  invoiceQuoteId?: number;
  messageObject: invoiceQuoteMessageType;
  setMessageObject: (obj: invoiceQuoteMessageType) => void;
}

const ctx = { scope: "invoice_quotes.editable_email_text" }

const EditableEmailText = ({
  editing,
  setEditing,
  clientName,
  prevEmailText,
  setPrevEmailText,
  model,
  invoiceQuoteId,
  messageObject,
  setMessageObject,
}: iEditableEmailText) => {
  const { id, emailIntro, emailIntroMaxLength } = messageObject;
  const newRecord = id === null;
  const defaultText = `Hi${clientName ? ` ${clientName}` : ""},`;

  const [emailText, setEmailText] = useState(emailIntro !== null ? emailIntro : defaultText);
  const [disableSave, setDisableSave] = useState(false);
  const [saving, setSaving] = useState(false);

  const createOrUpdate = async (payload) => {
    try {
      let response;
      if (model === "invoice") {
        if (newRecord) {
          response = await createInvoiceMessage(invoiceQuoteId, payload);
        } else {
          response = await updateInvoiceMessage(invoiceQuoteId, payload);
        }
        const { invoice_message: invoiceMessage } = response.data;

        setMessageObject({
          ...messageObject,
          id: invoiceMessage.id,
          emailIntro: emailText,
        });
      } else {
        if (newRecord) {
          response = await createQuoteMessage(invoiceQuoteId, payload);
        } else {
          response = await updateQuoteMessage(invoiceQuoteId, payload);
        }
        const { quote_message: quoteMessage } = response.data;

        setMessageObject({
          ...messageObject,
          id: quoteMessage.id,
          emailIntro: emailText,
        });
      }

      setPrevEmailText(emailText);
      setEditing(false);
      toastr.success(I18n.t("success_message", ctx));
    } catch (error) {
      if (typeof Rollbar !== "undefined") {
        Rollbar.warning(`User unable to ${newRecord ? "create" : "update" } ${model}'s intro_message`, { error });
      }
      toastr.error(I18n.t("error_message", ctx));
    }
    setSaving(false);
  }

  const handleSaveClick = () => {
    window.analytics?.track(`${model}_custom_email_text_save_clicked`, "");
    setSaving(true);
    createOrUpdate({ [`${model}_message`]: { email_intro: emailText }});
  }

  const handleEmailTextFocus = () => {
    setPrevEmailText(emailIntro);
  }

  const handleCancelClick = () => {
    const resetValue = emailIntro !== null ? prevEmailText : defaultText;
    setEditing(false);
    setEmailText(resetValue);
    setPrevEmailText(resetValue);
    setMessageObject({ ...messageObject, emailIntro: resetValue });
    window.analytics?.track(`${model}_custom_email_text_cancel_clicked`, "");
  }

  const handleEmailTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;

    setDisableSave(value.length > emailIntroMaxLength);
  }

  const handleCustomizeEmailClick = () => {
    setEditing(true);
    window.analytics?.track(`${model}_custom_email_text_edit_clicked`, "");
  }

  return (
    <div className="tw-flex tw-flex-col">
      <div className="tw-flex tw-justify-end">
        {editing ? (
          <div className="tw-flex tw-justify-between sm:tw-gap-1 tw-items-baseline">
            <Button
              variant="link"
              size="small"
              onClick={handleCancelClick}
              classes="!tw-capitalize"
              disabled={saving}
            >
              {I18n.t("global.actions.cancel")}
            </Button>
            <Button
              variant="link"
              onClick={handleSaveClick}
              iconType={saving ? null : "CheckIcon"}
              iconEnd
              size="small"
              classes="hnry-button--right-end !tw-min-w-min"
              disabled={disableSave || saving}
            >
              {saving? "Saving..." : I18n.t("save_changes", ctx)}
            </Button>
          </div>
        ) : (
          <div className="tw-flex">
            <Button
              variant="link"
              onClick={handleCustomizeEmailClick}
              iconType="PencilSquareIcon"
              size="small"
              classes="hnry-button--right-end"
              iconEnd
            >
              {I18n.t("customise_email_text", ctx)}
            </Button>
          </div>
        )}
      </div>
      {editing && (
        <>
          <TextArea
            id="customiseEmailTextarea"
            label="Email text"
            renderLabel={false}
            setValue={setEmailText}
            value={emailText}
            onFocus={handleEmailTextFocus}
            error={emailText.length > emailIntroMaxLength && I18n.t("error_max_length", { max: emailIntroMaxLength, ...ctx })}
            onChange={handleEmailTextChange}
            name="customise_email_textarea"
            errorAlign="right"
          />
          {emailText.length <= emailIntroMaxLength &&
            <div
              className={classNames("tw-flex tw-justify-end tw-text-xs tw-mt-2 tw-mb-4", {
                "hnry-error": emailText.length >= 650,
                "hnry-note": emailText.length < 650,
              })}
            >
              {I18n.t("remaining_characters", { count: emailIntroMaxLength - emailText.length, ...ctx})}
            </div>
          }
        </>
      )}
      {(!editing && emailText.length > 0) && (
        <p className="invoice-quote-email-text">
          {emailText.split(/\n/g).map((line, i) =>
            <Fragment key={`customise-line-${i}`}>
              <span className="tw-break-words">{line}</span><br />
            </Fragment>
          )}
        </p>
      )}
    </div>
  );
}

export default EditableEmailText;

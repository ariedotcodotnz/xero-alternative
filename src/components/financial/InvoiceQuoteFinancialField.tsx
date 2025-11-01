import React, { useState, useRef } from "react";
import Modal from "@hui/_molecules/modal/Modal";
import Input from "@hui/_atoms/input/Input";
import Tooltip from "@hui/_atoms/tooltip/Tooltip";
import I18n from "../../utilities/translations";

interface iInvoiceQuoteFinancialField {
  from: "clients" | "quotes" | "invoices";
  id: number;
}

const scope = { scope: "users.financial.invoice_quote_financial_field_modal" };
const InvoiceQuoteFinancialField = ({ id, from }: iInvoiceQuoteFinancialField) => {
  const form = useRef<HTMLFormElement>();
  const minLength = Number(I18n.t("input_length", scope)) || 9;
  const csrfToken: HTMLMetaElement | undefined = document.querySelector("meta[name='csrf-token']");

  const [show, setShow] = useState(true);
  const [vatNumber, setVatNumber] = useState("");
  const [disabled, setDisabled] = useState(true);

  const handleChange = (value) => {
    setDisabled(value.length < minLength);
    setVatNumber(value);
  }

  const handleSubmit = () => {
    form.current.requestSubmit();
  }

  return (
    <Modal
      open={show}
      setOpen={setShow}
      title={I18n.t("title", scope)}
      confirmCTA="Save"
      onConfirm={handleSubmit}
      disabled={disabled}
    >
      <p className="tw-text-gray-700">
        {I18n.t(`paragraph_${from}`, scope)}
      </p>
      <form
        data-remote="true"
        ref={form}
        method="PATCH"
        action={Routes.update_invoice_quote_financial_field_settings_financial_path({ id })}
      >
        <input type="hidden" name="authenticity_token" value={csrfToken?.content} autoComplete="off" />
        <input type="hidden" name="from" value={from} />
        <label
          className="hnry-label"
          htmlFor={I18n.t("input_id", scope)}
        >
          <span className="tw-flex tw-items-center tw-gap-x-1 tw-pt-2">
            {I18n.t("label", scope)}
            <Tooltip popoverMessage={I18n.t("label_tooltip", scope)} size="sm" />
          </span>
        </label>
        <Input
          value={vatNumber}
          setValue={handleChange}
          name={I18n.t("input_name", scope)}
          id={I18n.t("input_id", scope)}
          pattern={I18n.t("input_pattern", scope)}
          labelRendered={false}
          title={I18n.t("input_pattern_title", scope)}
          required
        />
      </form>
    </Modal>
  );
}

export default InvoiceQuoteFinancialField;

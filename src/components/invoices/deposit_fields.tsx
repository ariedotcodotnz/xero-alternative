import React, { useEffect } from "react";
import LabeledConsentCheckbox from "@hui/_molecules/labeled_consent_checkbox/LabeledConsentCheckbox";
import Alert from "../_molecules/alert/Alert";
import I18n from "../../utilities/translations";
import InputPrice from "../_atoms/input/InputPrice";
import Toggle from "../inputs/toggle/Toggle";
import Collapse from "../collapse/Collapse";
import { useInvoiceQuoteContext } from "../invoice_quote/InvoiceQuoteContext";

interface iDepositFields {
  isAlertDismissed: boolean;
  deposit: number;
  setDeposit: (value: number) => void;
  showDeposit: boolean
  setShowDeposit: (value: boolean) => void
}

const DepositFields = ({
  isAlertDismissed,
  deposit,
  setDeposit,
  showDeposit,
  setShowDeposit
}: iDepositFields) => {
  const { currencyOptions, setUntaxedDepositAccepted, untaxedDepositAccepted, grandTotal } = useInvoiceQuoteContext();

  const isFirstRender = React.useRef(true); // TODO: Remove once we set state properly.
  const acceptUntaxedDepositParagraph = I18n.t("invoices.form.untaxed_portion_consent_paragraph");

  useEffect(() => {
    if (isFirstRender.current && deposit) {
      setShowDeposit(Boolean(deposit));
      isFirstRender.current = false;
    }
  }, [deposit]);

  const handleToggle = () => {
    setShowDeposit(!showDeposit);
    if (showDeposit) {
      setDeposit(0);
      setUntaxedDepositAccepted(false);
    }
  };

  return (
    <div id="deposit-toggle" className="sm:tw-col-span-2">
      <Toggle
        label="This includes an untaxed portion to be used for the purchase of goods or materials"
        inputProps={{
          id: "includes-deposit",
          value: showDeposit,
          onChange: () => handleToggle(),
        }}
      />
      <Collapse isOpen={showDeposit} id="show-deposit" indentLevel="toggle">
        {!isAlertDismissed && (
          <Alert>
            {I18n.t("invoices.form.untaxed_portion_warning_message")}{" "}
            <a
              href={I18n.t("invoices.form.untaxed_portion_warning_link")}
              target="_blank"
              rel="noreferrer"
            >
              Learn more
            </a>
          </Alert>
        )}
        <div className="tw-mb-4">
          <InputPrice
            label="Untaxed amount required"
            currencySign={currencyOptions.symbol}
            name="invoice[deposit]"
            value={deposit}
            onChange={setDeposit}
            invalid={deposit > grandTotal ? I18n.t("invoices.form.untaxed_deposit_total_too_big_warning") : ""}
          />
          <div className="tw-mt-3">
            <LabeledConsentCheckbox 
              ariaLabel={acceptUntaxedDepositParagraph}
              id="untaxed_deposit_accepted"
              name="untaxed_deposit_accepted"
              label={acceptUntaxedDepositParagraph}
              checked={untaxedDepositAccepted}
              onChange={setUntaxedDepositAccepted}
              required={true}
              requiredLabel={true}
            />
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default DepositFields;

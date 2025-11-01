import React from "react";
import Accordion from "../../_molecules/accordion/Accordion";
import InputWithCopy from "./InputWithCopy";
import AllocationTopup from "./AllocationTopup";
import Alert from "../../_molecules/alert/Alert";
import I18n from "../../../utilities/translations";

interface iAddFunds {
  jurisdictionCode: string,
  hnryBankBsb?: string,
  hnryBankAccount: string,
  payeeName: string,
  personalBankAccountNumber: string,
  newAllocationUrl: string,
  allocation?: Allocation | undefined,
  isMobile: boolean,
}

const AddFunds = ({
  jurisdictionCode,
  hnryBankBsb = "",
  hnryBankAccount,
  payeeName,
  personalBankAccountNumber,
  allocation = undefined,
  isMobile,
}: iAddFunds) => {
  const bankAccountDetails = () => {
    if (jurisdictionCode === "au") {
      return (
        <div className="card-topup-details__bank-account full-sc-on-mob">
          <InputWithCopy
            labelText="BSB"
            id="topup-hnry-bank-bsb"
            value={hnryBankBsb}
            classes="mb-0"
          />
          <InputWithCopy
            labelText="Account Number"
            id="topup-hnry-bank-account-no"
            value={hnryBankAccount}
            classes="mb-0"
          />
        </div>
      );
    }

    return (
      <InputWithCopy
        labelText="Account number"
        id="topup-hnry-bank-account-no"
        value={hnryBankAccount}
        classes="mb-0"
      />
    );
  };

  return (
    <Accordion title="ADD FUNDS" defaultOpen>
      <Alert variant="info">
        <p className="tw-mb-0">
          {I18n.t("cards.manage_funds.max_amount_notice")}
        </p>
      </Alert>
      <div className="accordion-content-card mb-3">
        <h6 className="tw-text-base tw-font-semibold tw-text-gray-900">
          {I18n.t("cards.manage_funds.topup_by_bank_transfer.title")}
        </h6>
        <hr className="hr-line-light mt-0" />
        <p className="tw-text-sm sm:tw-text-base tw-text-gray-700">
          {I18n.t("cards.manage_funds.topup_by_bank_transfer.p1")}{" "}
          {personalBankAccountNumber}
        </p>
        <p className="tw-text-sm sm:tw-text-base tw-text-gray-700">
          {I18n.t("cards.manage_funds.topup_by_bank_transfer.p2")}
        </p>
        <p className="tw-text-sm sm:tw-text-base tw-text-gray-700">
          {I18n.t("cards.manage_funds.topup_by_bank_transfer.p3")}
        </p>
        <div className="alert alert-info card-topup-details" role="alert">
          <InputWithCopy
            labelText="Reference"
            id="reference"
            value="Card top up"
            classes="mt-1"
          />
          <InputWithCopy
            labelText="Payee name"
            id="topup-payee-name"
            value={payeeName}
          />
          {bankAccountDetails()}
        </div>
      </div>
      <AllocationTopup
        allocation={allocation}
        isMobile={isMobile}
        jurisdictionCode={jurisdictionCode}
      />
    </Accordion>
  );
};

export type Allocation = {
  id: number,
  statusMessage: string,
  percentage: number,
  paused: boolean,
  locked: boolean,
  invalid: boolean,
  pausedAt?: string,
  cap: boolean,
  fullyPaid: boolean,
  portionPaid: number,
  pausePath?: string,
}

export default AddFunds;

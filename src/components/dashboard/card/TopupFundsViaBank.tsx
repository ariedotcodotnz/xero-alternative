import React from "react";
import InputCopy from "../../_atoms/input/InputCopy";
import Alert from "../../_molecules/alert/Alert";

export interface iTopupFundsViaBank {
  yourAccountNumber: string;
  hnryAccountName: string;
  hnryAccountNumber: string;
  hnryReference: string;
}

const TopupFundsViaBank = ({
  yourAccountNumber,
  hnryAccountName,
  hnryAccountNumber,
  hnryReference,
}: iTopupFundsViaBank) => (
  <div>
    <div className="tw-mb-4">
      For security reasons, only funds received from <b>your bank account</b>{" "}
      listed in Hnry will be processed.
    </div>
    <div className="hnry-label">Your bank account</div>
    <div className="tw-text-blue-700">{yourAccountNumber}</div>
    <hr />
    <div className="tw-my-4">
      Use these payment details to add funds to your Hnry Account:
    </div>
    <InputCopy
      value={hnryAccountName}
      label="Account name"
      name="topup[account_name]"
      disabled
    />
    <InputCopy
      value={hnryAccountNumber}
      label="Account number"
      name="topup[account_number]"
      disabled
    />
    <InputCopy
      value={hnryReference}
      label="Reference"
      name="topup[reference]"
      disabled
    />
    <div className="tw-my-6">
      <Alert>
        <p>
          To ensure the payment is processed quickly and accurately, you must
          use the reference provided.
        </p>
      </Alert>
    </div>
  </div>
);

export default TopupFundsViaBank;

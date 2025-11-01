import React from "react";
import InputCopy from "../../_atoms/input/InputCopy";

export interface iTopupFunds {
  hnryBsb?: string;
  hnryAccountNumber: string;
  labelBsb?: string;
}

const TopupFunds = ({ hnryBsb, hnryAccountNumber, labelBsb }: iTopupFunds) => (
  <>
    <p>
      All you need to do is transfer funds from your personal bank account
      listed in Hnry. Please make sure you use the payment details below:
    </p>
    <InputCopy value="Card top up" label="Reference" name="topup[reference]" />
    <div className="tw-flex tw-flex-col tw-gap-x-2 sm:tw-flex-row">
      {hnryBsb && (
        <InputCopy value={hnryBsb} label={labelBsb} name="topup[bsb]" />
      )}
      <InputCopy
        value={hnryAccountNumber}
        label="Account number"
        name="topup[account]"
      />
    </div>
  </>
);

export default TopupFunds;

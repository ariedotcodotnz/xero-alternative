import React, { useState } from "react";
import InputPrice from "../../_atoms/input/InputPrice";
import I18n from "../../../utilities/translations";

interface WithdrawFundsProps {
  availableBalance: number;
  withdrawalAmount?: string;
  setWithdrawalAmount: (value: string) => void;
  setDisabledSubmit: (value: boolean) => void;
  jurisdiction: string;
  hnryAccountBalanceFeature: boolean;
}

const WithdrawFunds = ({
  availableBalance,
  withdrawalAmount,
  setWithdrawalAmount,
  setDisabledSubmit,
  hnryAccountBalanceFeature,
}: WithdrawFundsProps) => {
  const [invalidText, setInvalidText] = useState("");

  const handleChange = (value: string) => {
    const newValue = Number(value);

    if (newValue > Number(availableBalance) || newValue <= 0) {
      setInvalidText(I18n.t("home.hnry_card.withdraw_funds.invalid_message"));
      setDisabledSubmit(true);
    } else {
      setInvalidText("");
      setDisabledSubmit(false);
    }
    setWithdrawalAmount(value);
  };

  const { currencySymbol } = window.Hnry.User.jurisdiction;

  return (
    <>
      <p className="tw-text-gray-600">
        {I18n.t("home.hnry_card.withdraw_funds.withdraw_info")}
      </p>
      <InputPrice
        currencySign={currencySymbol}
        value={Number(availableBalance || 0).toFixed(2)}
        id="card_balance"
        name="card[balance]"
        label={hnryAccountBalanceFeature ? "Account balance" : "Card balance"}
        disabled
      />
      <div className="tw-pt-3">
        <InputPrice
          currencySign={currencySymbol}
          id="card_withdraw_amount"
          name="card[withdraw_amount]"
          label="Enter withdrawal amount"
          onChange={handleChange}
          onBlur={handleChange}
          value={withdrawalAmount}
          invalid={invalidText}
        />
      </div>
    </>
  );
};

export default WithdrawFunds;

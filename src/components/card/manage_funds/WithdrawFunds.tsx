import React from "react";
import Accordion from "../../_molecules/accordion/Accordion";
import I18n from "../../../utilities/translations";

interface iWithdrawFunds {
  intercomLink: string;
}

const WithdrawFunds = ({ intercomLink }: iWithdrawFunds) => (
  <Accordion title="WITHDRAW FUNDS" defaultOpen>
    <div className="tw-text-sm sm:tw-text-base tw-text-gray-700">
      <p>
        {I18n.t("cards.manage_funds.withdraw_funds.withdraw_funds_paragraph")}
      </p>
    </div>

    <a
      className="hnry-button hnry-button--primary"
      href={intercomLink}
      aria-label="Request Withdrawal"
    >
      Request withdrawal
    </a>
  </Accordion>
);

export default WithdrawFunds;

import React from "react";
import I18n from "../../../utilities/translations";

const AccountDetailsDisclaimer = ({
  international = true,
}: {
  international?: boolean;
}) => (
  <p className="tw-mb-0 tw-text-center tw-text-xs">
    {I18n.t("home.index.account_details.prompt_paragraph")} Learn more about
    your{" "}
    <a
      href={I18n.t("users.financial.account_details.hnry_account_link")}
      target="_blank"
      rel="noreferrer"
      className="hui-link"
    >
      Hnry account
    </a>
    {international && (
      <>
        {" & "}
        <a
          href={I18n.t(
            "users.financial.account_details.international_payments_link",
          )}
          target="_blank"
          rel="noreferrer"
          className="hui-link"
        >
          International payments
        </a>
      </>
    )}
    .
  </p>
);

export default AccountDetailsDisclaimer;

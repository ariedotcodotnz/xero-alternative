import React from "react";
import { UkUserAccountDetails } from "../../../types/user.type";
import AccountDetailsShareModule from "../AccountDetailsShareModule";
import AccountDetailsCopyLineItem from "./CopyLineItem";
import AccountDetailsDisclaimer from "./AccountDetailsDisclaimer";

const UkAccountDetailsModule = ({
  currentUser,
  eventContext = "dashboard",
}: {
  currentUser: UkUserAccountDetails;
  eventContext?: string;
}) => {
  const { accountName, accountNumber, accountType, bsb } = currentUser;

  const domesticDetails = [
    {
      label: "Account name",
      value: accountName,
      eventName: `${eventContext}_account_details_account_name_copied`,
    },
    {
      label: "Account type",
      value: accountType,
      eventName: `${eventContext}_account_details_account_type_copied`,
    },
    {
      label: "Sort code",
      value: bsb,
      eventName: `${eventContext}_account_details_bsb_number_copied`,
    },
    {
      label: "Account number",
      value: accountNumber,
      eventName: `${eventContext}_account_details_account_number_copied`,
    },
  ];

  return (
    <div className="tw-flex tw-grow tw-flex-col tw-gap-2">
      <div className="tw-mb-2 tw-flex tw-flex-col tw-gap-1 tw-px-2">
        {domesticDetails.map(({ label, eventName, value }) => (
          <AccountDetailsCopyLineItem
            key={label}
            label={label}
            eventName={eventName}
            value={value}
          />
        ))}
      </div>
      <div className="tw-mb-2 tw-mt-auto tw-px-2">
        <AccountDetailsDisclaimer international={false} />
      </div>
      <div>
        <AccountDetailsShareModule
          currentUser={currentUser}
          eventContext={eventContext}
        />
      </div>
    </div>
  );
};

export default UkAccountDetailsModule;

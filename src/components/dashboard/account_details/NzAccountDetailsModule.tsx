import React from "react";
import { NzUserAccountDetails } from "../../../types/user.type";
import AccountDetailsShareModule from "../AccountDetailsShareModule";
import AccountDetailsCopyLineItem from "./CopyLineItem";
import AccountDetailsDisclaimer from "./AccountDetailsDisclaimer";

const NzAccountDetailsModule = ({
  currentUser,
  eventContext = "dashboard",
}: {
  currentUser: NzUserAccountDetails;
  eventContext?: string;
}) => {
  const { accountName, accountNumber, bankName, swiftCode } = currentUser;

  const domesticDetails = [
    {
      label: "Name",
      value: accountName,
      eventName: `${eventContext}_account_details_account_name_copied`,
    },
    {
      label: "Account number",
      value: accountNumber,
      eventName: `${eventContext}_account_details_account_number_copied`,
    },
  ];

  const internationalDetails = [
    {
      label: "Bank name",
      value: bankName,
      eventName: `${eventContext}_account_details_bank_name_copied`,
    },
    {
      label: "SWIFT/BIC",
      value: swiftCode,
      eventName: `${eventContext}_account_details_swift_copied`,
    },
  ];

  return (
    <div className="tw-flex tw-grow tw-flex-col tw-gap-2">
      <div className="tw-mb-2 tw-flex tw-flex-col tw-gap-2 tw-px-2 tw-text-left">
        <div className="tw-flex tw-flex-col tw-gap-1">
          <div className="tw-text-xs">Domestic</div>
          {domesticDetails.map(({ label, eventName, value }) => (
            <AccountDetailsCopyLineItem
              key={label}
              label={label}
              eventName={eventName}
              value={value}
            />
          ))}
        </div>
        <div className="tw-flex tw-flex-col tw-gap-1">
          <div className="tw-text-xs">International</div>
          {internationalDetails.map(({ label, eventName, value }) => (
            <AccountDetailsCopyLineItem
              key={label}
              label={label}
              eventName={eventName}
              value={value}
            />
          ))}
        </div>
      </div>
      <div className="tw-mb-2 tw-mt-auto tw-px-2">
        <AccountDetailsDisclaimer />
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

export default NzAccountDetailsModule;

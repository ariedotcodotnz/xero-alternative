import React, { useState } from "react";
import Tabs from "../../_molecules/tabs/Tabs";
import CopyButton from "../../_molecules/copy_button/CopyButton";
import AccountDetailsShareModule from "../AccountDetailsShareModule";
import { AuUserAccountDetails } from "../../../types/user.type";
import I18n from "../../../utilities/translations";
import PayIdPanel from "./PayIdPanel";

interface iAccountDetailsAuModule {
  currentUser: AuUserAccountDetails;
  eventContext?: string;
  payIdDomain?: string;
  showPayIdPanel?: boolean;
}

const DOMESTIC_TAB = "Domestic";
const INTERNATIONAL_TAB = "International";
const PAYID_TAB = "PayID";
const I18N_CONTEXT = { scope: "users.financial.account_details" };

const AuAccountDetailsModule = ({
  currentUser,
  eventContext = "dashboard",
  payIdDomain = "",
  showPayIdPanel = false,
}: iAccountDetailsAuModule) => {
  const ACCOUNT_TABS =
    showPayIdPanel && currentUser.payIdName && currentUser.payId && payIdDomain
      ? [DOMESTIC_TAB, INTERNATIONAL_TAB, PAYID_TAB]
      : [DOMESTIC_TAB, INTERNATIONAL_TAB];

  const [selectedTab, setSelectedTab] = useState(ACCOUNT_TABS[0]);
  const [payId, setPayId] = useState(currentUser.payId);
  const handleTabSelect = (value) => {
    setSelectedTab(value);
  };

  const tabNames = ACCOUNT_TABS.map((tab) => ({
    name: tab,
    active: selectedTab === tab,
  }));

  const internationalDetails = [
    {
      copyLabel: "Name",
      copyValue: currentUser.accountName,
      eventName: `${eventContext}_account_details_account_name_copied`,
      btnLabel: "account name",
    },
    {
      copyLabel: "BSB",
      copyValue: currentUser.bsb,
      eventName: `${eventContext}_account_details_bsb_number_copied`,
      btnLabel: "bsb number",
    },
    {
      copyLabel: "Account number",
      copyValue: currentUser.accountNumber,
      eventName: `${eventContext}_account_details_account_number_copied`,
      btnLabel: "account number",
    },
    {
      copyLabel: "Bank name",
      copyValue: currentUser.bankName,
      eventName: `${eventContext}_account_details_bank_name_copied`,
      btnLabel: "bank name",
    },
    {
      copyLabel: "SWIFT/BIC",
      copyValue: currentUser.swiftCode,
      eventName: `${eventContext}_account_details_swift_copied`,
      btnLabel: "swift code",
    },
  ];

  const domesticDetails = [
    {
      copyLabel: "Name",
      copyValue: currentUser.accountName,
      eventName: `${eventContext}_account_details_account_name_copied`,
      btnLabel: "account name",
    },
    {
      copyLabel: "BSB",
      copyValue: currentUser.bsb,
      eventName: `${eventContext}_account_details_BSB_copied`,
      btnLabel: "bsb",
    },
    {
      copyLabel: "Account number",
      copyValue: currentUser.accountNumber,
      eventName: `${eventContext}_account_details_account_number_copied`,
      btnLabel: "account number",
    },
    {
      copyLabel: "PayID",
      copyValue: payId,
      eventName: `${eventContext}_account_details_PayID_copied`,
      btnLabel: "PayID",
    },
  ];

  const accountDetails = () => {
    switch (selectedTab) {
      case DOMESTIC_TAB:
        return domesticDetails;
      case INTERNATIONAL_TAB:
        return internationalDetails;
      default:
        return [];
    }
  };

  return (
    <div className="tw-flex tw-w-full tw-flex-col tw-gap-2">
      <Tabs tabs={tabNames} asButton onChange={handleTabSelect} centered />
      <div className="tw-flex tw-flex-col tw-gap-1 tw-py-3 tw-pl-3">
        {accountDetails().map(
          ({ copyLabel, copyValue, eventName, btnLabel }) => (
            <div
              className="tw-items-top tw-flex tw-flex-row tw-items-center tw-justify-between tw-text-sm tw-text-gray-900"
              key={copyLabel}
            >
              <div className="tw-flex tw-text-left">
                <div className="tw-pr-2 tw-font-semibold">{copyLabel}</div>
                {copyValue}
              </div>
              <div className="!tw-content-end">
                <CopyButton
                  copyValue={copyValue}
                  label={btnLabel}
                  buttonClasses="tw-border-0"
                  eventName={eventName}
                >
                  <span className="tw-sr-only">Copy {btnLabel}</span>
                </CopyButton>
              </div>
            </div>
          ),
        )}

        {selectedTab === PAYID_TAB && (
          <PayIdPanel
            payId={payId}
            setPayId={setPayId}
            payIdName={currentUser.payIdName}
            eventContext={eventContext}
            payIdDomain={payIdDomain}
          />
        )}
      </div>

      <div className="tw-mb-2 tw-mt-auto tw-px-2">
        <p className="tw-mb-0 tw-text-center tw-text-xs">
          {I18n.t("home.index.account_details.prompt_paragraph")}{" "}
          <a
            href={
              selectedTab === INTERNATIONAL_TAB
                ? I18n.t("international_help_link", I18N_CONTEXT)
                : I18n.t("domestic_help_link", I18N_CONTEXT)
            }
            rel="noreferrer"
            target="_blank"
            className="hui-link"
          >
            {selectedTab === INTERNATIONAL_TAB
              ? I18n.t("international_help_text", I18N_CONTEXT)
              : I18n.t("domestic_help_text", I18N_CONTEXT)}
          </a>
        </p>
      </div>
      <AccountDetailsShareModule
        currentUser={currentUser}
        accountType={selectedTab}
        eventContext={eventContext}
      />
    </div>
  );
};

export default AuAccountDetailsModule;

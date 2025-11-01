import React, { useState } from "react";
import { Transition } from "@headlessui/react";
import classNames from "classnames";
import CardModuleFooter, { iCardModuleFooter } from "./CardModuleFooter";
import Card from "../../../assets/images/hnry_card/hnry_card_au_nz.svg";
import CardUk from "../../../assets/images/hnry_card/hnry_card_uk.svg";
import FrozenMask from "../../../assets/images/hnry_card/frozen_mask.svg";
import Alert from "../_molecules/alert/Alert";
// eslint-disable-next-line import/no-named-as-default
import formatToLocalCurrency from "../../utilities/currency/currency_format";
import { getUserJurisdictionCode } from "../../utilities/user_attributes";
import AddToWalletButtonWrapper from "./card/AddToWalletButtonWrapper";
import { iCardMoreActions } from "./CardMoreActions";

interface iCardContent extends iCardModuleFooter, iCardMoreActions {
  cardNumber?: string;
  jurisdiction: string;
  showAddToWalletButton: boolean;
  platformIsAndroid: boolean;
  platformIsIos: boolean;
  applicationSettingOff: boolean;
  googlePayMarkPath?: string;
  applePayMarkPath?: string;
  hnryAccountBalanceFeature: boolean;
}

const CardContent = ({
  appleWalletLink,
  availableBalance,
  cardBlocked,
  cardNumber,
  googleWalletLink,
  intercomLink,
  otpRequiredForLogin,
  userEmail,
  userPhoneNumber,
  hnryBsb,
  hnryAccountNumber,
  allocation,
  allocationTemplate,
  allocationFrequencyOptions,
  isImpersonating,
  maxAllocationPercentage,
  jurisdiction,
  showAddToWalletButton,
  platformIsAndroid,
  platformIsIos,
  applicationSettingOff,
  googlePayMarkPath,
  applePayMarkPath,
  hnryAccountBalanceFeature,
}: iCardContent) => {
  const [cardFrozen, setCardFrozen] = useState(cardBlocked);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  return (
    <>
      {!hnryAccountBalanceFeature && (
        <div className="tw-self-start tw-text-left tw-text-black">
          {availableBalance ? (
            <>
              <h3
                className={classNames("tw-m-0 tw-text-xs", {
                  "tw-text-gray-500": cardFrozen,
                })}
              >
                Your Balance
              </h3>
              <span
                className={classNames("tw-text-2xl", {
                  "tw-text-gray-500": cardFrozen,
                })}
              >
                {formatToLocalCurrency(
                  Number(availableBalance),
                  getUserJurisdictionCode(),
                  { decimals: true },
                )}
              </span>
            </>
          ) : (
            <Alert variant="info">
              Unable to get card balance. Please try again later.
            </Alert>
          )}
        </div>
      )}

      <div className="tw-relative tw-mx-3 tw-mb-4 tw-mt-3 sm:tw-mx-6">
        <img
          src={getUserJurisdictionCode() === "uk" ? CardUk : Card}
          className="tw-w-full tw-rounded-xl"
          alt="Hnry debit card"
        />
        <div className="tw-absolute tw-bottom-0 tw-left-0 tw-p-4 tw-text-white">
          •• {cardNumber}
        </div>
        <Transition
          enter="tw-transition-opacity tw-duration-300"
          enterFrom="tw-opacity-0"
          enterTo="tw-opacity-100"
          leave="tw-transition-opacity tw-duration-300"
          leaveFrom="tw-opacity-100"
          leaveTo="tw-opacity-0"
          show={cardFrozen}
        >
          <div className="tw-w-full">
            <img
              src={FrozenMask}
              className="tw-absolute tw-bottom-0 tw-w-full tw-rounded-xl tw-opacity-60"
              alt="Frozen mask"
            />
            <div className="tw-absolute tw-bottom-0 tw-h-full tw-w-full tw-bg-white tw-opacity-60" />
          </div>
        </Transition>
      </div>
      {!cardFrozen && showAddToWalletButton && (
        <AddToWalletButtonWrapper
          googlePayMarkPath={googlePayMarkPath}
          applePayMarkPath={applePayMarkPath}
          reloadTrigger={reloadTrigger}
          setReloadTrigger={setReloadTrigger}
        />
      )}
      <CardModuleFooter
        appleWalletLink={appleWalletLink}
        googleWalletLink={googleWalletLink}
        platformIsAndroid={platformIsAndroid}
        platformIsIos={platformIsIos}
        applicationSettingOff={applicationSettingOff}
        availableBalance={availableBalance}
        cardBlocked={cardFrozen}
        intercomLink={intercomLink}
        otpRequiredForLogin={otpRequiredForLogin}
        setCardFrozen={setCardFrozen}
        userEmail={userEmail}
        userPhoneNumber={userPhoneNumber}
        hnryBsb={hnryBsb}
        hnryAccountNumber={hnryAccountNumber}
        allocationFrequencyOptions={allocationFrequencyOptions}
        allocationTemplate={allocationTemplate}
        allocation={allocation}
        isImpersonating={isImpersonating}
        maxAllocationPercentage={maxAllocationPercentage}
        jurisdiction={jurisdiction}
        reloadTrigger={reloadTrigger}
        setReloadTrigger={setReloadTrigger}
        hnryAccountBalanceFeature={hnryAccountBalanceFeature}
      />
    </>
  );
};

export default CardContent;

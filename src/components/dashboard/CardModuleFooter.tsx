import React, { useEffect } from "react";
import Icon from "../_atoms/icons/icon/Icon";
import CardDetails from "./active_card_module/CardDetails";
import { postJson } from "../../API/config/fetch.api";
import CardAddFunds, { iCardAddFunds } from "./CardAddFunds";
import I18n from "../../utilities/translations";
import CardMoreActions, { iCardMoreActions } from "./CardMoreActions";

export interface iCardModuleFooter extends iCardAddFunds, iCardMoreActions {
  cardBlocked: boolean;
  intercomLink: string;
  otpRequiredForLogin: boolean;
  setCardFrozen: (cardBlocked) => void;
  userEmail: string;
  userPhoneNumber: string;
  jurisdiction: string;
  reloadTrigger: number;
  setReloadTrigger: React.Dispatch<React.SetStateAction<number>>;
  hnryAccountBalanceFeature: boolean;
}

const CardModuleFooter = ({
  googleWalletLink,
  appleWalletLink,
  platformIsAndroid,
  platformIsIos,
  applicationSettingOff,
  availableBalance,
  otpRequiredForLogin,
  userEmail,
  userPhoneNumber,
  cardBlocked,
  setCardFrozen,
  intercomLink,
  hnryBsb,
  hnryAccountNumber,
  allocationFrequencyOptions,
  allocationTemplate,
  allocation,
  isImpersonating,
  maxAllocationPercentage,
  jurisdiction,
  reloadTrigger,
  setReloadTrigger,
  hnryAccountBalanceFeature,
}: iCardModuleFooter) => {
  const frozenCardEvent = new CustomEvent("hnry:freeze_card", {
    detail: { card_blocked: cardBlocked },
  });

  useEffect(() => {
    dispatchEvent(frozenCardEvent);
  });

  const handleFreezeCard = () => {
    const cardAction = cardBlocked ? "unblock" : "block";
    const freezeCardEvent = frozenCardEvent;

    postJson(
      Routes.update_card_cards_path(),
      JSON.stringify({ card_action: cardAction }),
    )
      .then(() => {
        setCardFrozen(!cardBlocked);
        dispatchEvent(freezeCardEvent);
        toastr.success(
          `Card ${cardAction === "unblock" ? "un-frozen. Any Hnry Card allocations that we paused for you have now been resumed." : "frozen. All Hnry Card allocations have been paused."}`,
        );
      })
      .catch(() => {
        toastr.error(
          `Failed to ${cardAction === "unblock" ? "un-" : ""}freeze card. Please try again`,
        );
      });
  };

  return (
    <>
      {!cardBlocked && (
        <div className="tw-flex tw-w-full tw-justify-evenly">
          <CardAddFunds
            hnryBsb={hnryBsb}
            hnryAccountNumber={hnryAccountNumber}
            allocationFrequencyOptions={allocationFrequencyOptions}
            allocationTemplate={allocationTemplate}
            allocation={allocation}
            isImpersonating={isImpersonating}
            maxAllocationPercentage={maxAllocationPercentage}
            hnryAccountBalanceFeature={hnryAccountBalanceFeature}
          />
          <CardDetails
            otpRequiredForLogin={otpRequiredForLogin}
            userPhoneNumber={userPhoneNumber}
            userEmail={userEmail}
            jurisdiction={jurisdiction}
          />
          <button
            className="hnry-button hnry-button--link"
            onClick={handleFreezeCard}
          >
            <Icon type="SnowFlakeIcon" classes="!tw-mx-0" />
            <span className="tw-block tw-pt-2 tw-text-xs">Freeze</span>
          </button>
          <CardMoreActions
            googleWalletLink={googleWalletLink}
            appleWalletLink={appleWalletLink}
            platformIsAndroid={platformIsAndroid}
            platformIsIos={platformIsIos}
            applicationSettingOff={applicationSettingOff}
            availableBalance={availableBalance}
            jurisdiction={jurisdiction}
            reloadTrigger={reloadTrigger}
            setReloadTrigger={setReloadTrigger}
            hnryAccountBalanceFeature={hnryAccountBalanceFeature}
          />
        </div>
      )}
      {cardBlocked && (
        <div className="tw-flex tw-w-full tw-justify-evenly">
          <a
            className="hnry-button hnry-button--link tw-block"
            href={intercomLink}
          >
            <Icon type="TrashIcon" classes="!tw-mx-0" />
            <span className="tw-block tw-pt-2 tw-text-xs">Cancel card</span>
          </a>
          <button
            className="hnry-button hnry-button--link"
            onClick={handleFreezeCard}
          >
            <Icon type="SnowFlakeIcon" classes="!tw-mx-0" />
            <span className="tw-block tw-pt-2 tw-text-xs">Un-freeze</span>
          </button>
        </div>
      )}
      {cardBlocked && (
        <div className="p-3">
          <div className="-tw-mx-4 -tw-mb-4 tw-rounded-md tw-bg-brand-50 tw-px-4 tw-py-3 tw-text-center tw-text-xs tw-text-gray-700">
            {I18n.t("cards.block_card.frozen_card_information_banner")}
          </div>
        </div>
      )}
    </>
  );
};

export default CardModuleFooter;

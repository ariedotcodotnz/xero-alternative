import React, { useState } from "react";
import I18n from "../../utilities/translations";
import Icon from "../_atoms/icons/icon/Icon";
import Modal from "../_molecules/modal/Modal";
import { withdrawFunds, iWithdrawFundsSCAChallengeResponse } from "../../API/cards.api";
import WithdrawFunds from "./card/WithdrawFunds";
import MoreActions from "./card/MoreActions";
import SCAConfirm from "../_organisms/sca_confirm/SCAConfirm";
import { camelizeKeys } from "../utils/base_helper";

export interface iCardMoreActions {
  appleWalletLink: string;
  availableBalance: number;
  googleWalletLink: string;
  platformIsAndroid: boolean;
  platformIsIos: boolean;
  applicationSettingOff: boolean;
  jurisdiction: string;
  reloadTrigger: number;
  setReloadTrigger: React.Dispatch<React.SetStateAction<number>>;
  hnryAccountBalanceFeature: boolean;
}

const MAIN_SCREEN = "more_actions";
const WITHDRAW_SCREEN = "withdraw_funds";

const ctx = { scope: "home.hnry_card" };

const CardMoreActions = ({
  googleWalletLink,
  appleWalletLink,
  platformIsAndroid,
  platformIsIos,
  applicationSettingOff,
  availableBalance,
  jurisdiction,
  reloadTrigger,
  setReloadTrigger,
  hnryAccountBalanceFeature,
}: iCardMoreActions) => {
  const moreActionsTitle = I18n.t("more_actions.title", ctx);

  const [showModal, setShowModal] = useState(false);
  const [screen, setScreen] = useState(MAIN_SCREEN);
  const [modalTitle, setModalTitle] = useState(moreActionsTitle);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [disabledSubmit, setDisabledSubmit] = useState(false);
  const [scaChallengeResponse, setScaChallengeResponse] = useState<iWithdrawFundsSCAChallengeResponse>(null);
  const [showSCA, setShowSCA] = useState(false);

  const handleScreenChange = (sc) => {
    setScreen(sc);
    setModalTitle(
      sc === WITHDRAW_SCREEN
        ? I18n.t("withdraw_funds.title", ctx)
        : moreActionsTitle,
    );
  };

  const handleClick = () => {
    setShowModal(!showModal);
    handleScreenChange(MAIN_SCREEN);
  };

  const handleWithdrawFundsClick = () => {
    handleScreenChange(WITHDRAW_SCREEN);
    setDisabledSubmit(true);
  };

  const reset = () => {
    setShowModal(false);
    setModalTitle(moreActionsTitle);
    setWithdrawAmount("");
    setScreen(MAIN_SCREEN);
    setDisabledSubmit(false);
  };

  const handleWithdrawSubmit = async () => {
    try {
      setDisabledSubmit(true);
      const response = await withdrawFunds({ amount: withdrawAmount });

      if (response.status === "bad_request") {
        toastr.error(response.message);
      } else if (response.status === "ok") {
        if (response.challenge_id != null){
          const scaChallengeResponse: iWithdrawFundsSCAChallengeResponse = camelizeKeys(response);
          handleSCAChallengeResponse(scaChallengeResponse);
        }else{
          toastr.success(response.message);
        }
      } else {
        toastr.success(I18n.t("cards.manage_funds.withdraw_funds.error"));
      }
    } catch (error) {
      if (typeof Rollbar !== "undefined") {
        Rollbar.warning("User unable to withdraw funds from card", { error });
      }
    } finally {
      reset();
    }
  };

  const handleSCAChallengeResponse = (response: iWithdrawFundsSCAChallengeResponse) => {
    setScaChallengeResponse(response);
    setShowSCA(true);
    setShowModal(false);
  }

  return (
    <>
      <button
        className="hnry-button hnry-button--link tw-mr-2"
        onClick={handleClick}
      >
        <Icon type="EllipsisHorizontalIcon" classes="!tw-mx-0" />
        <span className="tw-block tw-pt-2 tw-text-xs">More</span>
      </button>
      {showModal && (
        <Modal
          onConfirm={screen === WITHDRAW_SCREEN ? handleWithdrawSubmit : null}
          open={showModal}
          setOpen={setShowModal}
          title={modalTitle}
          closable
          disabled={disabledSubmit}
          onCancel={reset}
        >
          {screen === WITHDRAW_SCREEN ? (
            <WithdrawFunds
              availableBalance={availableBalance}
              withdrawalAmount={withdrawAmount}
              setWithdrawalAmount={setWithdrawAmount}
              setDisabledSubmit={setDisabledSubmit}
              jurisdiction={jurisdiction}
              hnryAccountBalanceFeature={hnryAccountBalanceFeature}
            />
          ) : (
            <MoreActions
              appleWalletLink={appleWalletLink}
              googleWalletLink={googleWalletLink}
              platformIsAndroid={platformIsAndroid}
              platformIsIos={platformIsIos}
              applicationSettingOff={applicationSettingOff}
              onWithdrawFundsClick={handleWithdrawFundsClick}
              reloadTrigger={reloadTrigger}
              setReloadTrigger={setReloadTrigger}
              hnryAccountBalanceFeature={hnryAccountBalanceFeature}
            />
          )}
        </Modal>
      )}
      {showSCA && (
        <SCAConfirm actionName={scaChallengeResponse.challengeAction} deviceName={scaChallengeResponse.deviceRegistrationName} challengeId={scaChallengeResponse.challengeId} />
      )}
    </>
  );
};

export default CardMoreActions;

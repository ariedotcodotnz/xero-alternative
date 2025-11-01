import React, { useEffect, useState } from "react";
import Button from "@hui/_atoms/button/Button";
import {
  setupCardAllocation,
  updateCardAllocation,
  withdrawFunds,
  iWithdrawFundsSCAChallengeResponse
} from "@api/cards.api";
import I18n from "../../../utilities/translations";
import Modal from "../../_molecules/modal/Modal";
import ManageFundsOptions from "./ManageFundsOptions";
import TopupFundsViaBank from "../card/TopupFundsViaBank";
import WithdrawFunds from "../card/WithdrawFunds";
import SetAllocation from "./SetAllocation";
import SCAConfirm from "../../_organisms/sca_confirm/SCAConfirm";
import { camelizeKeys } from "../../utils/base_helper";

interface iAllocation {
  id: number;
  percentage: string;
  capFrequency: string;
  cap: string;
  lockedAt?: string;
}

export interface iAllocationTemplate {
  name: string;
  allocationType: string;
  title: string;
  payeeAccountNumber: number;
}

export interface iSetupAllocation {
  allocationFrequencyOptions: string[];
  allocationTemplate: iAllocationTemplate;
  allocation: iAllocation;
  isImpersonating: boolean;
  maxAllocationPercentage: number;
}
interface iManageFundsModal extends iSetupAllocation {
  title: string;
  buttonText: string;
  yourAccountNumber: string;
  hnryAccountName: string;
  hnryAccountNumber: string;
  hnryReference: string;
  availableBalance: number;
  jurisdiction: string;
  hnryAccountBalanceFeature: boolean;
  allocation: iAllocation;
  cardFrozen: boolean;
}

const ManageFundsModal = ({
  title,
  buttonText,
  yourAccountNumber,
  hnryAccountName,
  hnryAccountNumber,
  hnryReference,
  availableBalance,
  jurisdiction,
  hnryAccountBalanceFeature,
  allocation,
  allocationFrequencyOptions,
  allocationTemplate,
  isImpersonating,
  maxAllocationPercentage,
  cardFrozen,
}: iManageFundsModal) => {
  const MAIN_MODAL = "manage_funds";
  const TOPUP_VIA_BANK_MODAL = "topup_funds";
  const WITHDRAW_FUNDS_MODAL = "withdraw_funds";
  const CREATE_ALLOCATION_MODAL = "create_allocation";

  const [showModal, setShowModal] = useState(false);
  const [currentModal, setCurrentModal] = useState(MAIN_MODAL);
  const [modalTitle, setModalTitle] = useState(title);
  const [confirmButton, setConfirmButton] = useState("");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [disabledSubmit, setDisabledSubmit] = useState(false);
  const [disableManageFunds, setDisableManageFunds] = useState(cardFrozen);
  const [scaChallengeResponse, setScaChallengeResponse] = useState<iWithdrawFundsSCAChallengeResponse>(null);
  const [showSCA, setShowSCA] = useState(false);

  const [allocationFrequency, setAllocationFrequency] = useState(
    allocation.capFrequency,
  );
  const [allocationPercentage, setAllocationPercentage] = useState(
    allocation.percentage,
  );
  const [allocationCap, setAllocationCap] = useState(allocation.cap);
  const [allocationLocked, setAllocationLocked] = useState(
    Boolean(allocation && allocation.lockedAt),
  );
  const [existingAllocation, setExistingAllocation] = useState(allocation);

  useEffect(() => {
    window.addEventListener("hnry:freeze_card", (e: CustomEvent) => {
      setDisableManageFunds(e.detail.card_blocked);
    });

    if (existingAllocation) {
      setAllocationFrequency(existingAllocation.capFrequency);
      setAllocationPercentage(existingAllocation.percentage);
      setAllocationCap(existingAllocation.cap);
      setAllocationLocked(Boolean(existingAllocation.lockedAt));
    }
  }, [existingAllocation]);

  const handleModalChange = (nextModal) => {
    setCurrentModal(nextModal);
  };

  const reset = () => {
    if (currentModal === WITHDRAW_FUNDS_MODAL) {
      setWithdrawalAmount("");
    }

    if (currentModal === CREATE_ALLOCATION_MODAL) {
      setAllocationFrequency(existingAllocation?.capFrequency);
      setAllocationPercentage(existingAllocation?.percentage);
      setAllocationCap(existingAllocation?.cap);
      setAllocationLocked(Boolean(existingAllocation?.lockedAt));
    }

    setShowModal(false);
  };

  const handleWithdrawSubmit = async () => {
    try {
      setDisabledSubmit(true);
      const response = await withdrawFunds({ amount: withdrawalAmount });

      if (
        response.status === "bad_request" ||
        response.status === "unprocessable_entity"
      ) {
        toastr.error(response.message);
      } else if (response.status === "ok") {
        if (response.challenge_id != null){
          const scaChallengeResponse: iWithdrawFundsSCAChallengeResponse = camelizeKeys(response);
          handleSCAChallengeResponse(scaChallengeResponse);
        }else{
          toastr.success(response.message);
          setShowModal(false);
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

  const handleAllocationSubmit = async () => {
    try {
      setDisabledSubmit(true);
      const payload = {
        frequency: allocationFrequency,
        percentage: allocationPercentage,
        cap: allocationCap,
        allocationTemplate,
        locked: isImpersonating ? allocationLocked : undefined,
      };
      const response = existingAllocation?.id
        ? await updateCardAllocation({
            ...payload,
            id: existingAllocation.id,
          })
        : await setupCardAllocation({
            ...payload,
          });

      if (
        response.status === "bad_request" ||
        response.status === "unprocessable_entity"
      ) {
        toastr.error(response.message);
      } else if (response.status === "ok") {
        toastr.success(response.message);
        setExistingAllocation(camelizeKeys(response.allocation));
      } else {
        toastr.error(I18n.t("cards.manage_funds.create_allocation.error"));
      }
    } catch (error) {
      if (typeof Rollbar !== "undefined") {
        Rollbar.warning("User unable to create/update allocation", { error });
      }
    } finally {
      reset();
    }
  };

  const handleOpenModal = () => {
    setModalTitle(title);
    handleModalChange(MAIN_MODAL);
    setShowModal(!showModal);
  };

  const handleConfirm = () => {
    if (currentModal === WITHDRAW_FUNDS_MODAL) {
      handleWithdrawSubmit();
    }

    if (currentModal === CREATE_ALLOCATION_MODAL) {
      setShowModal(false);
      setModalTitle(title);
      handleAllocationSubmit();
    }

    setShowModal(!showModal);
    setDisabledSubmit(false);
  };

  const handleAddFundsAutomaticallyClick = () => {
    setModalTitle("Add funds automatically");
    handleModalChange(CREATE_ALLOCATION_MODAL);
    setConfirmButton("Done");
    setDisabledSubmit(false);
  };

  const handleAddFundsViaBankTransferClick = () => {
    setModalTitle("Add funds via bank transfer");
    handleModalChange(TOPUP_VIA_BANK_MODAL);
    setConfirmButton("Done");
    setDisabledSubmit(false);
  };

  const handleWithdrawFundsClick = () => {
    setModalTitle("Withdraw funds from your Hnry Account");
    handleModalChange(WITHDRAW_FUNDS_MODAL);
    setConfirmButton("Confirm");
    setDisabledSubmit(true);
  };

  const handleBack = () => {
    if (currentModal === WITHDRAW_FUNDS_MODAL) {
      setWithdrawalAmount("");
    }

    if (currentModal === CREATE_ALLOCATION_MODAL) {
      setAllocationFrequency(existingAllocation?.capFrequency);
      setAllocationPercentage(existingAllocation?.percentage);
      setAllocationCap(existingAllocation?.cap);
      setAllocationLocked(Boolean(existingAllocation?.lockedAt));
    }

    setModalTitle(title);
    handleModalChange(MAIN_MODAL);
  };

  return (
    <>
      <Button
        classes="!tw-px-3"
        onClick={handleOpenModal}
        variant="secondary"
        disabled={disableManageFunds}
      >
        <span>{buttonText}</span>
      </Button>
      {showModal && (
        <Modal
          open={showModal}
          setOpen={setShowModal}
          title={modalTitle}
          closable
          onCancel={reset}
        >
          {currentModal === MAIN_MODAL && (
            <ManageFundsOptions
              onAddFundsAutomaticallyClick={handleAddFundsAutomaticallyClick}
              onAddFundsViaBankTransferClick={
                handleAddFundsViaBankTransferClick
              }
              onWithdrawFundsClick={handleWithdrawFundsClick}
            />
          )}
          {currentModal === TOPUP_VIA_BANK_MODAL && (
            <TopupFundsViaBank
              yourAccountNumber={yourAccountNumber}
              hnryAccountName={hnryAccountName}
              hnryAccountNumber={hnryAccountNumber}
              hnryReference={hnryReference}
            />
          )}
          {currentModal === WITHDRAW_FUNDS_MODAL && (
            <WithdrawFunds
              availableBalance={availableBalance}
              withdrawalAmount={withdrawalAmount}
              setWithdrawalAmount={setWithdrawalAmount}
              setDisabledSubmit={setDisabledSubmit}
              jurisdiction={jurisdiction}
              hnryAccountBalanceFeature={hnryAccountBalanceFeature}
            />
          )}
          {currentModal === CREATE_ALLOCATION_MODAL && (
            <SetAllocation
              allocationFrequencyOptions={allocationFrequencyOptions}
              allocationTemplate={allocationTemplate}
              isImpersonating={isImpersonating}
              maxAllocationPercentage={maxAllocationPercentage}
              setAllocationPercentage={setAllocationPercentage}
              setAllocationFrequency={setAllocationFrequency}
              setAllocationCap={setAllocationCap}
              setAllocationLocked={setAllocationLocked}
              setShowModal={setShowModal}
              resetScreen={reset}
              setDisabledSubmit={setDisabledSubmit}
              allocationFrequency={allocationFrequency}
              allocationPercentage={allocationPercentage}
              allocationCap={allocationCap}
              allocationLocked={allocationLocked}
            />
          )}
          {currentModal !== MAIN_MODAL && (
            <div className="hnry-dialog-panel-actions">
              <Button
                classes="!tw-px-3"
                onClick={handleConfirm}
                disabled={disabledSubmit}
                variant="primary"
              >
                <span>{confirmButton}</span>
              </Button>
              <Button
                classes="!tw-px-3"
                onClick={handleBack}
                variant="secondary"
              >
                <span>Back</span>
              </Button>
            </div>
          )}
        </Modal>
      )}
      {showSCA && (
        <SCAConfirm actionName={scaChallengeResponse.challengeAction} deviceName={scaChallengeResponse.deviceRegistrationName} challengeId={scaChallengeResponse.challengeId} />
      )}
    </>
  );
};

export default ManageFundsModal;

import React, { useState, useMemo, useEffect } from "react";
import Icon from "../_atoms/icons/icon/Icon";
import Modal from "../_molecules/modal/Modal";
import TopupFunds, { iTopupFunds } from "./card/TopupFunds";
import SetupAllocation, { iSetupAllocation } from "./card/SetupAllocation";
import RadioButtonGroup from "../_molecules/radio_button_group/RadioButtonGroup";
import I18n from "../../utilities/translations";

const ADD_FUNDS_SCREEN = "add_funds";
const TOPUP_SCREEN = "topup_funds";
const SETUP_ALLOCATION_SCREEN = "setup_allocation";

export interface iCardAddFunds extends iTopupFunds, iSetupAllocation {
  hnryAccountBalanceFeature: boolean;
}
const ctx = { scope: "home.hnry_card" };

const CardAddFunds = ({
  hnryBsb,
  hnryAccountNumber,
  allocation,
  allocationTemplate,
  allocationFrequencyOptions,
  isImpersonating,
  maxAllocationPercentage,
  hnryAccountBalanceFeature,
}: iCardAddFunds) => {
  const setupTitle = I18n.t("setup_allocation.title", ctx);
  const setupEditTitle = I18n.t("setup_allocation.edit_title", ctx);
  const labelBsb = I18n.t("setup_allocation.label_bsb", ctx);
  const [showModal, setShowModal] = useState(false);
  const [screen, setScreen] = useState(ADD_FUNDS_SCREEN);
  const [selectedOption, setSelectedOption] = useState("");
  const [modalTitle, setModalTitle] = useState(I18n.t("add_funds.title", ctx));
  const [confirmCTA, setConfirmCTA] = useState("Next");
  const [existedAllocation, setExistedAllocation] = useState(allocation);

  useEffect(() => {
    if (screen === SETUP_ALLOCATION_SCREEN) {
      setModalTitle(existedAllocation ? setupEditTitle : setupTitle);
    }
  }, [existedAllocation, setupTitle, setupEditTitle, screen]);

  const handleClick = () => {
    setShowModal(true);
  };

  const handleChange = (value: string) => {
    setSelectedOption(value);
  };

  const resetScreen = () => {
    setModalTitle(I18n.t("add_funds.title", ctx));
    setScreen(ADD_FUNDS_SCREEN);
    setConfirmCTA("Next");
    setSelectedOption("");
  };

  const handleConfirm = () => {
    if (screen === ADD_FUNDS_SCREEN) {
      if (selectedOption === TOPUP_SCREEN) {
        setModalTitle(I18n.t("topup_funds.title", ctx));
        setConfirmCTA("Done");
        setScreen(selectedOption);
      } else if (selectedOption === SETUP_ALLOCATION_SCREEN) {
        setModalTitle(existedAllocation ? setupEditTitle : setupTitle);
        setConfirmCTA("");
        setScreen(selectedOption);
      } else {
        resetScreen();
      }
    } else {
      setShowModal(false);
      resetScreen();
    }
  };

  const options = useMemo(
    () => [
      {
        optionId: SETUP_ALLOCATION_SCREEN,
        name: existedAllocation ? setupEditTitle : setupTitle,
        description: I18n.t("setup_allocation.description", ctx),
      },
      {
        optionId: TOPUP_SCREEN,
        name: I18n.t("topup_funds.title", ctx),
        description: I18n.t("topup_funds.description", ctx),
      },
    ],
    [existedAllocation, setupEditTitle, setupTitle],
  );

  return (
    <>
      {!hnryAccountBalanceFeature && (
        <button className="hnry-button hnry-button--link" onClick={handleClick}>
          <Icon type="PlusIcon" classes="!tw-mx-0" />
          <span className="tw-block tw-pt-2 tw-text-xs">Add funds</span>
        </button>
      )}
      <Modal
        onCancel={resetScreen}
        open={showModal}
        setOpen={setShowModal}
        title={modalTitle}
        onConfirm={
          screen === SETUP_ALLOCATION_SCREEN ? undefined : handleConfirm
        }
        confirmCTA={confirmCTA}
        disabled={selectedOption === ""}
        closable
      >
        {screen === ADD_FUNDS_SCREEN && (
          <RadioButtonGroup
            onChange={handleChange}
            options={options}
            value={selectedOption}
          />
        )}
        {screen === TOPUP_SCREEN && (
          <TopupFunds
            hnryBsb={hnryBsb}
            hnryAccountNumber={hnryAccountNumber}
            labelBsb={labelBsb}
          />
        )}
        {screen === SETUP_ALLOCATION_SCREEN && (
          <SetupAllocation
            allocation={existedAllocation}
            setAllocation={setExistedAllocation}
            allocationTemplate={allocationTemplate}
            allocationFrequencyOptions={allocationFrequencyOptions}
            isImpersonating={isImpersonating}
            setShowModal={setShowModal}
            maxAllocationPercentage={maxAllocationPercentage}
            resetScreen={resetScreen}
          />
        )}
      </Modal>
    </>
  );
};

export default CardAddFunds;

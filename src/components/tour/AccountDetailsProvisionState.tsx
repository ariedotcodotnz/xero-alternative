import React, { useState } from "react";
import Modal from "../_molecules/modal/Modal";
import Button from "../_atoms/button/Button";
import I18n from "../../utilities/translations";

interface iAccountDetailsProvisionState {
  intercomLink: string;
}

const ctx = { scope: "home.call_to_action.time_to_get_paid.provision_state" };


const AccountDetailsProvisionState = ({ intercomLink }: iAccountDetailsProvisionState) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <div>
        <Button
          classes="hnry-button hnry-button--primary"
          onClick={() => setIsOpen(true)}
          dataTrackClick={{ eventName: "call_to_action_account_details_share_provision_state_click" }}>
          <span className="tw-text-sm">
            Share my account details
          </span>
        </Button>
      </div>
      <Modal
        open={isOpen}
        setOpen={setIsOpen}
        title={I18n.t("onboarding.v2.step_titles.complete_old")}
        id="hnry-account-details-modal"
      >
        <div className="alert alert-success my-2 max-w-lg" role="alert">
          <div className="tw-flex tw-justify-between tw-flex-col tw-text-center tw-p-4 tw-items-center tw-my-4 tw-text-gray-500">
            <h3 className="tw-text-lg tw-text-gray-800 tw-font-semibold tw-mb-4">{I18n.t("title", ctx)}</h3>
            <p className="tw-text-sm tw-text-gray-600 tw-mb-2">{I18n.t("paragraph_1", ctx)}</p>
            <p className="tw-text-sm tw-text-gray-600 tw-mb-4">{I18n.t("paragraph_2", ctx)}</p>
            <p className="tw-text-sm tw-text-gray-600 tw-mb-2"><a href={intercomLink} className="hui-link">Contact Us</a></p>
          </div>
        </div>

      </Modal>
    </>
  );
};

export default AccountDetailsProvisionState;


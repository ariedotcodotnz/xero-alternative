import React, { useState, useEffect } from "react";
import Icon from "@hui/_atoms/icons/icon/Icon";
import Modal from "@hui/_molecules/modal/Modal";
import Button from "@hui/_atoms/button/Button";
import ShareByEmail from "../dashboard/account_details/ShareByEmail";
import { UserAccountDetails } from "../../types/user.type";
import isValidEmail from "../../utilities/isValidEmail";
import SendAccountDetailsEmail from "../../API/send_account_details_email.api";
import I18n from "../../utilities/translations";

interface iAccountDetailsEmailModal {
  currentUser: UserAccountDetails;
  accountType?: string;
}

const AccountDetailsEmailModal = ({ currentUser, accountType }: iAccountDetailsEmailModal) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasFailedFirstSubmission, setHasFailedFirstSubmission] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState("");
  const [emailValidity, setEmailValidity] = useState<boolean>(true);

  const handleInputChange = (value: string) => {
    setInputValue(value);
  }

  const sendEmail = async () => {
    const result = await SendAccountDetailsEmail({ recipients: inputValue, accountType });

    setIsOpen(false);

    if (!result.status.ok) {
      toastr.error("Failed to send account details via email.");
    }
    toastr.success("Account details successfully sent via email.");
  };

  useEffect(() => {
    if (hasFailedFirstSubmission) {
      setEmailValidity(false);
    }
    if (isValidEmail(inputValue)) {
      setEmailValidity(true)
    }
    if (!isOpen) {
      setHasFailedFirstSubmission(false);
      setEmailValidity(true)
      setInputValue("");
    }
  }, [hasFailedFirstSubmission, inputValue, isOpen]);

  const handleConfirm = () => {
    if (inputValue) {
      if (isValidEmail(inputValue)) {
        setIsOpen(false);
        sendEmail();
      } else {
        setHasFailedFirstSubmission(true);
      }
    }
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="unstyled"
        classes="as-link d-flex flex-column align-items-center py-0 mx-auto"
        dataTrackClick={{ eventName: "account_provisioned_share_email_click" }}>
        <Icon
          type="EnvelopeIcon"
          classes="tw-text-white tw-h-6 tw-w-6"
        />
        <p className="small mx-auto">Email</p>
      </Button>
      <Modal
        open={isOpen}
        setOpen={setIsOpen}
        title={I18n.t("onboarding.v2.step_titles.template_email")}
        onConfirm={handleConfirm}
        confirmCTA={"Share"}
        id="hnry-account-details-modal"
      >
        <div>
          <ShareByEmail
            backToMainButton={() => setIsOpen(false)}
            currentUser={currentUser}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            isValid={emailValidity}
            accountType={accountType}
          />
        </div>
      </Modal>
    </>
  );
};

export default AccountDetailsEmailModal;

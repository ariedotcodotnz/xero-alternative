import React, { useState, useEffect } from "react";
import Icon from "../_atoms/icons/icon/Icon";
import Modal from "../_molecules/modal/Modal";
import Button from "../_atoms/button/Button";
import ShareByEmail from "./account_details/ShareByEmail";
import RadioButtonGroup from "../_molecules/radio_button_group/RadioButtonGroup";
import { UserAccountDetails } from "../../types/user.type";
import isValidEmail from "../../utilities/isValidEmail";
import SendAccountDetailsEmail from "../../API/send_account_details_email.api";
import I18n from "../../utilities/translations";

interface iAccountDetailsShareModule {
  currentUser: UserAccountDetails;
  accountType?: string;
  fromCallToAction?: boolean; // call to action is for when we summon this module in the cta banner just after completing onboarding tour
  eventContext?: string;
}

const SHARE_SCREEN = "share_screen";
const EMAIL_SCREEN = "email";
const SHARE_BY_EMAIL = "share_by_email";
const SHARE_VIA_DEVICE = "share_via_device";
const COPY_TO_CLIPBOARD = "copy_to_clipboard";
const DEPOSIT_SLIP = "download_deposit_slip";
const CREATE_AN_INVOICE = "create_an_invoice";

const radioGroupData = [
  {
    optionId: SHARE_BY_EMAIL,
    name: I18n.t("home.index.share_account_details.email.name"),
    description: I18n.t("home.index.share_account_details.email.description"),
  },
  navigator.share && navigator.canShare()
    ? {
        optionId: SHARE_VIA_DEVICE,
        name: I18n.t("home.index.share_account_details.mobile.name"),
        description: I18n.t(
          "home.index.share_account_details.mobile.description",
        ),
      }
    : {
        optionId: COPY_TO_CLIPBOARD,
        name: I18n.t("home.index.share_account_details.copy.name"),
        description: I18n.t(
          "home.index.share_account_details.copy.description",
        ),
      },
  {
    optionId: DEPOSIT_SLIP,
    name: I18n.t("home.index.share_account_details.download.name"),
    description: I18n.t(
      "home.index.share_account_details.download.description",
    ),
  },
  {
    optionId: CREATE_AN_INVOICE,
    name: I18n.t("home.index.share_account_details.invoice.name"),
    description: I18n.t("home.index.share_account_details.invoice.description"),
  },
];

const deriveAccountDetailsShareText = (
  currentUser: UserAccountDetails,
  accountType: string,
) => {
  if (currentUser.jurisdiction === "au") {
    if (accountType === "Domestic") {
      return `
          Name: ${currentUser.accountName}
          BSB: ${currentUser.bsb}
          Account number: ${currentUser.accountNumber}
          PayID: ${currentUser.payId}
        `;
    }

    return `
        Name: ${currentUser.accountName}
        Account number: ${currentUser.accountNumber}
        Bank name: ${currentUser.bankName}
        SWIFT/BIC: ${currentUser.swiftCode}
      `;
  }

  if (currentUser.jurisdiction === "uk") {
    return `
        Account name: ${currentUser.accountName}
        Account type: ${currentUser.accountType}
        Sort code: ${currentUser.bsb}
        Account number: ${currentUser.accountNumber}
      `;
  }

  return `
      Domestic
      Name: ${currentUser.accountName}
      Number: ${currentUser.accountNumber}

      International
      Bank name: ${currentUser.bankName}
      SWIFT/BIC: ${currentUser.swiftCode}
    `;
};

interface iAccountDetailsButtonEl {
  openModalHandler: (action: boolean) => void;
  eventContext?: string;
}

const CallToActionButton = ({ openModalHandler }: iAccountDetailsButtonEl) => (
  <div>
    <Button
      classes="hnry-button hnry-button--primary"
      onClick={() => openModalHandler(true)}
      dataTrackClick={{
        eventName: "call_to_action_account_details_share_click",
      }}
    >
      <span className="tw-text-sm">Share my account details</span>
    </Button>
  </div>
);

const DashboardButton = ({
  openModalHandler,
  eventContext,
}: iAccountDetailsButtonEl) => (
  <div className="tw-flex tw-flex-col">
    <Button
      onClick={() => openModalHandler(true)}
      variant="tertiary"
      dataTrackClick={{
        eventName: `${eventContext}_account_details_share_click`,
      }}
    >
      <span className="tw-pr-2 tw-text-sm">
        <Icon type="ArrowUpTrayIcon" classes="tw-mr-1" />
        Share
      </span>
    </Button>
  </div>
);

const AccountDetailsShareModule = ({
  currentUser,
  accountType,
  fromCallToAction = false,
  eventContext = "dashboard",
}: iAccountDetailsShareModule) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>(
    radioGroupData[0].optionId,
  );
  const [primaryButtonTitle, setPrimaryButtonTitle] = useState<string>("Share");
  const [screen, setScreen] = useState<string>(SHARE_SCREEN);
  const [hasConfirmedOnce, setHasConfirmedOnce] = useState<boolean>(false);
  const [hasFailedFirstSubmission, setHasFailedFirstSubmission] =
    useState<boolean>(false);
  const [inputValue, setInputValue] = useState("");
  const [emailValidity, setEmailValidity] = useState<boolean>(true);

  const backToMainScreen = () => {
    setHasConfirmedOnce(false);
    setScreen(SHARE_SCREEN);
  };

  const handleRadioChange = (value: string) => {
    setSelectedOption(value);

    switch (value) {
      case SHARE_BY_EMAIL:
      case SHARE_VIA_DEVICE:
        setPrimaryButtonTitle("Share");
        break;
      case COPY_TO_CLIPBOARD:
        setPrimaryButtonTitle("Copy");
        break;
      case DEPOSIT_SLIP:
        setPrimaryButtonTitle("Download");
        break;
      case CREATE_AN_INVOICE:
        setPrimaryButtonTitle("Create Invoice");
        break;
      default:
        setPrimaryButtonTitle("Share");
        break;
    }
  };

  const resetScreen = () => {
    backToMainScreen();
    handleRadioChange(radioGroupData[0].optionId);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const downloadPdf = async (accountName: string) => {
    const depositSlipPath = Routes.deposit_slip_path({ format: "pdf" });

    try {
      const response = await fetch(depositSlipPath);

      if (!response.ok) {
        toastr.error("Failed to download PDF.");
      }

      const link = Object.assign(document.createElement("a"), {
        href: response.url,
        target: "_blank",
        download: `${accountName} Deposit Slip.pdf`,
      });

      link.click();
      setIsOpen(false);
      toastr.success("PDF file downloaded successfully.");
    } catch (error) {
      setIsOpen(false);
      toastr.error("Failed to download PDF.");

      if (typeof Rollbar !== "undefined") {
        Rollbar.warning(error);
      }
    }
  };

  const sendEmail = async () => {
    const result = await SendAccountDetailsEmail({
      recipients: inputValue,
      accountType,
    });

    setIsOpen(false);
    window.analytics.track(`${eventContext}_account_details_share_by_email`);

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
      setEmailValidity(true);
    }
    if (!isOpen) {
      setScreen(SHARE_SCREEN);
      setHasConfirmedOnce(false);
      setHasFailedFirstSubmission(false);
      setEmailValidity(true);
      setInputValue("");
    }
  }, [hasFailedFirstSubmission, inputValue, isOpen]);

  const handleConfirm = () => {
    const copyText = deriveAccountDetailsShareText(currentUser, accountType);

    if (hasConfirmedOnce) {
      if (screen === EMAIL_SCREEN) {
        if (inputValue) {
          if (isValidEmail(inputValue)) {
            setIsOpen(false);
            sendEmail();
          } else {
            setHasFailedFirstSubmission(true);
          }
        }
      }
    } else {
      switch (selectedOption) {
        case SHARE_BY_EMAIL:
          setScreen(EMAIL_SCREEN);
          setPrimaryButtonTitle("Send");
          setHasConfirmedOnce(true);
          break;
        case SHARE_VIA_DEVICE:
          navigator
            .share({
              text: copyText,
            })
            .then(() => {
              window.analytics.track(
                `${eventContext}_account_details_share_by_device`,
              );
            })
            .catch((error) => {
              if (typeof Rollbar !== "undefined") {
                Rollbar.warning(error);
              }
            });
          break;
        case COPY_TO_CLIPBOARD:
          window.analytics.track(`${eventContext}_account_details_full_copied`);

          navigator.clipboard.writeText(copyText).then(
            () => {
              setIsOpen(false);
              toastr.success(
                `${accountType ?? ""} Account details copied to clipboard.`,
              );
            },
            () => {
              setIsOpen(false);
              toastr.error(
                `Failed to copy ${
                  accountType ?? ""
                } Account details to clipboard.`,
              );
            },
          );
          break;
        case DEPOSIT_SLIP:
          window.analytics.track(
            `${eventContext}_account_details_payslip_downloaded`,
          );

          downloadPdf(currentUser.accountName);
          break;
        case CREATE_AN_INVOICE:
          window.analytics.track(
            `${eventContext}_account_details_share_by_create_invoice`,
          );
          window.location.href = escape(encodeURI("/invoices"));
          break;
        default:
          setScreen(SHARE_SCREEN);
          break;
      }
    }
  };

  const openModalHandler = (action: boolean) => {
    setIsOpen(action);
  };

  return (
    <>
      {fromCallToAction ? (
        <CallToActionButton openModalHandler={openModalHandler} />
      ) : (
        <DashboardButton
          openModalHandler={openModalHandler}
          eventContext={eventContext}
        />
      )}
      <Modal
        onCancel={resetScreen}
        open={isOpen}
        setOpen={setIsOpen}
        title="Share your Hnry Account details"
        onConfirm={handleConfirm}
        confirmCTA={primaryButtonTitle}
        id="hnry-account-details-modal"
      >
        <div>
          {screen === SHARE_SCREEN && (
            <RadioButtonGroup
              options={radioGroupData}
              onChange={handleRadioChange}
              value={selectedOption}
            />
          )}
          {screen === EMAIL_SCREEN && (
            <ShareByEmail
              backToMainButton={backToMainScreen}
              currentUser={currentUser}
              inputValue={inputValue}
              onInputChange={handleInputChange}
              isValid={emailValidity}
              accountType={accountType}
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default AccountDetailsShareModule;

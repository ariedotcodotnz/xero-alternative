import React from "react"
import Modal from "@hui/_molecules/modal/Modal"
import LabeledConsentCheckbox from "@hui/_molecules/labeled_consent_checkbox/LabeledConsentCheckbox"
import { getUserJurisdictionCode } from "../../utilities/user_attributes";
import I18n from "../../utilities/translations";

interface iTaxConsentModal {
  taxRateConsentModalOpen: boolean;
  setTaxRateConsentModalOpen: (boolean) => void;
  taxRateConsent: boolean;
  setTaxRateConsent: (boolean) => void;
  submitIncomeSource: () => Promise<void>;
}

const ctx = "income_sources.consent_modal";

const TaxRateConsentModal = ({ taxRateConsentModalOpen, setTaxRateConsentModalOpen, taxRateConsent, setTaxRateConsent, submitIncomeSource }: iTaxConsentModal) => (
  <Modal
    id="tax-rate-consent-modal"
    title={ I18n.t("title", { scope: ctx }) }
    open={taxRateConsentModalOpen}
    setOpen={setTaxRateConsentModalOpen}
    cancelCTA="Back"
    onConfirm={submitIncomeSource}
    confirmCTA="Confirm"
    disabled={!taxRateConsent}
  >
    <div className="tw-prose-sm tw-text-gray-700 tw-mb-4">
      <p>{I18n.t("para_1", { scope: ctx })}</p>
      <p>{I18n.t("para_2", { scope: ctx })}</p>
      { !(getUserJurisdictionCode() === "uk") && // TODO: remove this conditional once tax rate calc docs available for UK
        <a 
          href={ I18n.t("learn_more_url", { scope: ctx }) }
          target="_blank"
          rel="noreferrer"
          className="hui-link hui-link--info"
        >
          Learn more
        </a>
      }
    </div>
    <LabeledConsentCheckbox
      id={"tax-rate-change-consent"}
      name={"tax-rate-change-consent"}
      onChange={setTaxRateConsent}
      label="I understand"
    />
  </Modal>
);

export default TaxRateConsentModal

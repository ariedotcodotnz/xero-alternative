import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import LabeledConsentCheckbox from "@hui/_molecules/labeled_consent_checkbox/LabeledConsentCheckbox";
import Subheading from "@hui/_atoms/subheading/Subheading";
import Paragraph from "@hui/_atoms/paragraph/Paragraph";
import postAuthorityToVerifyIdentity from "../../../API/onboarding/authority_to_verify_identity.api";
import I18n from "../../../utilities/translations";
import handleError from "../../../API/utils/handleError";
import FormWrapper from "./Shared/FormWrapper";
import FormBody from "./Shared/FormBody";
import {
  OnboardingTourFormRef,
  useOnboardingTour,
} from "./Shared/context/OnboardingTourContext";

interface iAuthorityToVerifyIdentityForm {
  stateUpdate: (...args) => void;
}

const AuthorityToVerifyIdentityForm = forwardRef<
  OnboardingTourFormRef,
  iAuthorityToVerifyIdentityForm
>(({ stateUpdate }, ref) => {
  const ctx = { scope: "onboarding.v3.authority_to_verify_identity" };
  const consentName = "authority_to_verify_identity_agreed";
  const consentLabel = I18n.t("consent_label", ctx);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const { setCanSubmitForm, setSecondaryBtnName, setIsSubmitting } =
    useOnboardingTour();

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      const res = await postAuthorityToVerifyIdentity(consentAccepted);
      if (res.status === "ok") {
        stateUpdate(res.data.state);
      } else {
        handleError(res);
      }
    } catch (err) {
      if (err.message === "Error: Unprocessable Content")
        toastr.error("Something went wrong, please try again");
      else {
        throw err;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setSecondaryBtnName(null);
  }, [setSecondaryBtnName]);

  useEffect(() => {
    setCanSubmitForm(consentAccepted);
  }, [consentAccepted, setCanSubmitForm]);

  useImperativeHandle(ref, () => ({
    submitForm: () => onSubmit(), // Expose the submit function
  }));

  return (
    <>
      <FormWrapper classes="tw-h-full">
        <form onSubmit={onSubmit} className="tw-flex tw-flex-1 tw-flex-col">
          <FormBody classes="tw-h-full">
            <div className="tw-flex tw-h-full tw-flex-col">
              <div className="tw-flex-grow">
                <Subheading>{I18n.t("title", ctx)}</Subheading>
                <Paragraph>{I18n.t("paragraph_1", ctx)}</Paragraph>
              </div>
              <div className="tw-mb-4">
                <LabeledConsentCheckbox
                  name={consentName}
                  onChange={setConsentAccepted}
                  label={consentLabel}
                  id={consentName}
                />
              </div>
            </div>
          </FormBody>
        </form>
      </FormWrapper>
    </>
  );
});
AuthorityToVerifyIdentityForm.displayName = "AuthorityToVerifyIdentityForm";
export default AuthorityToVerifyIdentityForm;

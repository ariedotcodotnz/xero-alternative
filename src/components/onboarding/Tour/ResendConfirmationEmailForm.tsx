import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import Button from "@hui/_atoms/button/Button";
import Subheading from "@hui/_atoms/subheading/Subheading";
import Paragraph from "@hui/_atoms/paragraph/Paragraph";
import I18n from "../../../utilities/translations";
import {
  postResendConfirmationEmail,
  postResendConfirmationEmailProgress,
} from "../../../API/onboarding/resend_confirmation_email.api";
import handleError from "../../../API/utils/handleError";
import { getUserEmail } from "../../../utilities/user_attributes";
import FormWrapper from "./Shared/FormWrapper";
import FormBody from "./Shared/FormBody";
import {
  OnboardingTourFormRef,
  useOnboardingTour,
} from "./Shared/context/OnboardingTourContext";

interface iResesndConfirmationEmailForm {
  stateUpdate: (...args) => void;
}

const ResendConfirmationEmailForm = forwardRef<
  OnboardingTourFormRef,
  iResesndConfirmationEmailForm
>(({ stateUpdate }, ref) => {
  const { setCanSubmitForm, setSecondaryBtnName, setIsSubmitting } =
    useOnboardingTour();

  const onEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      // We are calling the Auth::ConfirmationsController which does not return a json response so the body will be empty
      await postResendConfirmationEmail(getUserEmail());
      toastr.info(`Confirmation email sent to ${getUserEmail()}`);
    } catch (err) {
      toastr.error("Something went wrong, please try again");
    }
  };
  const ctx = { scope: "onboarding.v3.resend_confirmation_email" };

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      const res = await postResendConfirmationEmailProgress();
      if (res.status === "ok") {
        stateUpdate(res.data.state);
      } else {
        handleError(res);
      }
    } catch (err) {
      if (err.message === "Error: Unprocessable Content")
        toastr.error("Email address not confirmed, please try again");
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
    setCanSubmitForm(true);
  }, [setCanSubmitForm]);

  useImperativeHandle(ref, () => ({
    submitForm: () => onSubmit(), // Expose the submit function
  }));

  return (
    <>
      <FormWrapper>
        <form
          onSubmit={onSubmit}
          className="tw-flex tw-flex-1 tw-flex-col tw-overflow-hidden"
        >
          <FormBody>
            <Subheading>{I18n.t("title", ctx)}</Subheading>
            <Paragraph>
              {I18n.t("paragraph_1", { ...ctx, email_address: getUserEmail() })}
            </Paragraph>
            <Paragraph>{I18n.t("paragraph_2", ctx)}</Paragraph>
            <Button
              type="button"
              onClick={onEmailSubmit}
              variant="secondary"
              classes="tw-w-full tw-mt-4"
            >
              Resend email
            </Button>
          </FormBody>
        </form>
      </FormWrapper>
    </>
  );
});

ResendConfirmationEmailForm.displayName = "ResendConfirmationEmailForm";
export default ResendConfirmationEmailForm;

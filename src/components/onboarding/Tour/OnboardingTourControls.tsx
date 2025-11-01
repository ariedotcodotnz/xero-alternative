// in here should lie the inital alert component that displays the modal
import React, { useCallback, useEffect, useRef, useState } from "react";
import SignUpModal from "@hui/_molecules/modal/sign_up_modal/SignUpModal";
import MenuActions from "@hui/_molecules/modal/sign_up_modal/actions/menuItems";
import I18n from "../../../utilities/translations";
import StepOverview from "./StepOverview/StepOverview";
import { StepOverviewState } from "../../../API/onboarding/step_overview.api";
import AccountProvisionedForm from "./AccountProvisionedForm";
import AuthorityToVerifyIdentityForm from "./AuthorityToVerifyIdentity";
import BusinessRegistrationForm from "./BusinessRegistrationForm";
import PaymentConfirmed from "./PaymentConfirmed";
import PersonalBankAccountForm from "./PersonalBankAccountForm";
import ResendConfirmationEmailForm from "./ResendConfirmationEmailForm";
import SelfEmployedEstimateForm from "./SelfEmployedEstimateForm";
import TaxDetailsForm from "./TaxDetailsForm";
import IncomeDetailsForm from "./IncomeDetailsForm";
import VerifyIdentityExternalVerificationForm from "./VerifyIdentityExternalVerificationForm";
import WorkDetailsForm from "./WorkDetailsForm";
import {
  iOnboardingTourControls,
  OnboardingStates,
} from "./Shared/types/onboardingTypes";
import ConfirmYourIncomeForm from "./ConfirmYourIncomeForm";
import ChooseAnIdDocumentForm from "./ChooseAnIdDocumentForm";
import { OnboardingTourProvider } from "./Shared/context/OnboardingTourContext";
import PersonalDetailsForm from "./PersonalDetailsForm";
import PersonalContactDetailsForm from "./PersonalContactDetailsForm";
import ProofOfAddressForm from "./ProofOfAddressForm";
import VerifyIdentityBasicDetailsForm from "./VerifyIdentityBasicDetailsForm";
import CardOptInForm from "./CardOptInForm";
import convertCamelToSnakeCase from "../../../utilities/case-conversions/snakeCase";
import SectionIntroduction from "./SectionIntroduction";

const signupTourTitleFor = {
  business_registration: I18n.t("onboarding.v3.business_registration.title"),
  step_overview_1: I18n.t("onboarding.v3.step_overview.title"),
  self_employed_estimate: I18n.t("onboarding.v3.self_employed_estimate.title"),
  work_details: I18n.t("onboarding.v3.work_details.title"),
  income_details: I18n.t("onboarding.v3.income_details.title"),
  tax_details: I18n.t("onboarding.v3.tax_details.title"),
  step_overview_2: I18n.t("onboarding.v3.step_overview.title"),
  personal_details: I18n.t("onboarding.v3.personal_details.title"),
  personal_contact_details: I18n.t("onboarding.v3.personal_details.title"),
  step_overview_3: I18n.t("onboarding.v3.step_overview.title"),
  resend_confirmation_email: "Identity verification",
  authority_to_verify_identity: "Authority to verify identity",
  verify_identity_basic_details: I18n.t(
    "onboarding.v3.verify_identity_basic_details.title",
  ),
  choose_an_id_document: I18n.t("onboarding.v3.choose_an_id_document.title"),
  proof_of_address: I18n.t("onboarding.v3.proof_of_address.title"),
  verify_identity_external_verification: I18n.t(
    "onboarding.v3.verify_identity_external_verification.title",
  ),
  account_provisioned: I18n.t(
    "onboarding.v3.account_provisioned.title_loading",
  ),
  step_overview_4: I18n.t("onboarding.v3.step_overview.title"),
  card_opt_in: I18n.t("onboarding.v3.card_opt_in.title"),
  personal_bank_account: I18n.t("onboarding.v3.personal_bank_account.title"),
  confirm_your_income: I18n.t("onboarding.v3.confirm_your_income.title"),
  payment_confirmed: I18n.t("onboarding.v3.payment_confirmed.title"),
};

export interface FormMethods {
  submitForm: () => void; // The bespoke submit function
  submitSecondaryAction: () => void;
}

const OnboardingTourControls = ({
  financialYearStart,
  financialYearEnd,
  intercomLink,
  onboardingState,
  runVerificationOnLoad,
  userId,
  stepProgress,
  sectionIntroductionImages,
}: iOnboardingTourControls) => {
  const [tourState, setTourState] = useState(
    onboardingState || "business_registration",
  );
  const [modalTitle, setModalTitle] = useState<string>();
  const [open, setOpen] = useState(true);
  const currentFormRef = useRef<FormMethods | null>(null);

  const stepProgressFor = stepProgress
    ? convertCamelToSnakeCase(stepProgress)
    : null;

  useEffect(() => {
    setModalTitle(signupTourTitleFor[tourState]);
  }, [tourState]);

  const handleTourProgression = (nextStep: OnboardingStates) => {
    setTourState(nextStep);
  };

  const handleTitleUpdate = (title: string) => {
    setModalTitle(title);
  };

  const triggerNext = useCallback(() => {
    if (currentFormRef.current?.submitForm) {
      currentFormRef.current.submitForm(); // Invoke the child's bespoke submit function
    }
  }, []);

  const triggerSecondaryAction = () => {
    if (currentFormRef?.current?.submitSecondaryAction) {
      currentFormRef.current.submitSecondaryAction();
    } else {
      window.location = Routes.home_index_path();
    }
  };

  const signupTourFormFor = {
    business_registration: (
      <BusinessRegistrationForm
        stateUpdate={handleTourProgression}
        intercomLink={intercomLink}
        ref={currentFormRef}
      />
    ),
    step_overview_1: (
      <StepOverview
        state={tourState as StepOverviewState}
        stateUpdate={handleTourProgression}
        ref={currentFormRef}
      />
    ),
    personal_details_section: (
      <SectionIntroduction
        tourStep={tourState}
        stateUpdate={handleTourProgression}
        ref={currentFormRef}
        imageSrc={sectionIntroductionImages?.personalDetailsWide}
      />
    ),
    self_employed_estimate: (
      <SelfEmployedEstimateForm
        stateUpdate={handleTourProgression}
        financialYearStart={financialYearStart}
        financialYearEnd={financialYearEnd}
        ref={currentFormRef}
      />
    ),
    work_details: (
      <WorkDetailsForm
        stateUpdate={handleTourProgression}
        financialYearStart={financialYearStart}
        financialYearEnd={financialYearEnd}
        ref={currentFormRef}
      />
    ),
    income_details: (
      <IncomeDetailsForm
        stateUpdate={handleTourProgression}
        ref={currentFormRef}
      />
    ),
    tax_details: (
      <TaxDetailsForm
        stateUpdate={handleTourProgression}
        ref={currentFormRef}
      />
    ),
    step_overview_2: (
      <StepOverview
        state={tourState as StepOverviewState}
        stateUpdate={handleTourProgression}
        ref={currentFormRef}
      />
    ),
    work_details_section: (
      <SectionIntroduction
        tourStep={tourState}
        stateUpdate={handleTourProgression}
        ref={currentFormRef}
        imageSrc={sectionIntroductionImages?.workDetailsWide}
      />
    ),
    personal_details: (
      <PersonalDetailsForm
        stateUpdate={handleTourProgression}
        userId={userId}
        ref={currentFormRef}
      />
    ),
    personal_contact_details: (
      <PersonalContactDetailsForm
        stateUpdate={handleTourProgression}
        userId={userId}
        ref={currentFormRef}
      />
    ),
    step_overview_3: (
      <StepOverview
        state={tourState as StepOverviewState}
        stateUpdate={handleTourProgression}
        ref={currentFormRef}
      />
    ),
    identity_details_section: (
      <SectionIntroduction
        tourStep={tourState}
        stateUpdate={handleTourProgression}
        ref={currentFormRef}
        imageSrc={sectionIntroductionImages?.identityVerificationWide}
      />
    ),
    resend_confirmation_email: (
      <ResendConfirmationEmailForm
        stateUpdate={handleTourProgression}
        ref={currentFormRef}
      />
    ),
    authority_to_verify_identity: (
      <AuthorityToVerifyIdentityForm
        stateUpdate={handleTourProgression}
        ref={currentFormRef}
      />
    ),
    verify_identity_basic_details: (
      <VerifyIdentityBasicDetailsForm
        stateUpdate={handleTourProgression}
        ref={currentFormRef}
      />
    ),
    choose_an_id_document: (
      <ChooseAnIdDocumentForm
        stateUpdate={handleTourProgression}
        intercomLink={intercomLink}
        ref={currentFormRef}
      />
    ),
    proof_of_address: (
      <ProofOfAddressForm
        stateUpdate={handleTourProgression}
        ref={currentFormRef}
      />
    ),
    // eslint-disable-next-line max-len
    verify_identity_external_verification: (
      <VerifyIdentityExternalVerificationForm
        stateUpdate={handleTourProgression}
        intercomLink={intercomLink}
        runVerificationOnLoad={runVerificationOnLoad}
        userId={userId}
        ref={currentFormRef}
      />
    ),
    account_provisioned: (
      <AccountProvisionedForm
        stateUpdate={handleTourProgression}
        handleTitleUpdate={handleTitleUpdate}
        userId={userId}
        intercomLink={intercomLink}
        ref={currentFormRef}
      />
    ),
    step_overview_4: (
      <StepOverview
        state={tourState as StepOverviewState}
        stateUpdate={handleTourProgression}
        ref={currentFormRef}
      />
    ),
    customise_hnry_section: (
      <SectionIntroduction
        tourStep={tourState}
        stateUpdate={handleTourProgression}
        ref={currentFormRef}
        imageSrc={sectionIntroductionImages?.customiseAccountWide}
      />
    ),
    card_opt_in: (
      <CardOptInForm stateUpdate={handleTourProgression} ref={currentFormRef} />
    ),
    personal_bank_account: <PersonalBankAccountForm ref={currentFormRef} />,
    confirm_your_income: (
      <ConfirmYourIncomeForm
        stateUpdate={handleTourProgression}
        ref={currentFormRef}
      />
    ),
    payment_confirmed: <PaymentConfirmed ref={currentFormRef} />,
  };

  return (
    <OnboardingTourProvider>
      <SignUpModal
        open={open}
        setOpen={setOpen}
        title={modalTitle}
        moreActions={MenuActions({ intercomLink })}
        onNext={triggerNext}
        onSecondaryAction={triggerSecondaryAction}
        options={{
          onOpenAutoFocus: (event) => event.preventDefault(),
          hideOverlay: false,
        }}
        onboardingTourState={tourState}
        progressPercentage={stepProgressFor?.[tourState]}
      >
        {signupTourFormFor[tourState]}
      </SignUpModal>
    </OnboardingTourProvider>
  );
};

export default OnboardingTourControls;

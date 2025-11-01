import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import SteppedProgressBar, { stepsType } from "@hui/_molecules/stepped_progress_bar/SteppedProgressBar";
import Subheading from "@hui/_atoms/subheading/Subheading";
import Paragraph from "@hui/_atoms/paragraph/Paragraph";
import Confetti from "../../confetti"
import handleError from "../../../API/utils/handleError";
import { getPayslipPath, postPayslipPath } from "../../../API/onboarding/payment_confirmed.api";
import I18n from "../../../utilities/translations"
import UkPaymentConfirmed from "../../../../assets/images/onboarding_tour/uk_payment_confirmed.svg"
import FormWrapper from "./Shared/FormWrapper";
import FormBody from "./Shared/FormBody";
import { OnboardingTourFormRef, useOnboardingTour } from "./Shared/context/OnboardingTourContext";

const ctx = { scope: "onboarding.v3.payment_confirmed" };

const PaymentConfirmed = forwardRef<OnboardingTourFormRef>((_, ref) => {

  const [demoPayPath, setDemoPayPath] = useState<string>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setSecondaryBtnName, setPrimaryBtnName } = useOnboardingTour()

  useEffect(() => {
    setPrimaryBtnName(null)
    setSecondaryBtnName("Go to Dashboard")
  }, [setSecondaryBtnName, setPrimaryBtnName])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPayslipPath()
        if (res.status === "ok") {
          setPrimaryBtnName(!!res?.data?.payslip_path && "View Payslip")
          setDemoPayPath(res.data.payslip_path)
          setIsLoading(false)
        } else {
          handleError(res)
        }
      } catch (err) {
        toastr.error("Something went wrong, please try again");
        throw err
      }
    }

    if (isLoading) {
      fetchData();
    }

  }, [isLoading, setPrimaryBtnName]);

  const navigateToHomePage = () => {
    Turbolinks.visit(demoPayPath)
  }

  const { setCanSubmitForm } = useOnboardingTour()

  useEffect(() => {
    setCanSubmitForm(!isLoading)
  }, [setCanSubmitForm, isLoading])

  useImperativeHandle(ref, () => ({
    submitForm: () => navigateToHomePage(), // Expose the submit function
  }));

  /**
  push user into complete state so they don't nav back to here
  */
  useEffect(() => {
    postPayslipPath()
  }, []);

  const steps: stepsType = [
    {
      name: "",
      description: I18n.t("steps.step_1", ctx),
      status: "complete",
    },
    {
      name: "",
      description: I18n.t("steps.step_2", ctx),
      status: "complete",
    },
    {
      name: "",
      description: I18n.t("steps.step_3", ctx),
      status: "complete",
    }
  ];

  return (
    <FormWrapper>
      <div className="tw-flex tw-justify-center">
        <Confetti styles={{ position: "absolute" }} />
      </div>
      <div className="tw-flex tw-flex-col tw-flex-1 tw-overflow-hidden">
        <FormBody>
          <img src={UkPaymentConfirmed} className="tw-h-52 tw-mx-auto tw-mb-6" alt="Payment confirmed" />
          <Subheading>{I18n.t("paragraph_1", ctx)}</Subheading>
          <Paragraph>{I18n.t("paragraph_2", ctx)}</Paragraph>
          <SteppedProgressBar vertical={true} steps={steps} classes="!tw-min-h-min" />
        </FormBody>
      </div>
    </FormWrapper>
  )
})
PaymentConfirmed.displayName = "PaymentConfirmed"
export default PaymentConfirmed
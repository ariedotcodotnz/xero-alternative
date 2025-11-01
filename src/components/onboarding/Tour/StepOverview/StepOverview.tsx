import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import Subheading from "@hui/_atoms/subheading/Subheading";
import { iTourStep } from "./types";
import I18n from "../../../../utilities/translations";
import { postStepOverview, StepOverviewState } from "../../../../API/onboarding/step_overview.api";
import CompleteTourStep from "./CompleteTourStep";
import CurrentTourStep from "./CurrentTourStep";
import IncompleteTourStep from "./IncompleteTourStep";
import FormWrapper from "../Shared/FormWrapper";
import FormBody from "../Shared/FormBody";
import { OnboardingTourFormRef, useOnboardingTour } from "../Shared/context/OnboardingTourContext";


const StepOverview = forwardRef<OnboardingTourFormRef, { state: StepOverviewState, stateUpdate: (...args) => void }>(
  ({ state, stateUpdate }, ref) => {

    const { setCanSubmitForm, setSecondaryBtnName, setPrimaryBtnName, primaryBtnName, setIsSubmitting } = useOnboardingTour()

    useEffect(() => {
      setCanSubmitForm(true)
      if (primaryBtnName !== "Next") {
        setPrimaryBtnName("Next");
      }
      setSecondaryBtnName("I'll do it later")
    }, [primaryBtnName, setCanSubmitForm, setPrimaryBtnName, setSecondaryBtnName])

    const onSubmit = async () => {
      try {
        setIsSubmitting(true)
        const res = await postStepOverview(state);
        stateUpdate(res.data.state);
      } catch (err) {
        toastr.error("Something went wrong, please try again");
        throw err;
      } finally {
        setIsSubmitting(false)
      }
    };

    const submitFormViaLink = async (e) => {
      e.preventDefault()
      await onSubmit()
    }


    const buildSteps = () => {
      const data: iTourStep[] = Object.values(I18n.t("onboarding.v3.step_overview.step_data"));

      const currentStepNumber = Number(state.at(-1)) + 1;


      return data.map((step) => {
        if (step.number < currentStepNumber) return <CompleteTourStep key={step.number} {...step} />
        if (step.number === currentStepNumber) return <CurrentTourStep key={step.number} {...step} trigger={submitFormViaLink} onboardingTourState={state} />
        return <IncompleteTourStep key={step.number} {...step} />
      })
    };

    useImperativeHandle(ref, () => ({
      submitForm: async () => onSubmit(), // Expose the submit function
    }));

    return (
      <FormWrapper>
        <form onSubmit={onSubmit} className="tw-flex tw-flex-col tw-flex-1 tw-overflow-hidden">
          <FormBody>
            <Subheading>{I18n.t("onboarding.v3.step_overview.required_text")}</Subheading>
            <div className="tw-flex tw-flex-col tw-gap-3">
              {buildSteps()}
            </div>
          </FormBody>
        </form>
      </FormWrapper>
    );
  })

StepOverview.displayName = "StepOverviewForm";


export default StepOverview;

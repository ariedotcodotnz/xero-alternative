import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm, Controller } from "react-hook-form";
import Subheading from "@hui/_atoms/subheading/Subheading";
import Paragraph from "@hui/_atoms/paragraph/Paragraph";
import Slider from "@hui/_atoms/slider/Slider";
import {
  postSkipCardOptIn,
  cardOptInDto,
  postCardOptIn,
} from "@api/onboarding/card_opt_ins.api";
import { handleHashedError } from "../../../API/utils/handleError";
import convertCamelToSnakeCase from "../../../utilities/case-conversions/snakeCase";
import { cardOptInForm } from "./Shared/types/onboardingTypes";
import I18n from "../../../utilities/translations";
import FormWrapper from "./Shared/FormWrapper";
import FormBody from "./Shared/FormBody";
import {
  OnboardingTourFormRef,
  useOnboardingTour,
} from "./Shared/context/OnboardingTourContext";
import HnryCardUk from "../../../../assets/images/hnry_card/hnry_card_uk.svg";

const ctx = { scope: "onboarding.v3.card_opt_in" };

interface iCardOptInForm {
  stateUpdate: (...args) => void;
}

const CardOptInForm = forwardRef<OnboardingTourFormRef, iCardOptInForm>(
  ({ stateUpdate }, ref) => {
    const {
      handleSubmit,
      watch,
      formState: { isValid },
      control,
    } = useForm<cardOptInForm>({
      mode: "onTouched",
      defaultValues: { signupCardAllocationPreferencePercentage: [20] },
    });
    const {
      setCanSubmitForm,
      setPrimaryBtnName,
      setSecondaryBtnName,
      setSecondaryActionEvent,
      isSubmitting,
      setIsSubmitting,
    } = useOnboardingTour();

    useEffect(() => {
      setCanSubmitForm(isValid);
    }, [isValid, setCanSubmitForm]);

    useEffect(() => {
      setPrimaryBtnName("Next");
    }, [setPrimaryBtnName]);

    useEffect(() => {
      setSecondaryBtnName("I'll do it later");
      setSecondaryActionEvent({
        eventName: "skipped_opt_in_modals",
        data: { tour_step: "card_opt_in" },
      });
      return () => {
        setSecondaryBtnName(null);
        setSecondaryActionEvent(null);
      };
    }, [setSecondaryActionEvent, setSecondaryBtnName]);

    const onSubmit = async (body: cardOptInForm) => {
      if (isSubmitting) {
        return;
      }
      try {
        setIsSubmitting(true);
        const [submitNumber] = body.signupCardAllocationPreferencePercentage;
        const formattedRequest = convertCamelToSnakeCase({
          signup_card_allocation_preference_percentage: submitNumber,
        }) as cardOptInDto;

        const res = await postCardOptIn(formattedRequest);
        if (res.status === "ok") {
          stateUpdate(res.data.state);
        } else {
          handleHashedError(res);
        }
      } catch (err) {
        toastr.error("Something went wrong, please try again");
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    };

    const onSubmitSecondaryAction = async () => {
      try {
        const res = await postSkipCardOptIn();
        if (res.status === "ok") {
          stateUpdate(res.data.state);
        } else {
          handleHashedError(res);
        }
      } catch (err) {
        toastr.error("Something went wrong, please try again");
        throw err;
      }
    };

    useImperativeHandle(ref, () => ({
      submitForm: () => handleSubmit(onSubmit)(), // Expose the submit function
      submitSecondaryAction: () => onSubmitSecondaryAction(),
    }));

    const percentage = watch("signupCardAllocationPreferencePercentage");

    return (
      <>
        <FormWrapper>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="tw-flex tw-flex-1 tw-flex-col"
          >
            <FormBody>
              <div className="tw-mb-5 tw-flex tw-justify-center">
                <img
                  className="tw-rounded-lg"
                  src={HnryCardUk}
                  alt="Hnry Debit Card"
                  width="230"
                  height="120"
                />
              </div>
              <Paragraph>{I18n.t("paragraph_1", ctx)}</Paragraph>
              <Paragraph>{I18n.t("paragraph_2", ctx)}</Paragraph>
              <Subheading>{I18n.t("percentage_label", ctx)}</Subheading>
              <div className="tw-mb-4 tw-mt-6">
                <Controller
                  control={control}
                  name="signupCardAllocationPreferencePercentage"
                  rules={{ required: "Please select a percentage" }}
                  render={({ field: { onChange, value } }) => (
                    <Slider
                      value={value}
                      min={1}
                      max={45}
                      onValueChange={onChange}
                    />
                  )}
                />
              </div>
              <Paragraph>
                <>
                  <span className="tw-font-bold">{percentage}% </span>
                  {I18n.t("paragraph_3", ctx)}
                </>
              </Paragraph>
            </FormBody>
          </form>
        </FormWrapper>
      </>
    );
  },
);

CardOptInForm.displayName = "CardOptInForm";

export default CardOptInForm;

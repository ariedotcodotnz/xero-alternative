import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import DOMPurify from "dompurify";
import {
  OnboardingTourFormRef,
  useOnboardingTour,
} from "./Shared/context/OnboardingTourContext";
import { containsHTML, sectionIntroductionI18nHelper } from "./utils/helpers";
import { SectionIntroductionProps } from "./Shared/types/onboardingTypes";
import WaveWide from "../../../../assets/images/onboarding_tour/wave_wide.svg";
import { postSectionIntroduction } from "../../../API/onboarding/SectionIntroduction.api";
import I18n from "../../../utilities/translations";

const SectionIntroduction = forwardRef<
  OnboardingTourFormRef,
  SectionIntroductionProps
>(({ stateUpdate, imageSrc, tourStep }, ref) => {
  const { setCanSubmitForm, setIsHeaderShown, setIsSubmitting } =
    useOnboardingTour();

  const {
    heading,
    subHeading,
    paragraph1,
    paragraph2,
    listItems,
    listItemsIntro,
  } = sectionIntroductionI18nHelper(tourStep);

  useEffect(() => {
    setIsHeaderShown(false);
    setCanSubmitForm(true);
    return () => {
      setIsHeaderShown(true);
    };
  }, [setIsHeaderShown, setCanSubmitForm]);

  const handleText = (text: string) => {
    // we cant set empty values in the I18n files. We set a default value (empty) on the helper which gets returned if the field is not found
    // which we can use to return null here.
    if (text.toLocaleLowerCase() === "empty") {
      return null;
    }
    if (containsHTML(text)) {
      return (
        <div
          // eslint-disable-next-line xss/no-mixed-html, react/no-danger
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }}
          className="tw-pb-2"
        />
      );
    }

    return <div className="tw-pb-2">{text}</div>;
  };

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      const {
        data: { state },
      } = await postSectionIntroduction(tourStep);
      stateUpdate(state);
    } catch (err) {
      toastr.error(I18n.t("onboarding.v3.section_introductions.generic_error"));
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  useImperativeHandle(ref, () => ({
    submitForm: () => onSubmit(), // Expose the submit function
  }));

  return (
    <div
      className="tw-flex tw-flex-col tw-text-gray-700"
      id="TourStepSectionIntroduction"
    >
      <div className="tw-relative tw-pb-2">
        {imageSrc && (
          <>
            <img
              src={imageSrc}
              alt="personal_details"
              className="tw-h-[45dvh] tw-max-h-[45dvh] tw-w-full tw-rounded-lg tw-object-cover sm:tw-h-[25dvh]"
            />
            <img
              src={WaveWide}
              alt="wave"
              className="tw-absolute tw-bottom-0 tw-left-0 tw-w-full"
            />
          </>
        )}
      </div>
      <header className="tw-pb-4">
        <Dialog.Title className="tw-my-0 tw-grow tw-text-left tw-text-xl tw-font-semibold tw-leading-6 tw-text-gray-900">
          {handleText(heading)}
        </Dialog.Title>
      </header>
      <div className="tw-pb-2 tw-text-base tw-font-semibold tw-text-gray-900">
        {handleText(subHeading)}
      </div>
      {handleText(paragraph1)}
      <div>
        {handleText(listItemsIntro) && (
          <>
            {handleText(listItemsIntro)}
            {listItems && (
              <ul className="!tw-list-disc tw-pl-8 tw-pt-2">
                {Object.values(listItems).map((item) => (
                  <li key={`section_introduction_${item}`} className="tw-pb-1">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
      {handleText(paragraph2)}
    </div>
  );
});

SectionIntroduction.displayName = "SectionIntroduction";
export default SectionIntroduction;

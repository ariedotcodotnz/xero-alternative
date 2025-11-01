import React, { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import classNames from "classnames";
import { useOnboardingTour } from "@hui/onboarding/Tour/Shared/context/OnboardingTourContext";
import FormButton from "@hui/onboarding/Tour/Shared/FormButton";
import Button from "@hui/_atoms/button/Button";
import { OnboardingStates } from "@hui/onboarding/Tour/Shared/types/onboardingTypes";
import ProgressBar from "@hui/_molecules/progress_bar/ProgressBar";
import isMobile from "@hutils/isMobile";

interface iSignUpModalOptions {
  double?: boolean;
  extraHeaderContent?: React.ReactNode;
  hideOverlay?: boolean;
  id?: string;
  onOpenAutoFocus?: (event: Event) => void;
  onOutsideCloseAction?: (event: Event) => void;
  modalClasses?: string;
}

export interface iSignUpModal {
  children: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  moreActions: React.ReactNode;
  onNext: () => void;
  onSecondaryAction?: () => void;
  options?: iSignUpModalOptions;
  onboardingTourState: OnboardingStates;
  progressPercentage?: number | undefined;
}

const SignUpModal = ({
  children,
  open = false,
  setOpen,
  title,
  moreActions,
  onNext,
  onSecondaryAction,
  onboardingTourState,
  progressPercentage,
  options: {
    double = false,
    extraHeaderContent,
    hideOverlay = false,
    id = undefined,
    onOpenAutoFocus = undefined,
    onOutsideCloseAction = undefined,
    modalClasses,
  },
}: iSignUpModal) => {
  const {
    canSubmitForm,
    isSubmitting,
    primaryBtnTestId,
    primaryBtnName,
    secondaryBtnName,
    secondaryActionEvent,
    childContainerHeight,
    isHeaderShown,
  } = useOnboardingTour();
  /**
   * purely here so we can resolve the issue with fit content on safari desktop views
   */
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const [isFooterShadowApplied, setIsFooterShadowApplied] = useState(false);

  const containerRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [scrollRef, onboardingTourState]);

  useEffect(() => {
    if (childContainerHeight > containerRef?.current?.offsetHeight) {
      setIsFooterShadowApplied(true);
    } else {
      setIsFooterShadowApplied(false);
    }
  }, [childContainerHeight]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Overlay
        className={classNames({
          "hnry-dialog-transition data-[state=closed]:tw-animate-opacityHideFast data-[state=open]:tw-animate-opacityShowFast":
            !hideOverlay,
        })}
      />
      {/* content should dictate size of the modal */}
      <Dialog.Content
        onOpenAutoFocus={onOpenAutoFocus}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={onOutsideCloseAction} // reusing same function on both actions so that clicking off modal and hitting esc have the same effect
        id={id}
        className={classNames(
          "tw-data-[state=open]:tw-animate-opacityShowFast tw-data-[state=closed]:tw-animate-opacityHideFast tw-fixed tw-inset-0 tw-z-10 tw-flex tw-h-dvh tw-w-dvw tw-flex-col tw-overflow-hidden tw-rounded-none tw-bg-white tw-pb-4 tw-pt-5 tw-shadow-xl tw-transition-all focus:tw-outline-none sm:tw-left-1/2 sm:tw-top-1/2 sm:!tw-max-h-[90vh] sm:!tw-max-w-[32rem] sm:-tw-translate-x-1/2 sm:-tw-translate-y-1/2 sm:tw-rounded-lg sm:!tw-p-6 sm:tw-px-4 md:tw-w-[90vw] md:tw-max-w-[32rem]",
          {
            [`${modalClasses}`]: modalClasses,
            "tw-max-w-[48rem]": double,
            "!shadow-[0_5px_25px_0_rgb(0,0,0,0.4)]": hideOverlay,
            "md:!tw-h-fit": !isSafari,
          },
        )}
      >
        <div className="tw-flex tw-h-full tw-flex-col tw-overflow-hidden sm:tw-p-1">
          {isHeaderShown && (
            <header className="tw-shadow-b tw-sticky tw-top-0 tw-z-10 tw-mb-6 tw-flex tw-items-center tw-justify-between tw-bg-white tw-px-4 sm:tw-px-0">
              {extraHeaderContent}
              <Dialog.Title className="tw-my-0 tw-grow tw-text-left tw-text-xl tw-font-semibold tw-leading-6 tw-text-gray-900">
                {title}
              </Dialog.Title>
              {moreActions}
            </header>
          )}
          {progressPercentage ? (
            <div className="tw-sticky tw-top-0 tw-bg-white tw-px-4 tw-pb-6 sm:tw-px-0">
              <ProgressBar progressStart={0} progressEnd={progressPercentage} />
            </div>
          ) : null}
          <div className="t tw-flex-grow tw-overflow-y-auto" ref={scrollRef}>
            <div
              className="tw-h-full tw-space-y-4 tw-px-4 tw-pb-4 sm:tw-px-0 md:tw-h-auto"
              ref={containerRef}
            >
              {children}
            </div>
          </div>
          <footer
            className={classNames(
              "tw-z-5h tw-w-full tw-bg-white tw-px-4 sm:tw-px-0",
              {
                "tw-z-5 tw-shadow-[0_-4px_8px_-2px_rgba(16,24,40,0.1)]":
                  isFooterShadowApplied && isMobile,
              },
            )}
          >
            <FormButton classes="tw-flex tw-flex-col tw-gap-3">
              {/* form should also be invalid if calculations are not complete yet */}
              {primaryBtnName ? (
                <Button
                  type="submit"
                  onClick={onNext}
                  disabled={!canSubmitForm}
                  dataTestId={primaryBtnTestId}
                  dataTrackClick={{
                    eventName: "tour_progress",
                    data: { tour_step: `${onboardingTourState}_completed` },
                  }}
                  classes="hnry-button hnry-button--primary tw-w-full"
                  loading={isSubmitting}
                >
                  {primaryBtnName}
                </Button>
              ) : null}

              {secondaryBtnName ? (
                <Button
                  type="button"
                  onClick={onSecondaryAction}
                  variant="secondary"
                  dataTrackClick={
                    secondaryActionEvent ?? {
                      eventName: "tour_progress",
                      data: { tour_step: `${onboardingTourState}_cancelled` },
                    }
                  }
                  classes="hnry-button hnry-button--secondary tw-w-full"
                >
                  {" "}
                  {secondaryBtnName}
                </Button>
              ) : null}
            </FormButton>
          </footer>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
export default SignUpModal;

import React, { useEffect, useRef } from "react";
import Icon from "../../../_atoms/icons/icon/Icon";
import { iTourStep } from "./types";

const CurrentTourStep = ({
  description,
  timeEstimate,
  number,
  title,
  trigger,
  onboardingTourState
}: iTourStep) => {
  const stepRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      stepRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <button
      ref={stepRef}
      onClick={trigger}
      data-track-click={JSON.stringify({eventName: "tour_progress", data: { tour_step: `${onboardingTourState}_complete` }})}
      className="tw-text-left tw-transition tw-duration-100 hover:tw-bg-brand-50 focus:tw-bg-brand-50 active:tw-bg-brand-50 tw-rounded-lg tw-mb-1"
    >
      <div className="tw-relative tw-py-4 tw-px-3 tw-rounded-lg tw-border tw-text-gray-900 tw-border-brand-200">
        <h3 className="tw-text-sm md:tw-text-base tw-text-inherit tw-font-semibold tw-pr-8 tw-ml-1 tw-mb-1">{number}. {title}</h3>
        <p className="tw-text-sm md:tw-text-base tw-leading-4 tw-pr-8 tw-mb-1">{description}</p>
        <span className="tw-absolute tw-right-3 tw-top-8 md:tw-top-10 tw-flex tw-items-center">
          <Icon type="ChevronRightIcon" size="lg" classes="!tw-text-brand-400" />
        </span>
        <p className="tw-mb-0 tw-text-xs md:tw-text-sm tw-font-bold tw-text-gray-600">{timeEstimate}</p>
      </div>
    </button>
  );
};

export default CurrentTourStep;

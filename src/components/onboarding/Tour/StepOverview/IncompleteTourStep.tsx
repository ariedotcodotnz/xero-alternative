import React from "react";
import Icon from "../../../_atoms/icons/icon/Icon";
import { iTourStep } from "./types";

const IncompleteTourStep = ({
  description,
  timeEstimate,
  number,
  title,
}: iTourStep) => (
  <div className="tw-relative tw-py-4 tw-px-3 tw-mb-1 tw-rounded-lg tw-text-gray-800 tw-opacity-65">
    <h3 className="tw-text-sm md:tw-text-base tw-text-inherit tw-font-semibold tw-pr-8 tw-ml-1 tw-mb-1">{number}. {title}</h3>
    <p className="tw-text-sm md:tw-text-base tw-leading-4 tw-pr-8 tw-mb-1">{description}</p>
    <span className="tw-absolute tw-right-3 tw-top-8 md:tw-top-10 tw-flex tw-items-center">
      <Icon type="ChevronRightIcon" size="lg" classes="!tw-text-gray-400" />
    </span>
    <p className="tw-mb-0 tw-text-xs md:tw-text-sm tw-font-bold tw-text-gray-800">{timeEstimate}</p>
  </div>
);

export default IncompleteTourStep;

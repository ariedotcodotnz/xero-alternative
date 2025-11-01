import React from "react";

import classNames from "classnames";
import {
  getIncomeBeforeTax,
  getApprovedExpenses,
  getDate,
  getProfit,
  formatDateMonYYYY,
  clamp,
} from "./helpers";

import { formatToLocalCurrency } from "../../../utilities/currency/currency_format";
import { getUserJurisdictionCode } from "../../../utilities/user_attributes";

import {
  IncomeExepenseTooltipType,
  IncomeExpenseTooltipContentType,
} from "./types";

export const IncomeExpenseTooltipContent = ({
  colorScale,
  dateScale,
  layout,
  monthData,
  posX,
  tooltipElement,
  yScale,
}: IncomeExpenseTooltipContentType): IncomeExepenseTooltipType | null => {
  if (
    getIncomeBeforeTax(monthData) === 0 &&
    getApprovedExpenses(monthData) === 0
  )
    return null;

  const theData = [
    {
      label: "Gross income",
      data: formatToLocalCurrency(
        getIncomeBeforeTax(monthData),
        getUserJurisdictionCode(),
        {
          decimals: true,
        },
      ),
      color: colorScale("incomeBeforeTax"),
    },
    {
      label: "Claimed expenses",
      data: formatToLocalCurrency(
        getApprovedExpenses(monthData),
        getUserJurisdictionCode(),
        {
          decimals: true,
        },
      ),
      color: colorScale("approvedExpenses"),
    },
    {
      label: "Monthly profit",
      data: formatToLocalCurrency(
        getProfit(monthData),
        getUserJurisdictionCode(),
        {
          decimals: true,
        },
      ),
      color: colorScale("profit"),
    },
  ];

  let posXAdjusted = posX + dateScale.bandwidth();
  let posY = 0;
  let tooltipOutsideXBounds = false;
  let arrowY = 0;

  if (tooltipElement) {
    tooltipOutsideXBounds =
      posX + dateScale.bandwidth() + tooltipElement.offsetWidth > layout.width;

    posY = layout.height / 2 - tooltipElement.offsetHeight / 2;

    const idealPosition = yScale(getProfit(monthData)) - posY;
    arrowY = clamp(idealPosition, 10, tooltipElement.offsetHeight - 30);

    if (tooltipOutsideXBounds) {
      posXAdjusted = posX - tooltipElement.offsetWidth - 20;
    }
  }

  const tooltipClasses = classNames(
    "tw-relative tw-rounded-lg tw-border-2 tw-border-brand-100 tw-bg-white tw-w-36 tw-text-sm tw-leading-none tw-shadow-md tw-py-3 tw-px-2",
    {
      "-tw-ml-2": !tooltipOutsideXBounds,
    },
    {
      "-tw-mr-2": tooltipOutsideXBounds,
    },
  );

  const tooltipDataElement = (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <div className="tw-text-center tw-text-gray-500 tw-font-semibold">
        {formatDateMonYYYY(getDate(monthData))}
      </div>
      <div
        className={classNames(
          "tw-absolute tw-w-4 tw-h-4 tw-bg-white tw-rounded-sm tw-border-2 tw-border-brand-100 tw-transition-all tw-translate-y-2",
          {
            "-tw-left-2 tw-rotate-45": !tooltipOutsideXBounds,
          },
          {
            "tw-right-0 -tw-mr-2 tw-rotate-[225deg]": tooltipOutsideXBounds,
          },
        )}
        style={{
          top: `${arrowY}px`,
          clipPath: "polygon(0 100%, 0 0, 100% 100%)",
        }}
      ></div>
      {theData.map((d) => (
        <div key={d.label} className="tw-relative tw-pl-4 tw-rounded-full">
          <span
            className="tw-block tw-absolute -tw-top-0.5 tw-left-0 -tw-bottom-0.5 tw-w-2 tw-mr-4 tw-rounded-full"
            style={{ background: d.color.from }}
          ></span>
          <div className="tw-text-gray-700 tw-mb-0.5 tw-text-xs">{d.label}</div>
          <div className="tw-text-gray-700 tw-font-bold">{d.data}</div>
        </div>
      ))}
    </div>
  );

  return {
    tooltipLeft: posXAdjusted,
    tooltipTop: posY,
    tooltipData: <div className={tooltipClasses}>{tooltipDataElement}</div>,
  };
};

export default IncomeExpenseTooltipContent;

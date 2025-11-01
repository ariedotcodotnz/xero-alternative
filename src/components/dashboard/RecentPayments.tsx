import React from "react";
import Icon from "../_atoms/icons/icon/Icon";
import EmptyStateModule from "./EmptyStateModule";
import I18n from "../../utilities/translations";

type PayLineType = {
  id: number;
  name: string;
  paidDate: string;
  amount: string;
};

interface RecentPaymentsProps {
  emptyStateImageSrc: string;
  payLines?: PayLineType[];
}

const scope = { scope: "home.index.cards.empty_state" };

const RecentPayments = ({
  emptyStateImageSrc,
  payLines,
}: RecentPaymentsProps) => {
  if (payLines.length > 0) {
    return (
      <ul className="tw-mb-0 tw-divide-y tw-divide-gray-100">
        {payLines.map((payLine) => {
          const { id, amount, paidDate, name } = payLine;

          return (
            <li className="hover:tw-bg-gray-50" key={`pay-line-item-${id}`}>
              <a
                href={Routes.pay_line_path(id || 0)}
                data-track-click='{ "eventName": "dashboard_recent_payments_item_click" }'
                className="tw-flex tw-items-center tw-justify-between tw-gap-x-6 tw-py-2"
              >
                <div className="tw-flex tw-min-w-0 tw-gap-x-4">
                  <div className="tw-min-w-0 tw-flex-auto">
                    <p className="tw-mb-0 tw-text-base tw-font-medium tw-leading-6 tw-text-gray-900">
                      <span className="tw-overflow-hidden tw-text-ellipsis">
                        {name}
                      </span>
                    </p>
                    <p className="tw-mb-0 tw-truncate tw-text-xs tw-leading-5 tw-text-gray-500">
                      {paidDate}
                    </p>
                  </div>
                </div>
                <div className="tw-flex tw-items-center">
                  <p className="tw-mb-0 tw-mr-2 tw-text-base tw-font-semibold tw-leading-6 tw-text-gray-900">
                    {amount}
                  </p>
                  <Icon type="ChevronRightIcon" size="base" />
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <EmptyStateModule
      title={I18n.t("payslips_title", scope)}
      subtext={I18n.t("payslips_subtext", scope)}
      hideButton
      emptyStateImageSrc={emptyStateImageSrc}
      altImgText="Stack of coins and notes"
    />
  );
};

export default RecentPayments;

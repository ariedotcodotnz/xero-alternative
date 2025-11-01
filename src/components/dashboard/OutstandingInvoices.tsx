import React from "react";
import InvoiceStatus, { iInvoiceStatus } from "../invoices/InvoiceStatus";
import EmptyStateModule from "./EmptyStateModule";
import I18n from "../../utilities/translations";

type InvoiceType = {
  id: number;
  invoiceNumber: string;
  daysTillDueInWords: string;
  clientName: string;
  total: number;
  statusObject: iInvoiceStatus;
  accessToken: string;
  daysTillDue: number;
};

interface OutstandingInvoicesProps {
  invoices?: InvoiceType[];
  emptyStateImageSrc: string;
  hasAtLeastOneInvoice: boolean;
  createUrl: string;
}

const emptyStateScope = { scope: "home.index.cards.empty_state.invoices" };

const OutstandingInvoices = ({
  invoices,
  emptyStateImageSrc,
  hasAtLeastOneInvoice,
  createUrl,
}: OutstandingInvoicesProps) => {
  if (invoices.length > 0) {
    return (
      <ol className="hui-stacked-list tw-max-h-72 tw-overflow-y-auto md:tw-max-h-96 xl:tw-max-h-80">
        {invoices
          .sort((a, b) => (a.daysTillDue < b.daysTillDue ? -1 : 1))
          .map((inv) => {
            const {
              id,
              total,
              invoiceNumber,
              daysTillDueInWords,
              clientName,
              statusObject,
              accessToken,
            } = inv;

            return (
              <li key={`pay-line-item-${id}`}>
                <a
                  href={accessToken}
                  data-track-click='{ "eventName": "dashboard_outstanding_invoices_item_click" }'
                  className="hui-stacked-list__item"
                >
                  <div className="hui-stacked-list__item-left">
                    <p className="tw-mb-0 tw-text-base tw-font-medium tw-leading-6 tw-text-gray-900">
                      <span className="tw-overflow-hidden tw-text-ellipsis">
                        {clientName}
                      </span>
                    </p>
                    <p className="tw-mb-0 tw-truncate tw-text-gray-500">
                      <span className="tw-text-xs tw-leading-4">{`Due ${daysTillDueInWords} • ${invoiceNumber}`}</span>
                    </p>
                  </div>
                  <div className="hui-stacked-list__item-right tw-flex-col">
                    <p className="tw-mb-0 tw-mr-2 tw-text-base tw-font-semibold tw-leading-6 tw-text-gray-900 xl:tw-text-sm 2xl:tw-text-base">
                      {total}
                    </p>
                    <InvoiceStatus {...statusObject} />
                  </div>
                </a>
              </li>
            );
          })}
      </ol>
    );
  }

  const title = hasAtLeastOneInvoice
    ? I18n.t("existing_invoice_title", emptyStateScope)
    : I18n.t("empty_invoice_title", emptyStateScope);
  const subtext = hasAtLeastOneInvoice
    ? I18n.t("existing_invoice_subtext", emptyStateScope)
    : I18n.t("empty_invoice_subtext", emptyStateScope);

  return (
    <EmptyStateModule
      title={title}
      subtext={subtext}
      emptyStateImageSrc={emptyStateImageSrc}
      altImgText="Invoices with background"
      createUrl={createUrl}
      createBtnText="New Invoice"
      trackClick={{ eventName: "dashboard_invoices_empty_state_new_click" }}
    />
  );
};

export default OutstandingInvoices;

import React from "react";
import Tooltip from "@hui/_atoms/tooltip/Tooltip";
import { inlineLoader } from "../utils/base_helper";
import { InvoiceStatusForForm } from "../../types/invoiceForm.type";

interface iFooterButtons {
  disabledSave: boolean;
  handleNextClick: () => void;
  handlePreviewClick: () => void;
  handleSaveDraftClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  invoiceStatus: InvoiceStatusForForm;
  isImpersonating: boolean;
  nextButtonPopover?: string;
  saveAndTrigger: (callback: () => void, resetScheduleDateAndTime: boolean) => void;
}

const FooterButtons = ({
  disabledSave,
  handleNextClick,
  handlePreviewClick,
  handleSaveDraftClick,
  invoiceStatus,
  isImpersonating,
  nextButtonPopover,
  saveAndTrigger,
}: iFooterButtons) => {
  const showAdminOnlyButton =
    (invoiceStatus === "SENT" || invoiceStatus === "PART_PAID") &&
    isImpersonating;

  return (
    <div
      className="tw-flex tw-gap-3 tw-flex-wrap-reverse md:tw-flex-row md:tw-justify-between"
      id="invoices-footer"
    >
      <a
        href="/invoices"
        className="hnry-button hnry-button--tertiary md:tw-basis-auto"
      >
        Cancel
      </a>
      {showAdminOnlyButton ? (
        <button
          type="submit"
          className="hnry-button hnry-button--admin"
          disabled={disabledSave}
        >
          Save {invoiceStatus.replace("_", " ")}
        </button>
      ) : (
        <div className="tw-flex tw-gap-3 tw-w-full md:tw-w-fit tw-flex-col-reverse md:tw-flex-row">
          <div className="tw-flex tw-gap-3 tw-w-full md:tw-w-fit tw-justify-between">
            <button
              id="preview-button"
              className="hnry-button hnry-button--secondary tw-w-full"
              type="button"
              onClick={() => saveAndTrigger(handlePreviewClick, false)}
            >
              Preview
            </button>
            <button
              className="hnry-button hnry-button--secondary tw-w-full"
              type="button"
              data-disable-with={inlineLoader}
              onClick={handleSaveDraftClick}
            >
              Save Draft
            </button>
          </div>
          {nextButtonPopover ?
            <Tooltip popoverMessage={nextButtonPopover}>
              <button
                className="hnry-button hnry-button--primary tw-w-full"
                type="button"
                onClick={() => saveAndTrigger(handleNextClick, false)}
                disabled={disabledSave}
              >
                Next
              </button>
            </Tooltip> :
            <button
              className="hnry-button hnry-button--primary tw-w-full"
              type="button"
              onClick={() => saveAndTrigger(handleNextClick, false)}
              disabled={disabledSave}
            >
              Next
            </button>}
        </div>
      )}
    </div>
  );
};

export default FooterButtons;

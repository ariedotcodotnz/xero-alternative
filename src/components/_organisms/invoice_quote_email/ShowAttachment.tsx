import React from "react";
import Icon from "@hui/_atoms/icons/icon/Icon";

interface iShowAttachment {
  filename: string;
}

// Determine whether to show a link to a PDF download or not
const ShowAttachment = ({ filename }: iShowAttachment) => (
  <div className="tw-flex tw-items-center tw-gap-x-2 tw-h-3 tw-mt-3">
    <Icon type="PaperClipIcon" classes="invoice-quote-email-text tw-mt-2" size="sm" />
    <p className="invoice-quote-email-text !tw-text-xs tw-mt-2 tw-mb-0">
      {filename}
    </p>
  </div>
);

export default ShowAttachment;

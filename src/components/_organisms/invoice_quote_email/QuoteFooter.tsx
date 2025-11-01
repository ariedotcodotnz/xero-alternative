import React, { useState, useEffect } from "react";
import classNames from "classnames";
import Button from "@hui/_atoms/button/Button";

interface iQuoteFooter {
  editing: boolean;
  handleCancelClick: () => void;
  submitUrl?: string;
}

const QuoteFooter = ({
  editing,
  handleCancelClick,
  submitUrl,
}: iQuoteFooter) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (isLoading) {
      timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    }

    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  const onClick = (e) => {
    if (isLoading) {
      e.preventDefault();
      return;
    }
    setIsLoading(true);
  };

  return (
    <div className="hnry-dialog-panel-actions !tw-mt-4">
      {editing ? <Button type="button" disabled>Send</Button> : (
        <a
          href={submitUrl}
          data-method="post"
          rel="nofollow"
          data-track-click={JSON.stringify({ eventName: "quote_send_button_clicked" })}
          className={classNames("hnry-button hnry-button--primary", { "hnry-button--loading": isLoading })}
          onClick={onClick}
        >
          Send
        </a>
      )}
      <Button
        type="button"
        variant="secondary"
        aria-label="Close"
        onClick={handleCancelClick}
      >
        Cancel
      </Button>
    </div>
  );
};

export default QuoteFooter;

import React from "react";

const CopyButton = ({ label, copyId }) => (
  <button
    className="copy-trigger btn btn-primary btn-floating m-0"
    type="button"
    aria-label={label}
    id={copyId}
  >
    <i className="fa fa-copy no-pointer"></i>
  </button>
);

export default CopyButton;

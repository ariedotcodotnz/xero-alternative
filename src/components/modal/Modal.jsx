import React from "react";

export const Modal = ({
  id, closable, title, children, ...props
}) => (
  <div
    className="modal"
    id={id}
    role="dialog"
    aria-labelledby={`${id}-label`}
    aria-hidden="true"
    {...props}
  >
    <div className="modal-dialog modal-notify modal-info" role="document">
      <div className="modal-content">
        {title && <ModalHeader closable={closable} headerId={`${id}-label`}>{title}</ModalHeader>}
        {children}
      </div>
    </div>
  </div>
);

const ModalHeader = ({ children, closable, headerId }) => (
  <div className="modal-header" id={headerId}>
    <p className="heading lead">{children}</p>
    {closable && (
      <button
        type="button"
        className="close"
        data-dismiss="modal"
        aria-label="Close"
      >
        <span aria-hidden="true" className="white-text">
          &times;
        </span>
      </button>
    )}
  </div>
);

export const ModalBody = ({ children }) => (
  <div className="modal-body body-preview tw-bg-white">{children}</div>
);

export const ModalFooter = ({ children }) => (
  <div className="modal-footer">{children}</div>
);

import React, { useRef, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import classNames from "classnames";
import Icon from "../../_atoms/icons/icon/Icon";
import Button from "../../_atoms/button/Button";
// import "./styles.scss";

export interface iModal {
  cancelCTA?: string;
  children: React.ReactNode;
  closable?: boolean;
  confirmCTA?: string;
  disabled?: boolean;
  double?: boolean;
  extraHeaderContent?: React.ReactNode;
  hideOverlay?: boolean;
  icon?: string;
  id?: string;
  includesFooter?: boolean;
  loading?: boolean;
  onCancel?: () => void;
  onConfirm?: React.MouseEventHandler<HTMLButtonElement>;
  onOpenAutoFocus?: (event: Event) => void;
  onOutsideCloseAction?: (event: Event) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  variant?: "danger" | "primary";
  modalClasses?: string;
}

const Modal = ({
  cancelCTA = "Cancel",
  children,
  closable = false,
  confirmCTA = "Confirm",
  disabled = false,
  double = false,
  extraHeaderContent,
  hideOverlay = false,
  id = undefined,
  includesFooter = true,
  loading = false,
  onCancel = undefined,
  onConfirm,
  onOpenAutoFocus = undefined,
  onOutsideCloseAction = undefined,
  open = false,
  setOpen,
  title,
  variant = "primary",
  modalClasses,
}: iModal) => {
  const cancelButtonRef = useRef(null);

  const closeModal = () => {
    if (open) {
      setOpen(false);
    }
  }

  useEffect(() => {
    // Properly remove the component when modal never call setOpen to close the dialog
    // This happens when the modal redirects from rails controller and the modal is not proper unmount
    // The page lost its scrollbar when the modal is not proper unmount in the background
    document.addEventListener("hnry:turbolinks-render", closeModal);

    return () => {
      document.removeEventListener("hnry:turbolinks-render", closeModal);
    };
  }, []);

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Overlay
        className={classNames({
          "hnry-dialog-transition data-[state=open]:tw-animate-opacityShowFast data-[state=closed]:tw-animate-opacityHideFast":
            !hideOverlay,
        })}
      />
      <Dialog.Content
        onOpenAutoFocus={onOpenAutoFocus}
        onInteractOutside={onOutsideCloseAction}
        onEscapeKeyDown={onOutsideCloseAction} // reusing same function on both actions so that clicking off modal and hitting esc have the same effect
        id={id}
        className={classNames(
          "hnry-dialog-panel data-[state=open]:tw-animate-opacityShowFast data-[state=closed]:tw-animate-opacityHideFast",
          {
            [`${modalClasses}`]: modalClasses,
            "hnry-dialog-panel--double": double,
            "!tw-shadow-[0_5px_25px_0_rgb(0,0,0,0.4)]": hideOverlay, // A stronger shadow is needed for the overlay to be visible
          },
        )}
      >
        <div className="hnry-dialog-panel-content">
          <div className="hnry-dialog-panel-header tw-gap-4">
            {extraHeaderContent}

            <Dialog.Title className="hnry-dialog-panel-header__title">
              {title}
            </Dialog.Title>
            {closable && (
              <Dialog.Close asChild>
                <button
                  className="hnry-button hnry-button--link !tw-w-auto"
                  onClick={handleCancel}
                >
                  <Icon type="XMarkIcon" hoverOn classes="!tw-mx-0" />
                  <span className="tw-sr-only">Dismiss</span>
                </button>
              </Dialog.Close>
            )}
          </div>
          {children}
          {(onConfirm || (!closable && includesFooter)) && (
            <div
              className={classNames("hnry-dialog-panel-actions", {
                closable,
              })}
            >
              {onConfirm && (
                <Button
                  type="button"
                  onClick={onConfirm}
                  loading={loading}
                  variant={variant}
                  disabled={disabled}
                >
                  {confirmCTA}
                </Button>
              )}
              {!closable && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                  ref={cancelButtonRef}
                >
                  {cancelCTA}
                </Button>
              )}
            </div>
          )}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default Modal;

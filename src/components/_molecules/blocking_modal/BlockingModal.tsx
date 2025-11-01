import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import classNames from "classnames";

export interface iBlockingModal {
  id?: string;
  onOpenAutoFocus?: (event: Event) => void;
  title: string;
  children: React.ReactNode;
  headerImagePath?: string;
  moreActions?: React.ReactNode;
  hideOverlay?: boolean;
  modal?: boolean
}

const BlockingModal = ({
  id = undefined,
  onOpenAutoFocus,
  hideOverlay = false,
  title,
  children,
  headerImagePath,
  moreActions,
  modal = true
}: iBlockingModal) => (
  <Dialog.Root open={true} modal={modal}>
    <Dialog.Overlay
      className={classNames({
        "hnry-dialog-transition data-[state=open]:tw-animate-opacityShowFast data-[state=closed]:tw-animate-opacityHideFast":
          !hideOverlay,
      })}
    />
    <Dialog.Content
      onOpenAutoFocus={onOpenAutoFocus}
      id={id}
      className="hnry-dialog-panel !tw-transition-none"
    >
      <div className="hnry-dialog-panel-content">
        {headerImagePath &&
          <div className="tw-mb-8 tw-h-60">
            <img src={headerImagePath} alt="" className="tw-object-cover tw-h-full tw-w-full" />
          </div>
        }
        <div className="hnry-dialog-panel-header tw-gap-4">
          <Dialog.Title className="hnry-dialog-panel-header__title !tw-text-left">
            {title}
          </Dialog.Title>
          {moreActions}
        </div>
        {children}
      </div>
    </Dialog.Content>
  </Dialog.Root>
);

export default BlockingModal;

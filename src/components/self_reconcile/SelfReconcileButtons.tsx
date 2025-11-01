import React from "react";
import Button from "@hui/_atoms/button/Button";

interface SelfReconcileButtonsProps {
  handleConfirm: () => void | Promise<void>;
  handleBack: () => void;
  disabledSubmit: boolean;
  confirmButton: string;
  loading?: boolean;
}

const SelfReconcileButtons = ({
  handleConfirm,
  handleBack,
  disabledSubmit,
  confirmButton,
  loading,
}: SelfReconcileButtonsProps) => (
  <div className="hnry-dialog-panel-actions">
    <Button
      classes="!tw-px-3"
      onClick={handleConfirm}
      disabled={disabledSubmit}
      variant="primary"
      dataTestId="self-reconcile-buttons"
      loading={loading}
    >
      <span>{confirmButton}</span>
    </Button>
    <Button classes="!tw-px-3" onClick={handleBack} variant="secondary">
      <span>Back</span>
    </Button>
  </div>
);

export default SelfReconcileButtons;

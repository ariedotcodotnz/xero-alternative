import InputCopy from "@hui/_atoms/input/InputCopy";
import React from "react";
import SelfReconcileButtons from "../SelfReconcileButtons";
import I18n from "../../../utilities/translations";

export interface AccountTopUpProps {
  referenceValue: string;
  handleModalProgression: (step: string) => void;
  next: string;
  previous: string;
}

const AccountTopUp = ({
  referenceValue,
  handleModalProgression,
  next,
  previous,
}: AccountTopUpProps) => (
  <>
    <div className="tw-text-sm">
      <div className="tw-mb-4 tw-mt-6">
        <p>
          <b>
            {I18n.t("home.index.self_reconcile.account_top_up_modal.warning")}
          </b>
        </p>
      </div>
      <div className="tw-mb-4">
        <p>
          {I18n.t("home.index.self_reconcile.account_top_up_modal.sub_warning")}
        </p>
      </div>
      <InputCopy
        className="tw-font-semibold tw-text-gray-500"
        value={referenceValue}
        label="Reference"
        name="account_top_up"
        disabled
      />
    </div>
    <SelfReconcileButtons
      handleConfirm={() => handleModalProgression(next)}
      handleBack={() => handleModalProgression(previous)}
      disabledSubmit={false}
      confirmButton="Next"
    />
  </>
);

export default AccountTopUp;

import React, { useState } from "react";
import { post } from "@api/config/fetch.api";
import Modal from "../../_molecules/modal/Modal";
import Heading from "../../_atoms/heading/Heading";
import { StackedList } from "../../_organisms/lists/StackedList";
import Alert from "../../_molecules/alert/Alert";
import I18n from "../../../admin/utilities/translations";

export interface iReturnTransaction {
  transaction_id: string;
  payee_name: string;
  account_details: string;
  amount: string;
  payment_date: Date;
  reference: string;
  particular?: string;
  code?: string;
}

const ReturnPreviewModal = ({
  transaction_id,
  payee_name,
  account_details,
  reference,
  amount,
  payment_date,
  code,
  particular,
}: iReturnTransaction) => {
  const [showModal, setShowModal] = useState<boolean>(true);
  const [disableSubmitButton, setDisableSubmitButton] = useState<boolean>(false);

  const handleSubmit = async () => {
    setDisableSubmitButton(true);
    await post(
      Routes.admin_return_to_payor_index_path({ transaction_id }),
      null,
    )
      .then((data) => {
        toastr.success(data.message);
        window.location.reload();
        setShowModal(false);
        setDisableSubmitButton(false);
      })
      .catch((error) => {
        toastr.error(error.message);
      });
  };

  const firstListItems = [
    { "Payee name:": payee_name },
    { "Account details:": account_details },
  ];

  const secondListItems = [
    { "Payment amount:": amount },
    { "Payment received:": payment_date },
    { "Reference:": reference },
    { "Code:": code },
    { "Particular:": particular },
  ];

  return (
    <Modal
      title={I18n.t("admin.views.return_to_payor.new.title")}
      confirmCTA={"Process"}
      open={showModal}
      onConfirm={handleSubmit}
      setOpen={(open) => setShowModal(open)}
      cancelCTA={"Cancel"}
      modalClasses={"w-100"}
      disabled={disableSubmitButton}
    >
      <div className="hui-card w-auto hui-card__bordered border px-2 pt-2 mb-2">
        <Heading
          level={2}
          text={I18n.t("admin.views.return_to_payor.new.subtitle")}
          className="tw-ms-2 tw-ps-0"
          marketing={false}
        />
        <StackedList items={firstListItems} />
        <hr />
        <StackedList items={secondListItems} containerClasses={"pb-2"} />
      </div>
      <Alert
        variant={"warning"}
        includesIcon
        title={I18n.t("admin.views.return_to_payor.new.warning_title")}
      >
        <p>{I18n.t("admin.views.return_to_payor.new.warning")}</p>
      </Alert>
    </Modal>
  );
};

export default ReturnPreviewModal;

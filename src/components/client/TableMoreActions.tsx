import React, { useState, useEffect } from "react";
import MoreActions from "../_molecules/dropdowns/more_actions/MoreActions";
import MenuItem from "../_molecules/dropdowns/menu/MenuItem";
import PaymentRequestModal from "./payment_request/Modal";
import { iPaymentRequest } from "./payment_request/Button";
import I18n from "../../utilities/translations";

interface iTableMoreActions extends iPaymentRequest {
  disableDeleteAction: boolean;
  showRequestPayment: boolean;
  createInvoiceUrl: string;
}

const ctx = { scope: "clients.table" };

const TableMoreActions = ({
  clientId,
  canRequestPayment,
  clientName,
  showRequestPayment,
  disableDeleteAction,
  maxInvoiceTotal,
  createInvoiceUrl,
}: iTableMoreActions) => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const isUk = window.Hnry.User.jurisdiction.code === "uk";

  useEffect(() => {
    const tailwindSM = 640;

    if (window.innerWidth < tailwindSM) {
      setIsMobile(true);
    }
  }, []);

  const handleRequestPaymentClick = () => {
    setOpen(true);
    window.analytics?.track("payment_request_clicked", { client_id: clientId });
  }

  return (
    <>
      <MoreActions>
        <MenuItem
          href={Routes.edit_client_path(clientId)}
          iconType="PencilSquareIcon"
          label={I18n.t("edit_label", ctx)}
        />
        <MenuItem
          href={createInvoiceUrl}
          iconType={isUk ? "InvoicingPoundIcon" : "InvoicingDollarIcon"}
          label={I18n.t("create_invoice", ctx)}
          trackClick={{ eventName: "client_create_invoice_clicked" }}
          remote="true"
        />
        {showRequestPayment && (
          <MenuItem
            iconType="SmsMobileIcon"
            label={I18n.t("request_label", ctx)}
            onClick={handleRequestPaymentClick}
            asButton
          />
        )}
        {!disableDeleteAction && (
          <MenuItem
            href={Routes.client_path({ id: clientId })}
            iconType="TrashIcon"
            label={I18n.t("delete_label", ctx)}
            remote="true"
            method="DELETE"
            confirm={I18n.t("delete_confirm_text", ctx).replace("%{client_name}", clientName)}
          />
        )}
      </MoreActions>
      {showRequestPayment && (
        <PaymentRequestModal
          isMobile={isMobile}
          canRequestPayment={canRequestPayment}
          clientName={clientName}
          clientId={clientId}
          url={Routes.edit_client_path(clientId)}
          open={open}
          setOpen={setOpen}
          maxInvoiceTotal={maxInvoiceTotal}
        />
      )}
    </>
  );
};

export default TableMoreActions;

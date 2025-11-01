import React, { useState, useRef } from "react";
import Combobox, { iHnryComboboxEntry } from "@hui/_molecules/combobox/Combobox";
import Modal from "@hui/_molecules/modal/Modal";
import Button from "@hui/_atoms/button/Button";
import I18n from "../../utilities/translations";
import ReportModule from "./ReportModule";

interface iStatementOfAccountReport {
  clients: iHnryComboboxEntry[];
  fromDate: string;
  toDate: string;
}

const ctx = { scope: "reports.client_account_statement_report" };

const StatementOfAccountReport = ({
  clients,
  fromDate,
  toDate,
}:iStatementOfAccountReport) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(clients.length === 1 ? clients[0] : undefined);
  const [disabledSubmit, setDisabledSubmit] = useState(clients.length === 1 ? clients[0].disabled : true);
  const [loading, setLoading] = useState(false);
  const form = useRef<HTMLFormElement>();
  const csrfToken: HTMLMetaElement | undefined = document.querySelector("meta[name='csrf-token']");

  const handleModal = () => {
    setModalOpen(true);
    window.analytics.track("statement_of_account_report_clicked")
  }

  const reset = () => {
    setSelectedClient(clients.length === 1 ? clients[0] : undefined);
    setModalOpen(false);
    setDisabledSubmit(clients.length === 1 ? clients[0].disabled : true);
    setLoading(false);
  }

  const handleSubmit = () => {
    setLoading(true);
    form.current.requestSubmit();
    window.analytics.track("reports_downloaded", {
      type: "statement_of_account",
      period: `${fromDate} - ${toDate}`,
      client_id: selectedClient.key
    });
    setDisabledSubmit(true);
    reset();
  }

  const handleClientSelectChange = (value) => {
    const index = clients.findIndex((client) => client.key === value);
    const client = clients[index];

    setSelectedClient(client);
    setDisabledSubmit(client ? client.disabled : true);
  }

  return (
    <ReportModule
      headerText={I18n.t("title", ctx)}
      buttonText={I18n.t("button_text", ctx)}
      hasButton
      onClickHandler={handleModal}
    >
      <div className="tw-p-4">
        <p className="tw-mb-0">{I18n.t("call_to_action", ctx)}</p>
      </div>
      {modalOpen && (
        <Modal
          open={modalOpen}
          setOpen={() => setModalOpen(false)}
          title={I18n.t("title", ctx)}
          loading={loading}
          closable
        >
          <form
            target="_blank"
            ref={form}
            method="GET"
            action={Routes.reports_statement_of_account_path({ format: "pdf", from_date: fromDate, to_date: toDate, client_id: selectedClient && selectedClient.key })}
          >
            <input type="hidden" name="authenticity_token" value={csrfToken?.content} autoComplete="off" />
            <p className="tw-text-sm sm:tw-text-base tw-text-gray-700">{I18n.t("select_client_modal.paragraph", ctx)}</p>
            <div className="tw-min-h-60 sm:tw-min-h-80">
              <Combobox
                entries={clients}
                selectedValue={selectedClient ? selectedClient.key : ""}
                setSelectedValue={handleClientSelectChange}
                label="Client"
                placeholder="Select or search Client..."
                id="client_id"
                name="client_id"
                comboboxClasses="tw-mb-4"
                nullable
                hasEmptyOption
                openMenuOnFocus
                legacyStyles={false}
              />
            </div>
            <div className="hnry-dialog-panel-actions closable">
              <Button
                disabled={disabledSubmit}
                loading={loading}
                onClick={handleSubmit}
              >
                {I18n.t("select_client_modal.confirm_button", ctx)}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </ReportModule>
  )
};

export default StatementOfAccountReport;
import React, { useState } from "react";
import Combobox, { iHnryComboboxEntry } from "../_molecules/combobox/Combobox";
import Button from "../_atoms/button/Button";
import I18n from "../../utilities/translations";
import Alert from "../_molecules/alert/Alert";

const ctx = { scope: "quotes.select_client" };

interface iSelectClientForInvoiceQuote {
  clients: iHnryComboboxEntry[];
  model: "invoice" | "quote",
}

const SelectClientForInvoiceQuote = ({
  clients,
  model,
}: iSelectClientForInvoiceQuote) => {
  const [selectedClient, setSelectedClient] = useState(clients.length === 1 ? clients[0] : null);
  const [disabledSubmit, setDisabledSubmit] = useState(clients.length === 1 ? clients[0].disabled : false);

  const handleChange = (value) => {
    const index = clients.findIndex((client) => client.key === value);
    const client = clients[index];

    setSelectedClient(client);
    setDisabledSubmit(client ? client.disabled : false);
  }

  return (
    <>
      <div className="tw-min-h-80">
        <Combobox
          entries={clients}
          selectedValue={selectedClient ? selectedClient.key : ""}
          setSelectedValue={handleChange}
          label="Client"
          placeholder="Select or search Client..."
          id="client_id"
          name="client_id"
          comboboxClasses="tw-mb-4"
          nullable
          hasEmptyOption
          openMenuOnFocus
        />
        {disabledSubmit && (
          <Alert
            variant="danger"
            title={`${I18n.t("block_title", ctx)} ${model} them`}
          >
            <p className="tw-mt-2">
              <a href={Routes.edit_client_path(selectedClient.key)}>{`Go to ${selectedClient.value}`}</a>
              &nbsp;{I18n.t("block_paragraph", ctx)}
            </p>
          </Alert>
        )}
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="hnry-button hnry-button--secondary"
          data-toggle="modal"
          data-target="#dialog"
          aria-label="close"
        >
          Cancel
        </button>
        <Button type="submit" disabled={disabledSubmit}>{I18n.t("global.actions.next")}</Button>
      </div>
    </>
  );
}

export default SelectClientForInvoiceQuote;

import React, { useState, useRef } from "react";
import Modal from "@hui/_molecules/modal/Modal";
import Combobox, { iHnryComboboxEntry } from "@hui/_molecules/combobox/Combobox";
import Button from "@hui/_atoms/button/Button";
import Alert from "@hui/_molecules/alert/Alert";
import I18n from "../../../utilities/translations";
import CreateClientForm from "./CreateClientForm";

interface iSelectClientModal {
  clients: iHnryComboboxEntry[];
  model: "invoice" | "quote";
  salesTaxRegistered: boolean;
}
const ctx = { scope: "quotes.select_client" };

const SelectClientModal = ({
  clients,
  model,
  salesTaxRegistered,
}: iSelectClientModal) => {
  const form = useRef<HTMLFormElement>();
  const csrfToken: HTMLMetaElement | undefined = document.querySelector("meta[name='csrf-token']");

  const [show, setShow] = useState(true);
  const [selectedClient, setSelectedClient] = useState(clients.length === 1 ? clients[0] : undefined);
  const [disabledSubmit, setDisabledSubmit] = useState(clients.length === 1 ? clients[0].disabled : true);
  const [showSelectClient, setShowSelectClient] = useState(clients.length > 0);

  const handleSubmit = () => {
    form.current.requestSubmit();
  }

  const handleClientSelectChange = (value) => {
    const index = clients.findIndex((client) => client.key === value);
    const client = clients[index];

    setSelectedClient(client);
    setDisabledSubmit(client ? client.disabled : true);
  }

  const handleCreateButtonClick = () => {
    setShowSelectClient(!showSelectClient);
    setDisabledSubmit(selectedClient ? selectedClient.disabled : true);
  }

  return (
    <Modal
      open={show}
      setOpen={setShow}
      title={showSelectClient ? "Select or create a Client" : "Create a new Client"}
      confirmCTA={I18n.t("global.actions.next")}
      onConfirm={handleSubmit}
      disabled={disabledSubmit}
    >
      {clients.length > 0 && (
        <div className="tw-flex tw-justify-end tw-ml-auto tw-mb-4 tw-w-full">
          <Button
            classes="!tw-w-fit"
            onClick={handleCreateButtonClick}
            iconType={showSelectClient ? "PlusIcon" : "MagnifyingGlassIcon"}
            variant="link"
            iconEnd
          >
            {showSelectClient ? "Create new" : "Choose existing"}
          </Button>
        </div>
      )}
      {showSelectClient ? (
        <form
          data-remote="true"
          ref={form}
          method="GET"
          action={`/${model}s/new`}
        >
          <input type="hidden" name="authenticity_token" value={csrfToken?.content} autoComplete="off" />
          <div className="tw-min-h-80">
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
            {(disabledSubmit && selectedClient !== undefined) && (
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
        </form>
      ) : (
        <CreateClientForm
          formRef={form}
          model={model}
          setDisabledSubmit={setDisabledSubmit}
          showSelectClient={showSelectClient}
          salesTaxRegistered={salesTaxRegistered}
          hasClients={clients.length > 0}
        />
      )}
    </Modal>
  );
}

export default SelectClientModal;

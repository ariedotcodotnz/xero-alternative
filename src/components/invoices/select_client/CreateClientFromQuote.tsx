import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import Modal from "@hui/_molecules/modal/Modal";
import Combobox, { iHnryComboboxEntry } from "@hui/_molecules/combobox/Combobox";
import I18n from "../../../utilities/translations";
import CreateClientForm from "./CreateClientForm";

interface iCreateClientFromQuote {
  clients?: iHnryComboboxEntry[];
  selectedClient: string;
  salesTaxRegistered: boolean;

}

const CreateClientFromQuote = ({
  clients,
  selectedClient,
  salesTaxRegistered,
}: iCreateClientFromQuote) => {
  const form = useRef<HTMLFormElement>();
  const [show, setShow] = useState(false);
  const [disabledSubmit, setDisabledSubmit] = useState(true);
  const [clientId, setClientId] = useState(selectedClient);

  const handleSubmit = () => {
    form.current.requestSubmit();
  }

  const handleClientChange = (value) => {
    let timeout;
    if (value === "new") {
      setClientId(selectedClient);
      // Fix for firefox: to ensure the combobox menu closed before modal is showing
      timeout = setTimeout(() => setShow(true), 300);
    } else {
      setClientId(value);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }

  return (
    <>
      <div className="tw-w-full tw-mb-6">
        <Combobox
          name="quote[client_id]"
          id="quote_client_id"
          label={I18n.t("quotes.form.client_name")}
          entries={clients}
          selectedValue={clientId}
          legacyStyles={false}
          setSelectedValue={handleClientChange}
          openMenuOnFocus
        />
      </div>
      {show ? createPortal(
        <>
          <Modal
            open={show}
            setOpen={setShow}
            title="Create a new Client"
            confirmCTA={I18n.t("global.actions.next")}
            onConfirm={handleSubmit}
            disabled={disabledSubmit}
          >
            <CreateClientForm
              formRef={form}
              model="quote"
              setDisabledSubmit={setDisabledSubmit}
              showSelectClient={false}
              salesTaxRegistered={salesTaxRegistered}
              hasClients
            />
          </Modal>
        </>, document.body) : null}
    </>
  );
}

export default CreateClientFromQuote;

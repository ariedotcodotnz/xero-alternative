import React, { Dispatch, SetStateAction } from "react";
import Combobox from "@hui/_molecules/combobox/Combobox";
import { iClient } from "@api/self_reconcile/clients.api";
import { Transaction } from "@api/self_reconcile/bank_transactions.api";
import SelfReconcileButtons from "../SelfReconcileButtons";
import I18n from "../../../utilities/translations";
import ClientFlowButtons from "../ClientFlowButtons";
import { trackOnClickEvent } from "../helpers/helpers";

export interface SelectClientProps {
  clients: iClient[];
  clientIndex: number;
  setClientIndex: Dispatch<SetStateAction<number>>;
  handleModalProgression: (step: string) => void;
  handleMultipleClientsOnClick: () => void;
  handleCreateClientOnClick: () => void;
  transaction: Transaction;
  next: string;
  previous: string;
  resetState: () => void;
}

const SelectClient = ({
  clients,
  clientIndex,
  setClientIndex,
  handleModalProgression,
  handleMultipleClientsOnClick,
  handleCreateClientOnClick,
  transaction,
  next,
  previous,
  resetState,
}: SelectClientProps) => {
  const clientEntries = clients.map((client) => ({
    key: client.id,
    value: client.organisationName,
  }));

  const disabledSubmit = clientIndex === -1;

  const handleClientSelectChange = (value) => {
    const index = clients.findIndex((c) => c.id === value);

    setClientIndex(index);
    if (index >= 0) {
      trackOnClickEvent(
        "user_reconciliations_selected_existing_client",
        transaction,
      );
    }
  };

  return (
    <>
      <Combobox
        entries={clientEntries}
        label="Client"
        legacyStyles={false}
        nullable
        openMenuOnFocus
        placeholder="Select or search Client"
        selectedValue={clientIndex >= 0 ? clients[clientIndex].id : ""}
        setSelectedValue={handleClientSelectChange}
        optionsClasses="tw-max-h-36 sm:tw-max-h-36"
      />
      <div className="tw-mb-4 tw-mt-6">
        <ClientFlowButtons
          optionButtonOneText={I18n.t(
            "home.index.self_reconcile.select_client_modal.new_client_button"
          )}
          optionButtonTwoText={I18n.t(
            "home.index.self_reconcile.select_client_modal.multiple_clients_button"
          )}
          optionButtonOneOnClick={() => {
            handleCreateClientOnClick();
            trackOnClickEvent(
              "user_reconciliation_clicked_new_client",
              transaction,
            );
          }}
          optionButtonTwoOnClick={() => {
            handleMultipleClientsOnClick();
            trackOnClickEvent(
              "user_reconciliation_clicked_multiple_clients",
              transaction,
            );
          }}
        />
      </div>
      <SelfReconcileButtons
        handleConfirm={() => handleModalProgression(next)}
        handleBack={() => {
          resetState();
          handleModalProgression(previous);
        }}
        disabledSubmit={disabledSubmit}
        confirmButton="Next"
      />
    </>
  );
};

export default SelectClient;

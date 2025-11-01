import { postJson, patchJson } from "./config/fetch.api";
import { iAllocationTemplate } from "../components/dashboard/card/SetupAllocation";

export interface blockCardRequest {
  card_action: "block" | "unblock"
}

export interface iWithdrawFunds {
  amount: string,
}

export interface iSetupCardAllocation {
  percentage: string;
  cap: string;
  frequency: string;
  allocationTemplate: iAllocationTemplate;
  locked?: boolean;
}

export interface iWithdrawFundsSCAChallengeResponse {
  deviceRegistrationName: string;
  challengeId: string;
  challengeAction: string;
}

export interface iUpdateCardAllocation extends iSetupCardAllocation  {
  id: number;
}

export const sendCardDetails = async () => postJson(Routes.send_card_details_cards_path(), undefined);

export const blockCard = async (body: blockCardRequest) => postJson(Routes.update_card_cards_path(), JSON.stringify(body));

export const withdrawFunds = async ({ amount }: iWithdrawFunds) => (
  postJson(Routes.withdraw_funds_cards_path(), JSON.stringify({ amount }), false));

const allocationTemplateParams = (template) => ({
  allocation_template_name: template.name,
  payee_name: template.title,
  payee_account_number: template.payeeAccountNumber,
  allocation_type: template.allocationType,
});

export const setupCardAllocation = async ({ cap, frequency, percentage, allocationTemplate, locked }: iSetupCardAllocation) => (
  postJson(Routes.allocation_preferences_path(), JSON.stringify({
    allocation_preference: {
      percentage,
      cap,
      cap_frequency: frequency,
      locked_at: locked,
      ...allocationTemplateParams(allocationTemplate),
    },
  }), false).then((response) => response).catch((error) => error)
);

export const updateCardAllocation = async ({ cap, frequency, percentage, allocationTemplate, locked, id }: iUpdateCardAllocation) => (
  patchJson(`allocation_preferences/${id}`, JSON.stringify({
    allocation_preference: {
      id,
      percentage,
      cap,
      cap_frequency: frequency,
      locked_at: locked,
      ...allocationTemplateParams(allocationTemplate),
    },
  }), false).then((response) => response).catch((error) => { error })
);

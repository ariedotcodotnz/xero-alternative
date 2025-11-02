import { get, postJson } from "@api/config/fetch.api";
import CreateClientResponseBody from "./CreateClientResponseBody.js";

export interface iClient {
  id: string;
  organisationName: string;
}

export const getClients = async () =>
  get(Routes.api_self_reconcile_clients_path());

export type CreateClientDetailsType = {
  id: string;
  organisation_name: string;
  billing_email: string;
  gst_type: string;
  has_prior_deduction_percentage: boolean;
  prior_deduction_percentage: number;
  currency_code: string;
};

export const createClient = async (
  body: CreateClientDetailsType,
): Promise<CreateClientResponseBody> =>
  postJson(
    Routes.api_self_reconcile_clients_path(),
    JSON.stringify(body),
    false,
  );

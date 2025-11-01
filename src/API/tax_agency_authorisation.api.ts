import { putJson } from "./config/fetch.api";
import { taxAgencyAuthorisationStates as states } from "../types/taxAgencyAuthorisation.type";

type offBoardReasons = "nlse" | "alt_arrangement" | "overseas_resident" | "graduated";

interface iTaxAgencyUpdate {
  id: number;
  context: states | "off_board_user";
  offBoardReason?: offBoardReasons;
}

interface tAAResponse {
  success: boolean
}

const taxAgencyAuthorisationUpdate = async ({ id, context, offBoardReason }: iTaxAgencyUpdate) => (
  putJson(Routes.tax_agency_authorisation_path(id), JSON.stringify({ id, context, off_board_reason: offBoardReason })));

export const taxAgencyAuthorisationLinked = (id: number): Promise<tAAResponse> => taxAgencyAuthorisationUpdate({ id, context: "linked" });

export const taxAgencyAuthorisationInterimDelinked = (id: number): Promise<tAAResponse> => taxAgencyAuthorisationUpdate({ id, context: "interim_delinked" });

export const taxAgencyAuthorisationIntentionallyDelinked = (id: number): Promise<tAAResponse> => taxAgencyAuthorisationUpdate({ id, context: "intentionally_delinked" });

export const taxAgencyAuthorisationSalesTaxLinked = (id: number): Promise<tAAResponse> => taxAgencyAuthorisationUpdate({ id, context: "sales_tax_linked" });

export const taxAgencyAuthorisationOffBoardUser = (
  id: number,
  offBoardReason: offBoardReasons
): Promise<tAAResponse> => taxAgencyAuthorisationUpdate({ id, context: "off_board_user", offBoardReason });

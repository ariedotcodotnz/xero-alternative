import {
  get
} from "./config/fetch.api";

export interface AllocationPreferencesClientData {
  id?: number | undefined | null;
  organisationName: string;
  isAssignedToAllocation: boolean;
  }

export const getAllActiveClients = async (
  allocationPreferenceId?: number
): Promise<AllocationPreferencesClientData[] | null> => {

  let url = Routes.get_active_clients_api_allocation_preferences_clients_path();

  if (allocationPreferenceId !== undefined && allocationPreferenceId !== null) {
    url += `?allocation_preference_id=${allocationPreferenceId}`;
  }

  const clientList = await get(url);

  if (clientList && clientList.length) {
    return clientList as AllocationPreferencesClientData[];
  }

  return null;
}

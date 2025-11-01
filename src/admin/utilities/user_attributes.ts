import { AdminConfig } from "../../types/config.type";

export const getAdminUser = () => window.Hnry?.AdminUser;
export const getAdminUserId = (): number | null => getAdminUser()?.id;
export const getCurrentJurisdiction = (): string | null => getAdminUser()?.currentJurisdiction;

const getConfig = () => window.Hnry?.Config as AdminConfig;
export const getEnvironment = (): AdminConfig["environment"] | null =>
  getConfig()?.environment;
export const getAmplitudeAdminApiKey = ():
  | AdminConfig["amplitudeAdminApiKey"]
  | null => getConfig()?.amplitudeAdminApiKey;

const AdminUserAttributes = getAdminUser();

export default AdminUserAttributes;

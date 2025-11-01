import hnryJurisdictions from "../types/jurisdictions.type";
import { acceptedCurrencyValues } from "../types/currency.type";
import { PublicConfig } from "../types/config.type";

export const getUser = () => window.Hnry?.User;
export const getUserId = (): number | null => getUser()?.id;
export const getUserJurisdictionCode = (): hnryJurisdictions | null =>
  getUser()?.jurisdiction?.code;
export const getUserJurisdictionCurrencySymbol = (): string | null =>
  getUser()?.jurisdiction?.currencySymbol;
export const getUserJurisdictionCurrencyCode =
  (): acceptedCurrencyValues | null => getUser()?.jurisdiction?.currencyCode;
export const getUserJurisdictionLocale = (): string | null =>
  getUser()?.jurisdiction?.locale;
export const getUserJurisdictionIconUrl = (): string | null =>
  getUser()?.jurisdiction?.iconUrl;
export const getUserJurisdictionSupportEmail = (): string | null =>
  getUser()?.jurisdiction?.supportEmail;
export const getUserFirstName = (): string | null => getUser()?.name.first;
export const getUserLastName = (): string | null => getUser()?.name.last;
export const getUserInitials = (): string | null => getUser()?.name.initials;
export const getUserPreferredName = (): string | null =>
  getUser()?.name.preferred;
export const getUserFullName = (): string | null => getUser()?.name.full;
export const getUserStatusColour = (): string | null =>
  getUser()?.status.colour;
export const getUserStatusName = (): string | null => getUser()?.status.name;
export const getUserEmail = (): string | null => getUser()?.email;
export const getUserTin = (): string | null => getUser()?.tin;
export const getUserFeatures = (): string[] => getUser()?.features || [];

const getConfig = () => window.Hnry?.Config as PublicConfig;
export const getEnvironment = (): PublicConfig["environment"] | null =>
  getConfig()?.environment;
export const getVersion = (): PublicConfig["version"] | null => getConfig()?.version;
export const getDatadogClientToken = (): PublicConfig["datadogClientToken"] | null =>
  getConfig()?.datadogClientToken;
export const getDatadogApplicationId = ():
  | PublicConfig["datadogApplicationId"]
  | null => getConfig()?.datadogApplicationId;

const UserAttributes = getUser();

export default UserAttributes;

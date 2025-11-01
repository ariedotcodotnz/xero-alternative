/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ApiErrorResponse, get, putJson } from "./config/fetch.api";

type GetExpensesGraphDataType = {
  url: string;
  yearFilter: string;
};

export interface DashboardModule {
  alt: string;
  description: string;
  enabled: boolean;
  key: string;
  title: string;
}

export interface LegacyDashboardModule {
  [key: string]: {
    alt: string;
    description: string;
    enabled: boolean;
    title: string;
  };
}

export interface GetDashboardSettingsSuccessResponse {
  code: string;
  data: DashboardModule[];
}

export interface LegacyDashboardSettingsSuccessResponse {
  code: string;
  data: LegacyDashboardModule;
  ordered: string[];
}

export interface UpdateDashboardSettingsType {
  items: {
    key: string;
    enabled: boolean;
  }[];
}

export interface UpdateDashboardSettingsResponseType {
  message: string[];
  code: "ok";
}

export const getExpensesGraphData = async ({
  url,
  yearFilter,
}: GetExpensesGraphDataType) =>
  get(`${url}${yearFilter ? `?year_filter=${yearFilter}` : ""}`);

export const getDashboardSettings = async (): Promise<
  GetDashboardSettingsSuccessResponse | ApiErrorResponse
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, no-undef
> => get(Routes.api_dashboard_modules_path());

export const updateDashboardSettings = async ({
  items,
}: UpdateDashboardSettingsType): Promise<UpdateDashboardSettingsResponseType> =>
  putJson(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, no-undef
    Routes.api_dashboard_modules_path(),
    JSON.stringify({ module_list: items }),
  );

import { post, get } from "./config/fetch.api";

interface iGetServiceAmounts {
  price: string;
  salesTaxType: string;
};

export const uploadFile = async (body: FormData) => post(Routes.services_upload_create_path(), body, undefined, false);

export const getServiceAmounts = async ({ price, salesTaxType}: iGetServiceAmounts) =>
  get(Routes.get_price_breakdown_services_path({ price, sales_tax_type: salesTaxType }));

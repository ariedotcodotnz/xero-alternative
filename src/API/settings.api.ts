import { putJson } from "./config/fetch.api";

export const updatePayId = async (payId: string) =>
  putJson(
    Routes.settings_pay_id_path(),
    JSON.stringify({ au_financial: { pay_id: payId } }),
    false,
  );

export default {
  updatePayId,
};

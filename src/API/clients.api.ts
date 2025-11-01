import { post, postJson } from "./config/fetch.api";

interface iRequestPayment {
  amount: string;
  clientId: number;
}

export const uploadFile = async (body: FormData) => post(Routes.clients_upload_create_path(), body, undefined, false);

export const requestPayment = async ({ clientId, amount }: iRequestPayment) => (
  postJson(Routes.payment_requests_path(), JSON.stringify({ amount, client_id: clientId }), false));

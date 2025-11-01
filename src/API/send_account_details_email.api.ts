import { postJson } from "./config/fetch.api";

type SendAccountDetailsEmailType = {
  recipients: string;
  accountType?: string;
}

const sendAccountDetailsEmail = async (
  {recipients, accountType}: SendAccountDetailsEmailType
) => postJson(Routes.account_details_email_index_path(), JSON.stringify({ recipients, account_type: accountType }), true);

export default sendAccountDetailsEmail;

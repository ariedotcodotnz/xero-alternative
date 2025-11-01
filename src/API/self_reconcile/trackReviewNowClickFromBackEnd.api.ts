import { postJson } from "@api/config/fetch.api";

const trackReviewNowClickFromBackEnd = (transactionCount: number) =>
  postJson(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    Routes.entered_self_reconcile_modal_event_home_index_path(),
    JSON.stringify({
      number_of_transactions_to_review: transactionCount,
    }),
    false,
  );

export default trackReviewNowClickFromBackEnd;

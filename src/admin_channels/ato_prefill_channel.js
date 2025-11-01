import consumer from "./consumer";

const filingObligationSubscribe = (filingObligationId, callback) => {
  consumer.subscriptions.create({ channel: "AtoAdminFilingObligationPrefillChannel", filing_obligation_id: filingObligationId }, {
    connected() {
      // Called when the subscription is ready for use on the server
    },

    disconnected() {
      // Called when the subscription has been terminated by the server
    },

    received(data) {
      // Called when there's incoming data on the websocket for this channel
      if (callback) callback.call(null, data);
    },
  });
};

const activityStatementSubscribe = (activityStatementId, callback) => {
  consumer.subscriptions.create({ channel: "AtoAdminActivityStatementPrefillChannel", activity_statement_id: activityStatementId }, {
    connected() {
      // Called when the subscription is ready for use on the server
    },

    disconnected() {
      // Called when the subscription has been terminated by the server
    },

    received(data) {
      // Called when there's incoming data on the websocket for this channel
      if (callback) callback.call(null, data);
    },
  });
};

export { filingObligationSubscribe, activityStatementSubscribe };

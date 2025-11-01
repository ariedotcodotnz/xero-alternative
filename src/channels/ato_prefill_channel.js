import consumer from "../admin_channels/consumer";

const subscribe = (filingObligationId, callback) => {
  consumer.subscriptions.create({ channel: "AtoFilingObligationPrefillChannel", filing_obligation_id: filingObligationId }, {
    connected() {
      // Called when the subscription is ready for use on the server
      $.rails.ajax({
        type: "POST",
        dataType: "json",
        url: Routes.filing_obligation_prefill_summaries_path({ filing_obligation_id: filingObligationId }),
      });
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

export { subscribe };

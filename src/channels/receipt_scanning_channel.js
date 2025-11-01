import consumer from "../admin_channels/consumer";

let callback;

const subscribe = (expenseId, callback) => {
  consumer.subscriptions.create({ channel: "ReceiptScanningChannel", expense_id: expenseId }, {
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

export { subscribe };

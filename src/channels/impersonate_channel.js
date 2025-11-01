import consumer from "../admin_channels/consumer";

let modal = null;

consumer.subscriptions.create("ImpersonateChannel", {
  connected() {
    this._createModal();
    this._addEventListener();
  },

  disconnected() {
    if (modal !== null) modal.remove();
  },

  received(data) {
    const impersonateDetails = document.getElementById("impersonate-details");
    if (impersonateDetails) {
      const userId = Number(impersonateDetails.getAttribute("data-impersonating-id"));
      const adminUserId = Number(impersonateDetails.getAttribute("data-impersonator-id"));
      const sessionExpired = data.admin_user_id === adminUserId && ((data.action === "start" && data.user_id !== userId) || (data.action === "stop" && data.user_id === userId));

      if (sessionExpired) {
        impersonateDetails.setAttribute("data-impersonating-id", ""); // block any double or re-impersonate attempts
        // Slight timeout so we don't flash the modal while the user is waiting for admin to load.
        setTimeout(() => {
          modal.dispatchEvent(new CustomEvent("open"));
        }, 2000);
      }
    }
  },

  _createModal () {
    const modalName = "impersonate-modal";
    const impersonateDetails = document.getElementById("impersonate-details");
    const hasModal = document.getElementsByTagName(modalName).length > 0

    if (impersonateDetails && !hasModal) {
      const modalElement = document.createElement(modalName);
      modal = document.body.appendChild(modalElement);
    };
  },
  
  _addEventListener () {
    // Turbolink has the annoying habit of replacing the DOM when it renders.
    // This causes the modal we added in `connect` above to be replaced too.
    // When an admin impersonates a new user, the modal won't be triggered because it's not there anymore.
    // ThAnKs TuRbOlInKs!
    // const self = this;
    // document.addEventListener("turbolinks:render", function (_event) {
    //   self._createModal();
    // });

    document.addEventListener("turbolinks:render", (_event) => this._createModal());
  }
});

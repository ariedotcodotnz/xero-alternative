import React from "react";
import ReactDOM from "react-dom";
import PaystationLogo from "../../../../assets/images/paystation_logo.svg";
import HnryPaymentLogo from "../../../../assets/images/hnry-logo-name-only.svg";
import MasterCardLogo from "../../../../assets/images/mc_vrt_pos.svg";
import VisaLogo from "../../../../assets/images/visa-logo.jpg";
import * as baseHelper from "../../utils/base_helper";

export default class PayNowModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return ReactDOM.createPortal(
      <div
        className="modal pay-now"
        id="modalPayNow"
        role="dialog"
        aria-labelledby="modalPayNowLabel"
        aria-hidden="true"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog modal-notify modal-info" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <p className="heading lead">Secure Payment</p>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={this.props.handleModalClose}
              >
                <span aria-hidden="true" className="white-text">
                  &times;
                </span>
              </button>
            </div>
            <div className="modal-body body-preview">
              <div className="header-logo">
                <img className="tw-pb-1" width="100%" height="100%" src={HnryPaymentLogo} alt="Hnry Payments Logo" />
              </div>
              {this.props.currencyOptions.code
                != this.props.jurisdictionCurrencyCode && this.convertedFrom()}
              <iframe
                className="iframe"
                frameBorder="0"
                src={this.props.url}
                title="Pay now card information"
              ></iframe>

              <div className="row">
                <div className="col-sm-4">
                  <div className="mastercard-logo">
                    <img height="100%" width="100%" src={MasterCardLogo} alt="Mastercard Logo" />
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="paystation-logo">
                    <img height="100%" width="100%" src={PaystationLogo} alt="Paystation Logo" />
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="visa-logo">
                    <img height="100%" src={VisaLogo} alt="Visa Logo" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.querySelector(
        "[data-react-class='invoice_quote/InvoiceQuoteShow'",
      ),
    );
  }

  convertedFrom() {
    return (
      <span className="lead">
        Converted from {baseHelper.formatCurrency(this.props.total, { ...this.props.currencyOptions, ...{ include_code: true } })}
      </span>
    );
  }
}

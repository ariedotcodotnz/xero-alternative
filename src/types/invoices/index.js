import PropTypes from "prop-types";

export const invoiceFormTextType = PropTypes.shape({
  client_name: PropTypes.string,
  invoice_date: PropTypes.string,
  due_date: PropTypes.string,
  schedule_date: PropTypes.string,
  schedule_time: PropTypes.string,
  period_start_date: PropTypes.string,
  period_end_date: PropTypes.string,
  invoice_items: PropTypes.string,
  comments: PropTypes.string,
  task_name: PropTypes.string,
  updated_name: PropTypes.string,
  quantity: PropTypes.string,
  twitter: PropTypes.string,
  twitter_short: PropTypes.string,
  facebook: PropTypes.string,
  facebook_short: PropTypes.string,
  marketing_site: PropTypes.string,
  marketing_site_short: PropTypes.string,
  recurrence_tooltip: PropTypes.string,
});

export const invoiceCurrencyOptionsType = PropTypes.shape({
  code: PropTypes.string,
  symbol: PropTypes.string,
  symbol_first: PropTypes.bool,
  decimal_places: PropTypes.number,
  include_code: PropTypes.bool,
});

export default {
  invoiceFormTextType,
  invoiceCurrencyOptionsType,
};

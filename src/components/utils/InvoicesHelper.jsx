import React from "react";
import * as baseHelper from "./base_helper";

const LOGO_MAX_HEIGHT = 150;
const LOGO_MAX_WIDTH = 300;

export function drawImage(canv, logo) {
  if (typeof (canv) != "undefined" && canv != null) {
    const myImage = new Image();
    myImage.src = logo;
    const ctx = canv.getContext("2d");
    myImage.onload = function () {
      let width = myImage.width;
      let height = myImage.height;
      if (height > LOGO_MAX_HEIGHT) {
        width = (width * LOGO_MAX_HEIGHT) / height;
        height = LOGO_MAX_HEIGHT;
      }
      if (width > LOGO_MAX_WIDTH) {
        height = (height * LOGO_MAX_WIDTH) / width;
        width = LOGO_MAX_WIDTH;
      }
      ctx.drawImage(myImage, 0, 0, width, height);// 100, 100 * imageObj.height / imageObj.width
    };
  }
}

export function getGstBreakdown(total, has_sales_tax, sales_tax_rate) {
  let rate = 0;
  let multiplier = 1;
  if (has_sales_tax) {
    rate += sales_tax_rate;
    multiplier += sales_tax_rate;
  }

  return {
    price_exc: total,
    price_inc: multiplier * total,
    price_gst: rate * total,
  };
}

export function getExpenseGst(price_exc, price_inc) {
  const price_gst = price_inc - price_exc;

  return {
    price_exc,
    price_inc,
    price_gst,
  };
}

export function getGst(gst, price) {
  let price_float = parseFloat(price);
  if (gst) {
    price_float *= 0.15;
  } else {
    price_float *= 0;
  }
  return price_float;
}

export function totalExcludingGstIncludingExpenses(expenses, total) {
  let total_float = parseFloat(total);
  if (expenses) {
    expenses.map(function (ex, i) {
      total_float += parseFloat(ex.gst_exclusive_cost);
    });
  }
  return total_float;
}

export function totalGstIncludingExpenses(expenses, total, gst_number, sales_tax_rate) {
  let gst = getGstBreakdown(total, gst_number, sales_tax_rate).price_gst;

  if (expenses) {
    expenses.map(function (ex, i) {
      gst += (parseFloat(ex.gst_inclusive_cost) - parseFloat(ex.gst_exclusive_cost));
    });
  }
  return baseHelper.round2Dp(gst);
}

export function totalIncludingGstIncludingExpenses(expenses, total, gst_number, credit_card_fee, amount_paid, sales_tax_rate) {
  let total_with_gst = baseHelper.round2Dp(getGstBreakdown(total, gst_number, sales_tax_rate).price_inc);

  if (expenses) {
    expenses.map(function (ex, i) {
      total_with_gst += parseFloat(ex.gst_inclusive_cost);
    });
  }

  total_with_gst += credit_card_fee;

  total_with_gst -= amount_paid;

  return total_with_gst;
}

export function totalBoxRight(expenses, total, gst_number, credit_card_fee, amount_paid, sales_tax_rate, invoice_currency_options) {
  return <div className="inv-tmpl-total inv-right">
            <div className="inv-tmpl-total-left inv-left">
              <div>Subtotal: &nbsp;</div>
              <br/>
              <div>Total GST: &nbsp;</div>
              {creditCardFeeLabel(credit_card_fee)}
              {amountPaidLabel(amount_paid)}
              <br/>
              <div><b>Amount due: &nbsp;</b></div>
            </div>
            <div className="inv-tmpl-total-right inv-right">
              <div>{baseHelper.formatCurrency(totalExcludingGstIncludingExpenses(expenses, total), invoice_currency_options)}</div>
              <br/>
              <div>{baseHelper.formatCurrency(totalGstIncludingExpenses(expenses, total, gst_number, sales_tax_rate), invoice_currency_options)}</div>
              {creditCardFee(credit_card_fee, invoice_currency_options)}
              {amountPaid(amount_paid, invoice_currency_options)}
              <br/>
              <div><b> {baseHelper.formatCurrency(totalIncludingGstIncludingExpenses(expenses, total, gst_number, credit_card_fee, amount_paid, sales_tax_rate), { ...invoice_currency_options, ...{ include_code: true } })} </b></div>
            </div>
          </div>;
}

export function creditCardFeeLabel(credit_card_fee) {
  if (credit_card_fee > 0) {
    return <div>
             <br/>
             <div>Card Convenience Fee: &nbsp;</div>
           </div>;
  }
}

export function creditCardFee(credit_card_fee, invoice_currency_options) {
  if (credit_card_fee > 0) {
    return <div>
             <br/>
             <div>{baseHelper.formatCurrency(credit_card_fee, invoice_currency_options)}</div>
           </div>;
  }
}

export function amountPaidLabel(amount_paid) {
  if (amount_paid > 0) {
    return <div>
             <br/>
             <div>Paid: &nbsp;</div>
           </div>;
  }
}

export function amountPaid(amount_paid, invoice_currency_options) {
  if (amount_paid > 0) {
    return <div>
             <br/>
             <div>{baseHelper.formatCurrency(amount_paid * -1, invoice_currency_options)}</div>
           </div>;
  }
}

export function timeNumbers(quantity, price) {
  let total = 0.0;
  if (!isNaN(parseFloat(quantity)) && !isNaN(parseFloat(price))) {
    total = parseFloat(total) + (parseFloat(quantity) * parseFloat(price));
  }
  return total;
}

export function beforeSubmitInvoice(disabled, status, total) {
  if (!disabled || status == "SENT" || status == "PART_PAID") {
    return status == "PREVIEW" ? "DRAFT" : status;
  }
  return false;
}

export const getFormData = ($form) => {
  const unindexed_array = $form.serializeArray();
  const indexed_array = {};

  $.map(unindexed_array, function (n, i) {
    // Filter out form items with _typedown which are for presentation only via the typedown
    if (n.name.indexOf("_typedown") < 0) {
      indexed_array[n.name] = n.value;
    }
  });

  return indexed_array;
};

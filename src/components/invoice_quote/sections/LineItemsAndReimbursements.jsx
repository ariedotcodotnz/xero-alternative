import React from "react";
import { formatCurrency } from "../../utils/base_helper";

const LineItemsAndReimbursements = ({ lineItems, reimbursments, customerRebates, currencyOptions, salesTaxName }) => (
  <>
    <section className="mb-2">
      <ExpandedTableHeader 
        salesTaxName={salesTaxName}
      />
      {lineItems.map(({
        updated_name, quantity, service_price, total, sales_tax, price,
      }, index) => (
        <LineItem
          description={updated_name}
          quantity={quantity}
          unitPrice={price === null ? "" : service_price} // service_price is called price in quote
          salesTax={sales_tax}
          total={total}
          currencyOptions={currencyOptions}
          key={`lineItem-${index}`}
          childKey={`lineItem-${index}`}
        />
      ))}
      {reimbursments.map(({
        receipt_description, gst_exclusive_cost, gst_inclusive_cost, receipt,
      }, index) => (
        <LineItem
          description={receipt_description}
          quantity={1}
          unitPrice={gst_exclusive_cost}
          salesTax={gst_inclusive_cost - gst_exclusive_cost}
          total={gst_exclusive_cost}
          currencyOptions={currencyOptions}
          key={`reimbursement-${index}`}
          prefix={"Reimbursement"}
          link={receipt}
          emphisised
        />
      ))}
      {customerRebates.map(({
        receipt_description, gst_exclusive_cost, gst_inclusive_cost, receipt,
      }, index) => (
        <LineItem
          description={receipt_description}
          quantity={1}
          unitPrice={gst_exclusive_cost}
          salesTax={gst_inclusive_cost - gst_exclusive_cost}
          total={gst_exclusive_cost}
          currencyOptions={currencyOptions}
          key={`customer-rebate-${index}`}
          prefix={""}
          link={receipt}
          emphisised
        />
      ))}
    </section>
    <hr className="primary" />
  </>
);

const ExpandedTableHeader = ({salesTaxName}) => (
  <header className="d-flex py-1" style={{ borderBottom: "2px solid #dee2e6" }}>
    <div className="col-4 col-lg-5 pl-0">
      <strong>Description</strong>
    </div>
    <div className="col-1 text-right">
      <strong>Qty</strong>
    </div>
    <div className="col-2 text-right">
      <strong><span className="hidden-sm-down">Unit </span>Price</strong>
    </div>
    <div className="col-2 text-right">
      <strong>{salesTaxName ?? ""}</strong>
    </div>
    <div className="col-3 col-lg-2 px-0 text-right">
      <strong>Total {`(excl. ${salesTaxName ?? ""})`}</strong>
    </div>
  </header>
);

export const LineItem = ({
  description, quantity, unitPrice, salesTax, total, emphisised, prefix, currencyOptions, childKey, link,
}) => {
  const descriptionAsArray = description ? description.split(/\n/g).filter((line) => line) : [];
  const quantityBlank = quantity === "" || quantity === null;
  const unitPriceBlank = unitPrice === "" || unitPrice === null;

  if (!description && quantityBlank && unitPriceBlank) {
    return <div className="d-flex mt-3" />;
  } if (quantityBlank && unitPriceBlank) {
    return (
      <div className="d-flex mt-1">
        <div className="col-4 col-lg-5 pl-0 wrap-text" data-testid="description">
          <DescriptionColumn { ...{
            descriptionAsArray, childKey, prefix, link,
          }} />
        </div>
        <div className="col-1" data-testid="quantity" />
        <div className="col-2" data-testid="price" />
        <div className="col-2" data-testid="sales_tax"/>
        <div className="col-3 col-lg-2 px-0" data-testid="total"/>
      </div>
    );
  }

  return (
    <div className="d-flex mt-1">
      <div
        className={`col-4 col-lg-5 pl-0 wrap-text ${
          emphisised ? "hnry-green-text" : ""
        }`}
        data-testid="description"
      >
        <DescriptionColumn { ...{
          descriptionAsArray, childKey, prefix, link,
        }} />
      </div>
      <div className="col-1 text-right invoice-template__col" data-testid="quantity" >
        {Number.isFinite(quantity) ? quantity.toFixed(2) : ""}
      </div>
      <div className="col-2 text-right" data-testid="price" >
        {unitPriceBlank ? "" : formatCurrency(unitPrice || 0, currencyOptions)}
      </div>
      <div className="col-2 text-right" data-testid="sales_tax">
        {(unitPriceBlank || quantity === "") ? "" : formatCurrency(salesTax, currencyOptions)}
      </div>
      <div className="col-3 col-lg-2 px-0 text-right" data-testid="total">
        {(unitPriceBlank || quantity === "") ? "" : formatCurrency(total, currencyOptions)}
      </div>
    </div>
  );
};

const DescriptionColumn = ({
  descriptionAsArray, prefix, childKey, link,
}) => (
  descriptionAsArray.map((paragraph, index) => {
    const content = index < 1 && prefix ? `${prefix}: ${paragraph}` : paragraph;
    return (
      <p
        key={`${childKey}_paragraph_${index}`}
        className={index === descriptionAsArray.length - 1 ? "mb-0" : ""}
      >
        {link ? (
          <a href={link} target="_blank" className="hnry-green-text" rel="noreferrer">
            {content}
          </a>
        ) : (
          content
        )}
      </p>
    );
  })
);

export default LineItemsAndReimbursements;

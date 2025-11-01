import React from "react";
import { toLocaleString, formattedDateWithMonthName } from "../../../utils/base_helper";
import Row from "./Row";
import Table from "./Table";

const CapitalTaxEvent = ({
  capitalGainsTaxEvent,
  rentalPropertyIncomeSources,
  cryptocurrency,
  capitalTaxes,
}) => (
  <>
    <Table title="Capital gain" code="18">
      <Row
        fieldName="Did you have a CGT event during the year?"
        value={capitalGainsTaxEvent ? "Yes" : "No"}
        code="G"
        warningTooltip={capitalGainsTaxEvent ? "Contact customer for more" : ""}
      />
    </Table>

    {cryptocurrency.map((crypto, index) => {
      const {
        capitalGainsShortTerm, capitalGainsLongTerm, capitalLossTotal, capitalLossTotalFromPreviousFy,
      } = crypto;
      const i = index + 1;

      return (
        <Table title={`Cryptocurrency - ${i}`} code="18" key={`cryptocurrency-${i}`}>
          {capitalGainsShortTerm > 0 && (
            <Row
              fieldName="Short Term Capital Gains"
              value={`$${toLocaleString(capitalGainsShortTerm, 0)}`}
              copyLabel={`crypto-capital_gains_short_term${i}`}
            />
          )}
          {capitalGainsLongTerm > 0 && (
            <Row
              fieldName="Long Term Capital Gains"
              value={`$${toLocaleString(capitalGainsLongTerm, 0)}`}
              copyLabel={`crypto-capital_gains_long_term${i}`}
            />
          )}
          {capitalLossTotal > 0 && (
            <Row
              fieldName="Total Capital Losses"
              value={`$${toLocaleString(capitalLossTotal, 0)}`}
              copyLabel={`crypto-capital_loss${i}`}
            />
          )}
          {capitalLossTotalFromPreviousFy > 0 && (
            <Row
              fieldName="Total Capital Losses incurred in previous financial years"
              value={`$${toLocaleString(capitalLossTotalFromPreviousFy, 0)}`}
              copyLabel={`crypto-capital_loss_from_prev_fy${i}`}
            />
          )}
        </Table>
      );
    })}

    {capitalTaxes.map((capitalTax, index) => {
      const {
        description, purchaseDate, purchasePrice, saleDate, salePrice,
      } = capitalTax;
      const i = index + 1;

      return (
        <Table title={`Capital gain/loss - ${i}`} code="18" key={`capital-gain-loss-${i}`}>
          <Row
            fieldName="Asset name/type"
            value={description}
            copyLabel={`cgl-asset-name-${i}`}
            colWidth2="20%"
          />
          <Row
            fieldName="Date of purchase"
            value={formattedDateWithMonthName(purchaseDate)}
            copyLabel={`cgl-purchase-date-${i}`}
          />
          <Row
            fieldName="Date of sale"
            value={formattedDateWithMonthName(saleDate)}
            copyLabel={`cgl-sale-date-${i}`}
          />
          <Row
            fieldName="Purchase price"
            value={`$${toLocaleString(purchasePrice, 0)}`}
            copyLabel={`cgl-purchase-price-${i}`}
          />
          <Row
            fieldName="Sale price"
            value={`$${toLocaleString(salePrice, 0)}`}
            copyLabel={`cgl-sale-price-${i}`}
          />
        </Table>
      );
    })}

    {rentalPropertyIncomeSources.map(({
      addressLine1, profitOrLossFromPropertySales, rentalPropertySold, rentalPropertyPurchaseDate, rentalPropertySaleDate,
    }, index) => {
      const i = index + 1;

      return rentalPropertySold ? (
        <Table title={`Capital gain - Property ${i}`} code="18" key={`capital-gain-property${i}`}>
          <Row fieldName="Address" copyLabel={`cgt-rental-property-address${i}`} value={addressLine1} colWidth1="40%" colWidth2="40%"/>
          <Row fieldName="Property purchase date" copyLabel={`cgt-rental-property-purchase-date${i}`} value={formattedDateWithMonthName(rentalPropertyPurchaseDate)} />
          <Row fieldName="Property sale date" copyLabel={`cgt-rental-property-sale-date${i}`} value={formattedDateWithMonthName(rentalPropertySaleDate)} />
          <Row fieldName="Profit of the sale" copyLabel={`cgt-rental-property-profit-or-loss${i}`} value={profitOrLossFromPropertySales} />
        </Table>
      ) : null;
    })}
  </>
);

export default CapitalTaxEvent;

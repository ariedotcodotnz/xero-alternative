import React, { useState, useRef, useMemo, useEffect } from "react";
import Modal from "@hui/_molecules/modal/Modal";
import InputWithTooltip from "@hui/_molecules/input_group/InputWithTooltip";
import Tooltip from "@hui/_atoms/tooltip/Tooltip";
import InputPrice from "@hui/_atoms/input/InputPrice";
import Select from "@hui/_atoms/select/Select";
import I18n from "../../utilities/translations";
import { getServiceAmounts } from "../../API/services.api";

type ServiceType = {
  id: number,
  name: string,
  newRecord: boolean,
  price: number,
  priceAmount: number,
  salesTax: number,
  salesTaxType: string,
}

interface iCreateEditServiceForm {
  title: string;
  salesTaxRegistered: boolean;
  service: ServiceType;
  salesTaxTypes: string[];
}
const ctx = { scope: "services.form" };

const CreateEditServiceForm = ({
  title,
  salesTaxRegistered,
  service,
  salesTaxTypes,
}: iCreateEditServiceForm) => {
  const form = useRef<HTMLFormElement>();
  const [show, setShow] = useState(true);
  const [disabledSubmit, setDisabledSubmit] = useState(true);
  const [editing, setEditing] = useState(false);
  const [serviceName, setServiceName] = useState(service.name || "");
  const [salesTaxType, setSalesTaxType] = useState(service.salesTaxType || "");
  const [salesTax, setSalesTax] = useState(service.salesTax ? Number(service.salesTax).toFixed(2) : "0.00");
  const [taxableIncome, setTaxableIncome] = useState(service.price ? Number(service.price).toFixed(2) : "0.00");
  const [servicePriceAmount, setServicePriceAmount] = useState(service.priceAmount ? Number(service.priceAmount).toFixed(2) : "");
  const [servicePrice, setServicePrice] = useState(service.price ? Number(service.price).toFixed(2) : "");
  const csrfToken: HTMLMetaElement | undefined = document.querySelector("meta[name='csrf-token']");
  const currencySymbol = window.Hnry?.User?.jurisdiction?.currencySymbol || "$";

  useEffect(() => {
    if (!editing) {
      if (salesTaxRegistered && serviceName.length > 0 && salesTaxType.length > 0 && servicePriceAmount.length > 0) {
        setDisabledSubmit(false);
      } else if (!salesTaxRegistered && serviceName.length > 0 && servicePrice.length > 0) {
        setDisabledSubmit(false);
      } else {
        setDisabledSubmit(true);
      }
    }
  }, [salesTaxRegistered, editing, serviceName, salesTaxType, servicePrice, servicePriceAmount]);

  const handleSubmit = () => {
    form.current.requestSubmit();
  }

  const salesTaxTypeOptions = useMemo(() => (
    salesTaxTypes.map(type => ({ value: type, name: I18n.t(`services.sales_tax_types.${type}`) }))
  ), [salesTaxTypes]);

  const updateServiceAmounts = async (priceValue, salesTaxTypeValue) => {
    try {
      setDisabledSubmit(true);
      const response = await getServiceAmounts({ price: Number(priceValue || 0).toFixed(2), salesTaxType: salesTaxTypeValue });
      const { sales_tax: salesTaxAmount, taxable_income: taxableIncomeAmount } = response;

      setSalesTax(Number(salesTaxAmount).toFixed(2));
      setTaxableIncome(Number(taxableIncomeAmount).toFixed(2));
    } catch (error) {
      toastr.error("Sorry, we're unable to estimate the GST and Taxable income amounts right now");
    } finally {
      if (salesTaxRegistered && serviceName.length > 0 && salesTaxType.length > 0 &&
          salesTaxTypeValue.length > 0 && priceValue.length > 0) {
        setDisabledSubmit(false);
      }
    }
  }

  const handleNameChange = (value) => {
    setServiceName(value);
  }

  const handleSalesTaxTypeChange = (value) => {
    setSalesTaxType(value);
    updateServiceAmounts(servicePriceAmount, value);
  }

  const handlePriceAmountKeyUp = (event) => {
    const { rawValue } = event.target;

    setEditing(true);
    setDisabledSubmit(true);
    setServicePriceAmount(rawValue);
    updateServiceAmounts(rawValue, salesTaxType);
  }

  const handlePriceAmountBlur = (value) => {
    setEditing(false);
    setServicePriceAmount(Number(value || 0).toFixed(2));
    updateServiceAmounts(value, salesTaxType);
  }

  return (
    <Modal
      open={show}
      setOpen={setShow}
      title={title}
      confirmCTA={I18n.t("global.actions.save")}
      onConfirm={handleSubmit}
      disabled={disabledSubmit}
    >
      <form
        data-remote="true"
        ref={form}
        method={service.newRecord ? "POST" : "PATCH"}
        action={service.newRecord ? "/services": `/services/${service.id}`}
      >
        <input type="hidden" name="authenticity_token" value={csrfToken?.content} autoComplete="off" />
        {salesTaxRegistered ? (
          <div className="tw-flex tw-flex-col sm:tw-mb-4">
            {/* service_name */}
            <div className="tw-w-full tw-mb-3 sm:tw-mb-4">
              <InputWithTooltip
                id="service_name"
                name="service[name]"
                setValue={handleNameChange}
                popoverMessage={I18n.t("name_info", ctx)}
                value={serviceName}
                label={I18n.t("name", ctx)}
                placement="bottom"
                required
              />
            </div>
            {/* service_sales_tax_type */}
            <div className="tw-w-full tw-mb-2 sm:tw-mb-4">
              <Select
                options={salesTaxTypeOptions}
                onChange={handleSalesTaxTypeChange}
                selectedValue={salesTaxType}
                id="service_sales_tax_type"
                name="service[sales_tax_type]"
                label={I18n.t("sales_tax_type", ctx)}
                required
              />
            </div>
            {/* price, sales_tax, taxable income */}
            <div className="tw-flex tw-justify-between tw-items-end tw-flex-col sm:tw-flex-row tw-w-full tw-gap-x-3">
              <div className="tw-w-full tw-mb-2 sm:tw-mb-0">
                <label className="hnry-label hnry-label--required !tw-flex tw-items-center" htmlFor="service_price_amount">
                  {I18n.t("sales_price", ctx)}
                  <Tooltip popoverMessage={I18n.t("price_currency_info", ctx)} size="base" />
                </label>
                <InputPrice
                  value={servicePriceAmount}
                  onKeyUp={handlePriceAmountKeyUp}
                  onBlur={handlePriceAmountBlur}
                  placeholder="0.00"
                  name="service[price_amount]"
                  id="service_price_amount"
                  label={I18n.t("price", ctx)}
                  currencySign={currencySymbol}
                  hideLabel
                />
              </div>
              {/* service_sales_tax */}
              <div className="tw-w-full tw-mb-2 sm:tw-mb-0">
                <InputPrice
                  value={salesTax}
                  placeholder="0.00"
                  name="service[sales_tax]"
                  id="service_sales_tax"
                  label={I18n.t("global.sales_tax")}
                  currencySign={currencySymbol}
                  readOnly
                />
              </div>
              {/* taxable_income */}
              <div className="tw-w-full">
                <label className="hnry-label !tw-flex tw-items-center" htmlFor="service_price">
                  {I18n.t("taxable_income", ctx)}
                  <Tooltip popoverMessage={I18n.t("taxable_income_tooltip", ctx)} size="base" />
                </label>
                <InputPrice
                  value={taxableIncome}
                  placeholder="0.00"
                  name="service[price]"
                  id="service_price"
                  label={I18n.t("price", ctx)}
                  currencySign={currencySymbol}
                  hideLabel
                  readOnly
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="tw-flex tw-flex-col tw-justify-between sm:tw-flex-row tw-w-full tw-gap-x-3 tw-mb-6">
            {/* service_name */}
            <div className="tw-w-full tw-mb-4 sm:tw-mb-0">
              <InputWithTooltip
                setValue={handleNameChange}
                id="service_name"
                popoverMessage={I18n.t("name_info", ctx)}
                label={I18n.t("name", ctx)}
                value={serviceName}
                name="service[name]"
                placement="bottom"
                required
              />
            </div>

            {/* service_price */}
            <div className="tw-w-full">
              <label className="hnry-label hnry-label--required !tw-flex tw-items-center" htmlFor="service_price">
                {I18n.t("price", ctx)}
                <Tooltip popoverMessage={I18n.t("price_currency_info", ctx)} />
              </label>
              <InputPrice
                value={servicePrice}
                onChange={(value) => setServicePrice(value)}
                placeholder="0.00"
                name="service[price]"
                id="service_price"
                label={I18n.t("price", ctx)}
                currencySign={currencySymbol}
                hideLabel
                required
              />
            </div>
            <input type="hidden" name="service[sales_tax_type]" id="service_sales_tax_type" value="exclusive" />
          </div>
        )}
      </form>
    </Modal>
  );
}

export default CreateEditServiceForm;

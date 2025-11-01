import React, { useState } from "react";
import PropTypes from "prop-types";

const PromoCode = ({
  promoCodeUrl, setHnryCreditBalance, setPromoCodeApplied, promoCodeApplied,
}) => {
  const [value, setValue] = useState("");
  const [readOnly, setReadOnly] = useState(promoCodeApplied.length > 0 || false);
  const [subHeading, _] = useState(promoCodeApplied.length > 0 && "Whoops! Looks like you’ve already used a promo code (you can only use one).");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!readOnly) {
      const trimmedValue = value.trim();
      setReadOnly(true);
      $.rails.ajax({
        type: "POST",
        url: promoCodeUrl,
        data: {
          user: {
            promo_code: trimmedValue,
          },
        },
        success: ({ credit_balance }) => {
          toastr.success("Promo code applied!");
          setReadOnly(true);
          setHnryCreditBalance(credit_balance);
          setPromoCodeApplied(trimmedValue);
        },
        error: ({ responseText }) => {
          const { error } = JSON.parse(responseText);
          toastr.error(error);
          setReadOnly(false);
        },
      });
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <>
      <div className="referral-modal__info">
        <h4 id="referral-friends-modal-title" className="tw-text-gray-900 tw-font-semibold tw-text-lg tw-mt-3">
          Redeem Hnry credit 🎉
        </h4>
        <p className="tw-text-sm sm:tw-text-base tw-text-gray-700 referral-modal__paragraph">
          {subHeading
            || "If you have a Hnry Promo Code, enter it here to get money off your Hnry Fees as well as Hnry Partner perks."}
        </p>
      </div>
      <div className="enter-promo-code">
        <form onSubmit={handleSubmit}>
          <div className="md-form">
            <input
              type="text"
              className="form-control"
              name="user[promo_code]"
              id="user_promo_code"
              onChange={handleChange}
              readOnly={readOnly}
              defaultValue={promoCodeApplied}
            />
            <label htmlFor="user_promo_code" className="active">
              Promo code
            </label>
          </div>
          {promoCodeApplied.length <= 0 && (
            <button
              type="submit"
              className="hnry-button hnry-button--primary tw-w-full"
              disabled={readOnly}
            >
              Submit
            </button>
          )}
        </form>
      </div>
    </>
  );
};

PromoCode.propTypes = {
  promoCodeUrl: PropTypes.string.isRequired,
  promoCodeApplied: PropTypes.string,
  setPromoCodeApplied: PropTypes.func.isRequired,
  setHnryCreditBalance: PropTypes.func.isRequired,
};

export default PromoCode;

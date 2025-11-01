import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import I18n from "../../utilities/translations";
import { ExpenseContext } from "./ExpenseContext";

const MileageExpenseFields = () => {
  const [estimatedClaim, setEstimatedClaim] = useState<string>("")
  const { vehicle, fuelRatesProps, motorVehicleProps, jurisdictionInformation, isAdminReview } = useContext(ExpenseContext)
  const { code: jurisdictionCode } = jurisdictionInformation
  const distanceInput = useRef<HTMLInputElement>(null)
  const { baseRate, rates } = fuelRatesProps
  const { expenseDistanceTravelled, expenseEstimatedClaim, vehicleForAdmin } = motorVehicleProps
  const fuelType = vehicle?.fuelType

  useEffect(() => {
    if (expenseEstimatedClaim != null && expenseEstimatedClaim !== "0.0") {
      setEstimatedClaim(expenseEstimatedClaim)
    }
  }, [expenseEstimatedClaim])


  const handleDistanceChange = useCallback((e) => {
    const value = Number(e.target.value)

    // Will loop AU into this change when the change is applied to all forms as we have a better jurisdiction check there
    // Currently this feature would present $0.00 for AU just as it would below
    if (isAdminReview) {
      const fuelRate = rates[vehicleForAdmin?.fuelType]
      const rate = fuelRate?.tierOne ?? 0
      const mileageToValue = value * rate
      setEstimatedClaim(`${I18n.t("number.currency.format.unit")}${mileageToValue.toFixed(2)}`)
      return
    }

    if (!fuelType) return;

    // TODO - Updated this function (when backend changes are in place) to handle tier two for vehicles with over 14,000 km (nz) + whatever UK requirements are
    // Also to potentially display a warning re: over cap limit for AUS (5,000km) (reliant on BE)
    if (jurisdictionCode === "au") {
      const mileageToValue = Number(baseRate) * value;
      setEstimatedClaim(`${I18n.t("number.currency.format.unit")}${mileageToValue.toFixed(2)}`);
    } else {
      const fuelRate = rates[fuelType]
      const rate = fuelRate?.tierOne ?? 0
      const mileageToValue = rate * value
      setEstimatedClaim(`${I18n.t("number.currency.format.unit")}${mileageToValue.toFixed(2)}`);
    }

  }, [baseRate, fuelType, isAdminReview, jurisdictionCode, rates, vehicleForAdmin?.fuelType])

  useEffect(() => {
    if (vehicle !== null && distanceInput.current.value) {
      handleDistanceChange({ target: { value: distanceInput.current.value } });
    }
  }, [vehicle, handleDistanceChange]);

  return (
    <>
      <div className="row">
        <div className="col">
          <div className="md-form">
            <label htmlFor="expense[distance_travelled]" className={expenseDistanceTravelled ? "active" : ""}>{I18n.t("expenses.form.motor_vehicles.distance_travelled")}</label>
            <input type="number"
              defaultValue={expenseDistanceTravelled}
              required
              step="0.0001"
              className="form-control"
              name="expense[distance_travelled]"
              id="expense[distance_travelled]"
              ref={distanceInput}
              min={0}
              maxLength={7}
              onChange={handleDistanceChange}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="md-form">
            <label htmlFor="expense[estimated_claim]" className={estimatedClaim ? "active" : ""}>
              {I18n.t("expenses.form.motor_vehicles.estimated_claim")} {I18n.t("number.currency.format.unit")}
            </label>
            <input type="string" required className={"form-control"} name="expense[estimated_claim]" id="expense[estimated_claim]" value={estimatedClaim} readOnly />
          </div>
        </div>
      </div>
    </>
  )
}

export default MileageExpenseFields

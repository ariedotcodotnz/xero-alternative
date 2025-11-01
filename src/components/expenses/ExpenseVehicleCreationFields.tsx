import React, { useState, useContext, useRef } from "react";
import Dropdown from "../inputs/dropdown/dropdown";
import Button from "../_atoms/button/Button";
import I18n from "../../utilities/translations";
import { ExpenseContext } from "./ExpenseContext";
import { createVehicleExpense } from "../../API/vehicles.api";
import { VehicleType } from "./ExpenseTypes";

type ExpenseVehicleCreationFieldsProps = {
  setAddingVehicle: (boolean) => void;
  onSuccess: (obj: VehicleType[]) => void;
  setSelectedVehicle: (VehicleType) => void;
  vehicles: VehicleType[]
}

const ExpenseVehicleCreationFields = ({setAddingVehicle, onSuccess, setSelectedVehicle, vehicles}: ExpenseVehicleCreationFieldsProps) => {
  const [registration, setRegistration] = useState<string>("");
  const [makeModel, setMakeModel] = useState<string>("");
  const [fuelType, setFuelType] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const disableCancel = vehicles.length === 0 || isSubmitting

  const { motorVehicleProps } = useContext(ExpenseContext)
  const { fuelTypes } = motorVehicleProps

  const registrationInput = useRef<HTMLInputElement>()
  const makeAndModelInput = useRef<HTMLInputElement>()

  const handleRegoChange = (value) => {
    setRegistration(value.target.value)
  }

  const handleMakeModelChange = (value) => {
    setMakeModel(value.target.value)
  }

   const selectFuelType = {
    label: I18n.t("expenses.form.motor_vehicles.vehicle_type_default"),
    value: "",
    attributes: {selected: false}
  }

  const fuelTypeOptions = Object.values(fuelTypes).map((type) => ({
    label: type,
    value: type,
    attributes: { selected: false }
  }));

  const handleFuelTypeChange = (newFuelType) => {
    setFuelType(newFuelType.selectedValue)
  };

  const handleSubmit = async (event) => {
    event.preventDefault()

    const formatRegistration = registration.trim().toUpperCase()
    const formatMakeModel = makeModel.trim()
    const fuelTypeSelected = fuelTypes.includes(fuelType)

    if (!formatRegistration && !formatMakeModel && !fuelTypeSelected) {
      toastr.error(I18n.t("expenses.form.motor_vehicles.validations.empty_fields"));
      registrationInput.current.classList.add("invalid")
      makeAndModelInput.current.classList.add("invalid")
      return;
    }

    if (!formatRegistration && !formatMakeModel) {
      toastr.error(I18n.t("expenses.form.motor_vehicles.validations.make_model_registration"));
      registrationInput.current.classList.add("invalid")
      makeAndModelInput.current.classList.add("invalid")
      return;
    }

    if (!formatRegistration) {
      toastr.error(I18n.t("expenses.form.motor_vehicles.validations.registration"));
      registrationInput.current.classList.add("invalid")
      return;
    }

    if (!formatMakeModel) {
      toastr.error(I18n.t("expenses.form.motor_vehicles.validations.make_model"));
      makeAndModelInput.current.classList.add("invalid")
      return;
    }

    if (!fuelTypeSelected) {
      toastr.error(I18n.t("expenses.form.motor_vehicles.validations.vehicle_type"));
      return;
    }

    const vehicleData = {
      vehicle: {
        registration: formatRegistration,
        make_and_model: formatMakeModel,
        fuel_type: fuelType
      }
    };

    setIsSubmitting(true);
    try {
      const response = await createVehicleExpense(vehicleData);
      setSelectedVehicle(vehicleData.vehicle)
      setIsSubmitting(false);
      toastr.success(I18n.t("users.vehicles.create.success"));
      onSuccess(response.vehicles);
    } catch (error) {
      toastr.error(error);
    }
  };

  const handleCancel = () => {
    setAddingVehicle(false)
  }

  return (
    <>
      <div className="row">
        <div className="col">
          <div className="md-form">
            <label htmlFor="expenseMvRegistration" className={"active"}>{I18n.t("expenses.form.motor_vehicles.registration")}</label>
            <input ref={registrationInput} type="text" required className={"form-control"} onChange={handleRegoChange} id="expenseMvRegistration" maxLength={7} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="md-form">
            <label htmlFor="expenseMvMakeModel" className={"active"}>{I18n.t("expenses.form.motor_vehicles.make_and_model")}</label>
            <input ref={makeAndModelInput} type="text" required className={"form-control"} onChange={handleMakeModelChange} id="expenseMvMakeModel" />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="md-form">
            <Dropdown
              id="expenseMvFuelType"
              name="fuel-type-select"
              label={I18n.t("expenses.form.motor_vehicles.vehicle_type")}
              disabled={false}
              optionEls={[
                selectFuelType,
                ...fuelTypeOptions,
              ]}
              required={true}
              selectValue={fuelType}
              onChange={handleFuelTypeChange}
              hiddenInputName="fuel-type" />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="tw-flex tw-gap-4 tw-flex-wrap-reverse sm:tw-flex-row">
            <Button
              type="button"
              classes="hnry-button hnry-button--tertiary"
              onClick={handleCancel}
              variant="tertiary"
              name="cancel"
              disabled={disableCancel}
            >
              {I18n.t("global.actions.cancel")}
            </Button>
            <Button
              type="submit"
              classes="hnry-button hnry-button--primary"
              onClick={handleSubmit}
              variant="primary"
              name="save"
              disabled={!!isSubmitting}
            >
              {isSubmitting ? I18n.t("global.actions.saving") : I18n.t("global.actions.save")}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ExpenseVehicleCreationFields;
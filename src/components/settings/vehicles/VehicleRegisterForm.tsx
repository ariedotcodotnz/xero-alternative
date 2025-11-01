/* eslint-disable max-len */
import React, { useState } from "react";
import _ from "lodash";
import I18n from "../../../utilities/translations";
import { createVehicle, updateVehicle } from "../../../API/vehicles.api"
import Input from "../../_atoms/input/Input";
import Button from "../../_atoms/button/Button";
import Dropdown from "../../inputs/dropdown/dropdown";

interface SaveButtonSettings {
  text: string;
  type: "submit";
  className: string;
}

interface VehicleFormProps {
  vehicle?: { id: number; registration: string; make_and_model: string, fuel_type?: string };
  onSuccess: (obj) => void;
  editing: boolean;
  saveButtonSettings: SaveButtonSettings;
  ctx: {
    scope: string;
  };
  fuelTypes: string[];
}

const VehicleRegisterForm = ({vehicle, onSuccess, editing, saveButtonSettings, ctx, fuelTypes}: VehicleFormProps) => {
  const [registration, setRegistration] = useState(vehicle?.registration || "");
  const [makeModel, setMakeModel] = useState(vehicle?.make_and_model || "");
  const [fuelType, setFuelType] = useState(vehicle?.fuel_type || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { text, type, className }: SaveButtonSettings = saveButtonSettings;

  const handleRegoChange = (value) => {
    setRegistration(value)
  }

  const handleMakeModelChange = (value) => {
    setMakeModel(value)
  }

  const handleFuelTypeChange = (newFuelType) => {
    setFuelType(newFuelType.selectedValue)
  }

  const fuelTypeOptions = [
    {
      label: I18n.t("dropdown.default", ctx),
      value: "",
      attributes: { disabled: true, selected: !fuelType }
    },
    ...fuelTypes.map((fuelOption) => ({
      label: _.capitalize(fuelOption),
      value: fuelOption,
      attributes: { selected: fuelType === fuelOption }
    }))
  ]

  const handleSubmit = async (event) => {
    event.preventDefault()

    const formatRegistration = registration.trim().toUpperCase()
    const formatMakeModel = makeModel.trim()

    if (!formatRegistration || !formatMakeModel) {
      toastr.error(I18n.t("errors.missing_fields", ctx));
      return;
    }

    const vehicleData = {
      vehicle: {
        registration: formatRegistration,
        make_and_model: formatMakeModel,
        fuel_type: fuelType
      }
    };

    const editedVehicleData = {
      vehicle: {
        id: vehicle?.id,
        registration: formatRegistration,
        make_and_model: formatMakeModel,
        fuel_type: fuelType
      }
    };

    setIsSubmitting(true);
    try {
      const response = editing
        ? await updateVehicle(editedVehicleData)
        : await createVehicle(vehicleData);

      setIsSubmitting(false);

      if (response.errors?.length) {
        throw new Error(response.errors[0]);
      }

      toastr.success(I18n.t(editing ? "update.success" : "create.success", ctx));
      onSuccess(response.vehicles);
    } catch (error) {
      toastr.error(error);
    }
  };

  return (
    <>
      <tr>
        <td className="td tw-w-4/12">
          <Input
            label={I18n.t("categories.registration", ctx)}
            labelRendered={false} defaultValue={vehicle?.registration || ""}
            placeholder={vehicle?.registration || I18n.t("categories.registration_placeholder", ctx)}
            maxLength={7}
            setValue={handleRegoChange}
          />
        </td>
        <td className="td tw-w-4/12">
          <Input
            label={I18n.t("categories.make_and_model", ctx)}
            labelRendered={false}
            defaultValue={vehicle?.make_and_model || ""}
            placeholder={vehicle?.make_and_model || I18n.t("categories.make_and_model_placeholder", ctx)}
            setValue={handleMakeModelChange}
          />
        </td>
        <td className="td tw-w-6/12">
          <Dropdown
            id={`fuelType-${vehicle?.id || "new"}`}
            name="fuel-type[vehicle_id]-select"
            disabled={false}
            label=""
            optionEls={fuelTypeOptions}
            required={false}
            selectValue={fuelType}
            onChange={handleFuelTypeChange}
            hiddenInputName="vehicle[fuel_type]"
          />
        </td>
      </tr>
      <tr>
        <td colSpan={3} className="td tw-text-right">
          <Button
            type={type}
            classes={className}
            onClick={handleSubmit}
            variant="primary"
            name="save"
            disabled={!!isSubmitting}
          >
            {isSubmitting ? <span className="hnry-button--loading">{I18n.t("hovers.saving_button", ctx)}</span> : text}
          </Button>
        </td>
      </tr>
    </>
  )

}


export default VehicleRegisterForm
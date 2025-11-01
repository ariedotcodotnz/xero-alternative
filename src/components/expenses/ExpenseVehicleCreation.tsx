import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import Dropdown from "../inputs/dropdown/dropdown";
import I18n from "../../utilities/translations";
import { camelizeKeys } from "../utils/base_helper"
import { ExpenseContext } from "./ExpenseContext";
import  ExpenseVehicleCreationFields  from "./ExpenseVehicleCreationFields"
import { getAllVehiclesExpense } from "../../API/vehicles.api";
import Datepicker from "../inputs/datepicker/datepicker";
import { VehicleType } from "./ExpenseTypes";

const ctx = { scope: "users.vehicles" }

const ExpenseVehicleCreation = () => {
  const [vehicles, setVehicles] = useState<VehicleType[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>()
  const [addingVehicle, setAddingVehicle] = useState(false)
  const [date, setDate] = useState<Date | null>(null);

  const { setVehicle, motorVehicleProps, isAdminReview, eoyf, preHnry } = useContext(ExpenseContext)
  const { expenseDate, initialSelectedId, vehicleForAdmin } = motorVehicleProps

  const camelizeVehicles = (vehicleArr: VehicleType[]) => vehicleArr.map((vehicle) => camelizeKeys(vehicle));

  useEffect(() => {
    const controller = new AbortController();
    const fetchVehicles = async () => {
      if (isAdminReview) {
        return;
      } 
      try {
        const data = await getAllVehiclesExpense();
        const formattedVehicles = camelizeVehicles(data);
        setAddingVehicle(formattedVehicles.length === 0);
        setVehicles(formattedVehicles);
      } catch (error) {
        toastr.error(I18n.t("fetch.failure", ctx));
      }
    };
    fetchVehicles();
  
    return () => controller.abort();
    
  }, [isAdminReview]);

  const vehiclesRef = useRef<VehicleType[]>([]);

  useEffect(() => {
    vehiclesRef.current = vehicles;
  }, [vehicles]);

  const handleVehicleUpdate = useCallback((updatedVehicles: VehicleType[]) => {
    const formattedVehicles = camelizeVehicles(updatedVehicles)
    setVehicles(formattedVehicles);
    setAddingVehicle(false);
    window.unsaved_changes = false;
  }, []);

  const updateSelectedMotorVehicle = useCallback((value) => {
  
    const selectedId = value.selectedValue;
    if (selectedId === "add-new") {
      setSelectedVehicle(null);
      setAddingVehicle(true);
      return;
    }

    const vehicleChoice = vehicles.find((v) => v.id === Number(selectedId))
    
    if (vehicleChoice) {
      setSelectedVehicle(vehicleChoice);
      setVehicle(vehicleChoice);
    }
  }, [setVehicle, vehicles]);

  const addNew = {
    label: "+ Add a new vehicle",
    value: "add-new",
    attributes: { selected: false },
  }

  const vehicleOptions = vehicles?.map(({ registration, makeAndModel, id }) => ({
    label: `${registration} - ${makeAndModel}`,
    value: id,
    attributes: { selected: false },
  }))

  const vehicleOptionEls = [...vehicleOptions, addNew]

  const defaultOption = vehicleOptions.find(v => v.value === initialSelectedId) || vehicleOptions.at(-1)

  const inputProps = {
    disabled: false,
    name: "expense[expense_date]",
    required: true,
    onChange: (value: Date) => setDate(value),
    value: expenseDate || date,
  }

  return (
    <>
      {isAdminReview ? 
        <>
          <div className="row">
            <div className="col">
              <div className="md-form">
                <label htmlFor="vehicleForAdmin" className="active">Selected Vehicle</label>
                <input
                  name="vehicleForAdmin"
                  type="text"
                  readOnly
                  value={ vehicleForAdmin ? `${vehicleForAdmin.registration} - ${vehicleForAdmin.makeAndModel} - (${vehicleForAdmin.fuelType})` : "User has not selected a vehicle"}
                />
              </div>
            </div>
          </div>
        </>
        :
        <>
          {!addingVehicle ?
            <Dropdown
              id="expense[vehicle_id]"
              name="expense[vehicle_id]-select"
              label={I18n.t("expenses.form.motor_vehicles.motor_vehicle")}
              disabled={vehicles.length === 0}
              optionEls={vehicleOptionEls}
              required={true}
              selectValue={selectedVehicle?.id?.toString() ?? defaultOption?.value}
              onChange={updateSelectedMotorVehicle}
              hiddenInputName="expense[vehicle_id]" />
            :
            <>
              <ExpenseVehicleCreationFields 
                vehicles={vehicles} 
                onSuccess={handleVehicleUpdate} 
                setAddingVehicle={setAddingVehicle} 
                setSelectedVehicle={setSelectedVehicle}
              />
              <br />
            </>
          }
        </>
      }
      <>
        {!preHnry && !eoyf && (
          <div className="md-form">
            <Datepicker 
              label={I18n.t("expenses.form.motor_vehicles.expense_date")}
              requiredLabel  
              inputProps={inputProps} 
              legacyStyles={true}
            />
          </div>
          )}
      </>
    </>
  );
}

export default ExpenseVehicleCreation;
import React, { useContext } from "react";
import ExpenseContextProvider, { ExpenseContext } from "./ExpenseContext";
import ExpenseCreationForm from "./creation/expense_creation_form";
import ExpenseMileageFields from "./ExpenseMileageFields";
import ExpenseVehicleCreation from "./ExpenseVehicleCreation";
import { ExpenseFormProps } from "./ExpenseTypes";

export const ExpenseVehicleSection = () => {
  const { category, mvFeatureFlag, disableMvEoyf } = useContext(ExpenseContext);
  const { mileageCategory } = category;

  if (disableMvEoyf) return null
  if (!mvFeatureFlag || !mileageCategory) return null;

  return (
    <>
      <ExpenseVehicleCreation />
      <ExpenseMileageFields />
    </>
  )
}

const ExpenseFormRender = (props: ExpenseFormProps) => {
  const { fuelRatesProps, motorVehicleProps, mvFeatureFlag, eoyf, preHnry, jurisdictionInformation, disableMvEoyf, isAdminReview } = props
  
  return (
    <ExpenseContextProvider 
      fuelRatesProps={fuelRatesProps} 
      motorVehicleProps={motorVehicleProps} 
      mvFeatureFlag={mvFeatureFlag} 
      eoyf={eoyf} 
      preHnry={preHnry} 
      jurisdictionInformation={jurisdictionInformation} 
      disableMvEoyf={disableMvEoyf}
      isAdminReview={isAdminReview}
    >
      <ExpenseCreationForm {...props} />
      <ExpenseVehicleSection />
    </ExpenseContextProvider>
  )
}

export default ExpenseFormRender
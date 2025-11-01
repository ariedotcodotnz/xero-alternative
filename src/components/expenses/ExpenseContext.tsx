import React, { createContext, useState } from "react";
import { CategoryType, VehicleType, ExpenseContextType, ExpenseContextProviderProps } from "./ExpenseTypes";

export const ExpenseContext = createContext<ExpenseContextType | null>(null);

const ExpenseContextProvider = ({
  children,
  fuelRatesProps,
  motorVehicleProps,
  mvFeatureFlag,
  preHnry,
  eoyf,
  jurisdictionInformation,
  disableMvEoyf,
  isAdminReview,
}: ExpenseContextProviderProps) => {
  const [category, setCategory] = useState<CategoryType>({ mileageCategory: false });
  const [vehicle, setVehicle] = useState<VehicleType>();

  return (
    <ExpenseContext.Provider
      value={{
        category,
        setCategory,
        vehicle,
        setVehicle,
        fuelRatesProps,
        motorVehicleProps,
        mvFeatureFlag,
        preHnry,
        eoyf,
        jurisdictionInformation,
        disableMvEoyf,
        isAdminReview,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export default ExpenseContextProvider;
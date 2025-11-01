/* eslint-disable filenames/match-regex */
import { useEffect, useState } from "react";
import {debounce} from "lodash";
import { getGivenIncomeEstimates } from "@api/onboarding/confirmYourIncome.api";
import { getStartingEffectiveTaxRate, getStartingStudentLoanRate, getStartingLeviesRate } from "@api/starting_rates_calculator.api";


export interface incomeEstimates {
    salaryIncome: number;
    otherIncome: number,
    selfEmployedIncome: number
}

export const useConfirmYourIncome = () =>
{
  const [defaults, setDefaults] = useState<incomeEstimates>(null);
  const [estimatedStartingRate, setEstimatedStartingRate] = useState(null);
  const [studentLoanRate, setStudentLoanRate] = useState(null);
  const [leviesRate, setLeviesRate] = useState(null);
  const [loadingDefaults, setLoadingDefaults] = useState(true);
  const [loadingStudentLoanRate, setLoadingStudentLoanRate] = useState(false)
  const [loadingEstimatedStartingRate, setLoadingEstimatedStartingRate] = useState(false)
  const [loadingLeviesRate, setLoadingLeviesRate] = useState(false)
  const [hasStudentLoan, setHasStudentLoan] = useState(false)
  /**
   * this should grab all the initial data from the get!
   */
  useEffect(() => {
    const getIncomeEstimateDefaultValues = async () => {
      try {
        const {data: {salary, self_employed, other, has_student_loan }} = await getGivenIncomeEstimates()
        setDefaults({salaryIncome: salary, selfEmployedIncome: self_employed, otherIncome: other, });
        setHasStudentLoan(has_student_loan)
      } catch (error) {
        toastr.error("Something went wrong, please try again");
      } finally {
        setLoadingDefaults(false);
      }
    };

    getIncomeEstimateDefaultValues();
  }, []);

  // this should calc tax
  const getEstimatedStartingRate = async (selfEmployedIncome,  salaryIncome, otherIncome) => {
    try {
      setLoadingEstimatedStartingRate(true)
      const {status, data: {percentage}} = await getStartingEffectiveTaxRate(selfEmployedIncome, salaryIncome, otherIncome)
      if (status === "ok" &&percentage) {
        setEstimatedStartingRate(percentage);
      } else {
        // @TODO need to ensure that we align our basic response so this error message can be displayed effectively
        toastr.error("Something went wrong, please try again");
      }
    } catch (error) {
      toastr.error("Something went wrong, please try again");
      throw error
    } finally{
      setLoadingEstimatedStartingRate(false)
    }
  };

  // this should calc student loan
  const getStudentLoanRate = async ({selfEmployedIncome, salaryIncome, otherIncome}: incomeEstimates) => {
    try {
      setLoadingStudentLoanRate(true)
      const total = (Number(selfEmployedIncome) + Number(salaryIncome) + Number(otherIncome))
      const {status, data: {percentage}} = await getStartingStudentLoanRate(total)
      if (status === "ok") {
        setStudentLoanRate(percentage)
      } else {
        toastr.error("Something went wrong, please try again");
      }
    } catch (error) {
      toastr.error("Something went wrong, please try again");
      throw error
    } finally {
      setLoadingStudentLoanRate(false)
    }
  };

  const getLeviesRate = async ({selfEmployedIncome, salaryIncome, otherIncome}: incomeEstimates) => {
    try {
      setLoadingLeviesRate(true)
      const total = (Number(selfEmployedIncome) + Number(salaryIncome) + Number(otherIncome))
      const {status, data: {percentage}} = await getStartingLeviesRate(total)
      if (status === "ok") {
        setLeviesRate(percentage)
      } else {
        toastr.error("Something went wrong, please try again");
      }
    } catch (error) {
      toastr.error("Something went wrong, please try again");
      throw error
    } finally {
      setLoadingLeviesRate(false)
    }
  };

  const debouncedStartingTaxRate = debounce((selfEmployedIncome:number, salaryIncome: number, otherIncome: number) => {
    getEstimatedStartingRate(selfEmployedIncome, salaryIncome, otherIncome);
  }, 1000);

  const debouncedStudentLoanRate = debounce((total: incomeEstimates) => {
    getStudentLoanRate(total);
  }, 1000);

  const debouncedLeviesRate = debounce((total: incomeEstimates) => {
    getLeviesRate(total);
  }, 1000);

  return {defaults, estimatedStartingRate, studentLoanRate, leviesRate, loadingDefaults, debouncedStartingTaxRate, debouncedStudentLoanRate, debouncedLeviesRate, loadingStudentLoanRate, loadingEstimatedStartingRate, loadingLeviesRate, hasStudentLoan};
}

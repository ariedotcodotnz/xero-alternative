import { isPossiblePhoneNumber, isValidPhoneNumber} from "libphonenumber-js"

export default function usePhoneNumberValidator() {

  const isNumberPossible = (number: string) => isPossiblePhoneNumber(number)

  const isNumberValid = (number: string) => isValidPhoneNumber(number)  

  return { isNumberPossible, isNumberValid }
}
import { BasicResponse } from "../types/basicResponse"


const handleError = (resp: BasicResponse) => {
  if (Array.isArray(resp.error.error)) {
    resp.error.error.forEach(err => {
      toastr.error(err.error)
    })
  } else if (typeof resp.error.error === "string") {
    toastr.error(resp.error.error)
  }
}

const transformObjectToArrayForHashedError = (obj) => Object.entries(obj).map(([key, values]) => ({ errorName: key, errorMessage: values }));

export const handleHashedError = (resp: BasicResponse) => {
  const transformedRubyHash = transformObjectToArrayForHashedError(resp.error)
  if (transformedRubyHash) {
    const listOfErrorMessages = transformedRubyHash.map(e => e.errorMessage)
    const errors = JSON.stringify(["Sorry, something went wrong", ...listOfErrorMessages])
    toastr.error(`${errors}`)
  }

}

export default handleError
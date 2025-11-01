/* eslint-disable filenames/match-regex */
import { fetchPersonalDetails, PersonalDetailsType } from "@api/onboarding/personal_details.api";
import handleError from "@api/utils/handleError";
import { useEffect, useState } from "react"



export const usePersonalDetails = ({ userId }: { userId: number }) => {
  const [personalDetails, setPersonalDetails] = useState<PersonalDetailsType>()
  
  useEffect(() => {
    const getPersonalDetails = async () => {
      try {
        const res = await fetchPersonalDetails(userId)
        if (res?.status === "ok") {
          setPersonalDetails(res.data.personal_details)
        } else {
          handleError(res)
        }
      } catch (err) {
        toastr.error("Something went wrong, please try again");
        throw err
      }
    }

    getPersonalDetails();
  }, [userId]);

  
  return { personalDetails }
}

export default usePersonalDetails
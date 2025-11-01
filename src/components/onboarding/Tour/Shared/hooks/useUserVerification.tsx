/* eslint-disable filenames/match-regex */
import fetchUserVerificationDetails from "@api/onboarding/userVerification.api";
import handleError from "@api/utils/handleError";
import { UserVerificationPresenter } from "app/javascript/types/userVerification.type";
import { useEffect, useState } from "react"

export const useUserVerification = ({ userId }: { userId: number }) => {
  const [userVerification, setUserVerification] = useState<UserVerificationPresenter>()
  useEffect(() => {
    const getUserVerificationDetails = async () => {
      try {
        const res = await fetchUserVerificationDetails(userId)
        if (res?.status === "ok" && res?.data) {
          setUserVerification(res.data.user_verification)
        } else {
          handleError(res)
        }
      } catch (err) {
        toastr.error("Something went wrong, please try again");
        throw err
      }
    }

    getUserVerificationDetails();
  }, [userId]);

  return { userVerification }
}

export default useUserVerification
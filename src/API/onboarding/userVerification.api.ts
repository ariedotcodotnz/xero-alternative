import { ApiResponseBody, get } from "@api/config/fetch.api";
import { UserVerificationPresenter } from "app/javascript/types/userVerification.type";

export interface UserVerificationResponse extends ApiResponseBody {
  status: string;
  data: { user_verification: UserVerificationPresenter };
}

export const fetchUserVerificationDetails = async (
  userId: number,
): Promise<UserVerificationResponse> =>
  get(Routes.api_onboarding_user_verification_path(userId));

export default fetchUserVerificationDetails;

import { deleteReq } from "./config/fetch.api";

export interface ChallengeRequest {
  id: string;
}

export const cancelChallenge = async (params: ChallengeRequest) => deleteReq(Routes.api_challenge_path(params));

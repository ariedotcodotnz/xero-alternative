import { postJson } from "./config/fetch.api";

export interface iOffBoarding {
  userId: number;
  reason: string;
}

export const createOffBoarding = async ({ userId, reason }: iOffBoarding) => (
  postJson(Routes.off_boardings_path(), JSON.stringify({
    off_boarding: {
      reason,
      user_id: userId
    }
  }))
);
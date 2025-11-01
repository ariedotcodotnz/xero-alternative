import { postJson, deleteReq, get } from "./config/fetch.api";

export interface FeatureRequest {
  feature: string; // List available flags here from app/services/users/feature_self_service.rb instead of generic string type
}

export type VoidReason = "VOID_BLOCKED";

export const addFeature = async (body: FeatureRequest) => postJson(Routes.api_app_users_features_path(), JSON.stringify(body));

export const removeFeature = async (params: FeatureRequest) => deleteReq(Routes.api_app_users_feature_path(params.feature));

export const getAvailableFeatures = async () => get(Routes.api_users_features_path())

export const deleteUser = async(voidReason: VoidReason) => deleteReq(Routes.api_user_path(voidReason))


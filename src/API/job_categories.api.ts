import { postJson, get } from "./config/fetch.api";

export const getJobCategories = async () => {
  const url = Routes.expenses_job_categories_path();
  return get(url);
}

export const createJobCategory = async (body) => {
  const url = Routes.expenses_job_categories_path();
  return postJson(url, JSON.stringify(body), false)
}
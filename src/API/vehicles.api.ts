import { postJson, get, patchJson } from "./config/fetch.api";

export const getAllVehicles = async () => {
  const url = Routes.settings_vehicles_path();
  return get(url);
};

export const createVehicle = async (body) => {
  const url = Routes.settings_vehicles_path();
  return postJson(url, JSON.stringify(body), false)
}

export const getAllVehiclesExpense = async () => {
  const url = Routes.api_vehicles_path();
  return get(url);
};

export const createVehicleExpense = async (body) => {
  const url = Routes.api_vehicles_path();
  return postJson(url, JSON.stringify(body), false)
}

export const updateVehicle = async (body) => {
  const url = Routes.settings_vehicle_path(body.vehicle.id);
  return patchJson(url, JSON.stringify(body), false)
}
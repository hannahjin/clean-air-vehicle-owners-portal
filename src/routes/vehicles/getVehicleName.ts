import { Vehicle } from "api";

export function getVehicleName(vehicle: Pick<Vehicle, "make" | "model" | "year">) {
  return `${vehicle.make} ${vehicle.model} ${vehicle.year}`;
}

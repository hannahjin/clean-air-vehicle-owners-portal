import { VehicleInfo } from "./VehicleInfo";
import { VehiclesList } from "./VehiclesList";

export const vehiclesRoutes = [
  {
    path: "vehicles",
    element: <VehiclesList />,
  },
  {
    path: "vehicles/:vehicleId",
    element: <VehicleInfo />,
  },
];

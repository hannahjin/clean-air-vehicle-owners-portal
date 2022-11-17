import { Vehicle } from "./Vehicle";
import { VehiclesList } from "./VehiclesList";

export const vehiclesRoutes = [
  {
    path: "vehicles",
    element: <VehiclesList />,
  },
  {
    path: "vehicles/:id",
    element: <Vehicle />,
  },
];

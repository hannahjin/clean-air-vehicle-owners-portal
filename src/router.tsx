import { createBrowserRouter, Outlet } from "react-router-dom";

import { ErrorFallback } from "components/ErrorFallback";
import { VehiclesList } from "routes/vehicles/VehiclesList";

import { vehiclesRoutes } from "./routes/vehicles/routes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    errorElement: <ErrorFallback height="100vh" />,
    children: [
      {
        index: true,
        element: <VehiclesList />,
      },
      ...vehiclesRoutes,
    ],
  },
]);

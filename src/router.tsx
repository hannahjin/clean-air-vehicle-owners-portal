import { createBrowserRouter, Outlet } from "react-router-dom";

import { ErrorFallback } from "components/ErrorFallback";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    errorElement: <ErrorFallback height="100vh" />,
    children: [],
  },
]);

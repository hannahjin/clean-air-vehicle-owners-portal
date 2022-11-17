import { API_HOST, Vehicle, VEHICLES_ENDPOINT } from "api";

export const vehiclesListQuery = () => ({
  queryKey: ["vehicles"],
  queryFn: async (): Promise<Vehicle[]> => {
    const response = await fetch(`${API_HOST}${VEHICLES_ENDPOINT}`, {
      headers: new Headers({
        accept: "application/json",
      }),
    });
    if (!response.ok) {
      throw new Error();
    }
    return response.json();
  },
});

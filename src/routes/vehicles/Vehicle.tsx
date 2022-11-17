import { Heading } from "@chakra-ui/react";
import { Helmet } from "react-helmet";

const exchangesListQuery = (id: string) => ({
  queryKey: ["vehicles", id],
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

export function Vehicle() {
  return (
    <>
      <Helmet>
        <title>Vehicle name</title>
      </Helmet>
      <Heading as="h1">Vehicle name</Heading>
    </>
  );
}

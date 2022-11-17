import { Heading } from "@chakra-ui/react";
import { Helmet } from "react-helmet";

export function VehiclesList() {
  return (
    <>
      <Helmet>
        <title>Your Vehicles</title>
      </Helmet>
      <Heading as="h1">Your Vehicles</Heading>
    </>
  );
}

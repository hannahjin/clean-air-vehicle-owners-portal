import { Heading } from "@chakra-ui/react";
import { Helmet } from "react-helmet";

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

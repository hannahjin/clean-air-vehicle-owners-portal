import { memo } from "react";

import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Card,
  Heading,
  HStack,
  Skeleton,
  Stack,
  Text,
  usePrefersReducedMotion,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";

import { API_HOST, VEHICLES_ENDPOINT } from "api";
import { NetworkBoundary } from "components/NetworkBoundary";

interface Vehicle {
  id: string;
  year: string;
  make: string;
  model: string;
  series: string;
  style: string;
}

const cardHoverStyle = {
  transform: "scale(1.02)",
  transitionDuration: "200ms",
  transitionTimingFunction: "ease-in-out",
};

const vehiclesListQuery = () => ({
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

function VehiclesListContent() {
  const { data } = useQuery(vehiclesListQuery());

  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <>
      <Text fontSize="xl" paddingTop={3} paddingBottom={8} color="gray.500">
        Total vehicles{" "}
        <Text as="span" color="InfoText" paddingLeft={2}>
          {data?.length}
        </Text>
      </Text>
      <Stack spacing={4} paddingY={4}>
        {data?.map((vehicle) => (
          <Card
            key={vehicle.id}
            backgroundColor="Background"
            padding={4}
            as="a"
            href={`/vehicles/${vehicle.id}`}
            _hover={prefersReducedMotion ? undefined : cardHoverStyle}
          >
            <HStack justifyContent="space-between">
              <VStack alignItems="flex-start">
                <Text fontSize="lg" fontWeight="bold" whiteSpace="nowrap">
                  {vehicle.make} {vehicle.model} {vehicle.year}{" "}
                  <Text as="span" fontWeight="normal">
                    {vehicle.series}
                  </Text>
                </Text>
                <Text color="GrayText" fontSize="md">
                  {vehicle.style}
                </Text>
              </VStack>
              <ArrowForwardIcon boxSize={5} />
            </HStack>
          </Card>
        ))}
      </Stack>
    </>
  );
}

function Fallback() {
  return (
    <VStack>
      <Skeleton>
        <Text>Total vehicles 0</Text>
      </Skeleton>
    </VStack>
  );
}

export const VehiclesList = memo(function VehiclesList() {
  return (
    <>
      <Helmet>
        <title>Your Vehicles</title>
      </Helmet>
      <Heading as="h1">Your Vehicles</Heading>
      <NetworkBoundary fallback={<Fallback />}>
        <VehiclesListContent />
      </NetworkBoundary>
    </>
  );
});

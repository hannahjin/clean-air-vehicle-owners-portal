import { memo } from "react";

import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Card,
  Heading,
  HStack,
  Skeleton,
  Spinner,
  Stack,
  Text,
  usePrefersReducedMotion,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import * as reactRouterDom from "react-router-dom";

import { NetworkBoundary } from "components/NetworkBoundary";
import { useFallbackState } from "hooks/useFallbackState";

import { getVehicleName } from "./getVehicleName";
import { vehiclesListQuery } from "./query";

const cardHoverStyle = {
  transform: "scale(1.02)",
  transitionDuration: "200ms",
  transitionTimingFunction: "ease-in-out",
};

function VehiclesListContent() {
  const { isFetching, data, error } = useQuery({ ...vehiclesListQuery(), suspense: false });
  if (error) {
    throw error;
  }

  const prefersReducedMotion = usePrefersReducedMotion();
  const [shouldShowFetchingFallback] = useFallbackState(isFetching);

  return (
    <>
      <Text fontSize="xl" paddingTop={3} paddingBottom={8} color="gray.500">
        Total vehicles{" "}
        <Text as="span" color="InfoText" paddingLeft={2}>
          {shouldShowFetchingFallback ? <Spinner as="span" /> : data?.length}
        </Text>
      </Text>
      <Stack spacing={4} paddingY={4} width="100%">
        {shouldShowFetchingFallback && (
          <>
            <Skeleton height="93px" />
            <Skeleton height="93px" />
            <Skeleton height="93px" />
          </>
        )}
        {data?.map((vehicle) => (
          <Card
            key={vehicle.id}
            backgroundColor="Background"
            padding={4}
            as={reactRouterDom.Link}
            to={`/vehicles/${vehicle.id}`}
            _hover={prefersReducedMotion ? undefined : cardHoverStyle}
          >
            <HStack justifyContent="space-between">
              <VStack alignItems="flex-start">
                <Text fontSize="lg" fontWeight="bold" whiteSpace="nowrap">
                  {getVehicleName(vehicle)}{" "}
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

export const VehiclesList = memo(function VehiclesList() {
  return (
    <>
      <Helmet>
        <title>My Vehicles</title>
      </Helmet>
      <Heading as="h1">My Vehicles</Heading>
      <NetworkBoundary>
        <VehiclesListContent />
      </NetworkBoundary>
    </>
  );
});

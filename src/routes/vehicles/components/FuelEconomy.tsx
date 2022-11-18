import { memo } from "react";

import { Card, HStack, Skeleton, Stack, StackDivider, Text, VStack } from "@chakra-ui/react";

import { Vehicle } from "api";
import ecoIcon from "assets/eco-energy.png";
import { formatNumber } from "utils/formatNumber";

const LOCAL_CURRENCY = "USD";

const fuelEconomyLayout = {
  base: "column" as const,
  md: "row" as const,
};

const cardWidth = {
  base: "100%",
  md: "fit-content" as const,
};

interface FuelEconomyProps {
  vehicle?: Vehicle;
}

export const FuelEconomy = memo(function FuelEconomy({ vehicle }: FuelEconomyProps) {
  return (
    <Card
      backgroundColor="chakra-body-bg"
      width={cardWidth}
      paddingX={6}
      paddingBottom={6}
      borderRadius="lg"
    >
      <HStack
        backgroundColor="chakra-body-text"
        paddingY={3}
        paddingX={5}
        marginBottom={3}
        marginX={-6}
        borderTopRadius="lg"
      >
        <img src={ecoIcon} width="24px" alt="" role="presentation" />
        <Text fontWeight="semibold" color="Background" whiteSpace="nowrap">
          Fuel economy and environment
        </Text>
      </HStack>
      <Stack
        direction={fuelEconomyLayout}
        spacing={6}
        alignItems="center"
        divider={<StackDivider />}
      >
        <VStack alignItems="flex-end" whiteSpace="nowrap">
          <Text>
            Reduced CO<sub>2</sub> emission by
          </Text>
          <Skeleton isLoaded={Boolean(vehicle)}>
            <Text fontSize="4xl">
              {vehicle ? formatNumber(vehicle.emissionReduction) : "unknown"} lbs
            </Text>
          </Skeleton>
        </VStack>
        <VStack alignItems="flex-end" whiteSpace="nowrap">
          <Text>Annual Fuel Cost</Text>
          <Skeleton isLoaded={Boolean(vehicle)}>
            <Text fontSize="4xl">
              {vehicle
                ? formatNumber(vehicle.annualFuelCost, {
                    style: "currency",
                    currency: LOCAL_CURRENCY,
                  })
                : "unknown"}
            </Text>
          </Skeleton>
        </VStack>
        <VStack alignItems="flex-start" spacing="0">
          <Text>
            You{" "}
            <Text as="span" fontSize="3xl" fontWeight="semibold">
              saved
            </Text>
          </Text>
          <Skeleton isLoaded={Boolean(vehicle)}>
            <Text fontSize="5xl" fontWeight="bold" as="span">
              {vehicle
                ? formatNumber(vehicle.fuelSaving, { style: "currency", currency: LOCAL_CURRENCY })
                : "unknown"}
            </Text>
          </Skeleton>
          <Text>
            over{" "}
            <Skeleton as="span" isLoaded={Boolean(vehicle)}>
              <Text as="span" fontWeight="semibold">
                {vehicle ? formatNumber(vehicle.annualMileage) : "unknown"} mi
              </Text>
            </Skeleton>{" "}
            this year
          </Text>
        </VStack>
      </Stack>
    </Card>
  );
});

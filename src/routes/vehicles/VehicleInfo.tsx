import { memo } from "react";

import { ChevronDownIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Card,
  Heading,
  HStack,
  Menu,
  MenuButton,
  Spacer,
  Stack,
  StackDivider,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import capitalize from "capitalize";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import {
  ResponsiveContainer,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
} from "recharts";

import { API_HOST, Vehicle, VEHICLES_ENDPOINT } from "api";
import ecoIcon from "assets/eco-energy.png";
import { ErrorFallback } from "components/ErrorFallback";
import { NetworkBoundary } from "components/NetworkBoundary";
import { queryClient } from "queryClient";
import { formatNumber } from "utils/formatNumber";
import { sum } from "utils/sum";

import { VehicleMenu } from "./components/VehicleMenu";
import { getVehicleName } from "./getVehicleName";

const vehicleQuery = (id: string) => ({
  queryKey: ["vehicles", id],
  queryFn: async (): Promise<Vehicle> => {
    const data = queryClient.getQueryData<Vehicle[]>(["vehicles"]) ?? [];
    const vehicle: Vehicle | undefined = data.find((item) => item.id === id);
    if (vehicle) {
      return vehicle;
    }

    const response = await fetch(`${API_HOST}${VEHICLES_ENDPOINT}/${id}`, {
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

const yAxisPadding = {
  top: 48,
};

const LOCAL_CURRENCY = "USD";

interface VehicleContentProps {
  vehicleId: string;
}

function VehicleContent({ vehicleId }: VehicleContentProps) {
  const { data } = useQuery(vehicleQuery(vehicleId));

  if (!data) {
    queryClient.getLogger().error(`VehicleContent: Cannot find user vehicle with id ${vehicleId}`);
    throw new Error();
  }

  const vehicleName = getVehicleName(data);

  const mileage = Object.entries(data.mileage).map(([month, value]) => ({
    month: capitalize(month),
    value,
  }));

  const chartHeight = useBreakpointValue({
    base: 200,
    md: 350,
  });

  // TODO: use data from input
  const annualFuelCost = 1234;

  const cardWidth = useBreakpointValue({
    base: "100%",
    md: "fit-content",
  });

  const fuelEconomyLayout = useBreakpointValue({
    base: "column" as const,
    md: "row" as const,
  });

  return (
    <>
      <Helmet>
        <title>{vehicleName}</title>
      </Helmet>
      <Menu isLazy matchWidth>
        {({ isOpen }) => (
          // TODO (hannah): Improve edge cases and hide chevron if only one vehicle,
          // or show add a vehicle action.
          <>
            <MenuButton as="button" tabIndex={0} width="fit-content">
              <HStack as="span" spacing={1}>
                <VStack spacing={0}>
                  <Heading as="h1">{vehicleName}</Heading>
                </VStack>
                <ChevronDownIcon boxSize="40px" />
              </HStack>
            </MenuButton>
            {isOpen && <VehicleMenu />}
          </>
        )}
      </Menu>
      <Text fontSize="lg" color="GrayText" alignSelf="flex-start">
        {data.series} • {data.style}
      </Text>
      <Spacer height={8} />
      <Card
        backgroundColor="chakra-body-bg"
        width={cardWidth}
        paddingX={6}
        paddingBottom={8}
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
          <VStack alignItems="flex-start" spacing="0">
            <Text>
              You{" "}
              <Text as="span" fontSize="3xl" fontWeight="semibold">
                saved
              </Text>
            </Text>
            <Text fontSize="5xl" fontWeight="bold" as="span">
              {formatNumber(data.fuelSaving, { style: "currency", currency: LOCAL_CURRENCY })}
            </Text>
            <Text>over {formatNumber(sum(Object.values(data.mileage)))} mi this year</Text>
          </VStack>
          <VStack alignItems="flex-end" whiteSpace="nowrap">
            <Text>Annual Fuel Cost</Text>
            <Text fontSize="4xl">
              {formatNumber(annualFuelCost, { style: "currency", currency: LOCAL_CURRENCY })}
            </Text>
          </VStack>
          <VStack whiteSpace="nowrap">
            <Text>
              Reduced CO<sub>2</sub> emission by
            </Text>
            <Text fontSize="4xl">{formatNumber(data.emissionReduction)} lbs</Text>
          </VStack>
        </Stack>
      </Card>
      <Spacer height={8} />
      <Heading as="h2" fontSize="xl" role="">
        Mileage driven per month
      </Heading>
      <Spacer height={4} />
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart data={mileage}>
          <CartesianGrid strokeDasharray="4 3" />
          <XAxis dataKey="month" />
          <YAxis padding={yAxisPadding} unit=" mi" name="Miles driven" />
          <Tooltip />
          <Bar dataKey="value" fill="var(--chakra-colors-blue-300)">
            <LabelList dataKey="value" position="top" fontSize="var(--chakra-fontSizes-xs)" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}

export const VehicleInfo = memo(function VehicleInfo() {
  const { vehicleId } = useParams();

  if (!vehicleId) {
    return <ErrorFallback />;
  }

  return (
    <NetworkBoundary>
      <Helmet>
        <title>Vehicle</title>
      </Helmet>
      <Link to="/vehicles">
        <HStack as="span" spacing={1}>
          <ChevronLeftIcon />
          <Text as="span">Back to My Vehicles</Text>
        </HStack>
      </Link>
      <Spacer height={6} />
      <VehicleContent vehicleId={vehicleId} />
    </NetworkBoundary>
  );
});

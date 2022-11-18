import { memo } from "react";

import { ChevronDownIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Button,
  Heading,
  HStack,
  Menu,
  MenuButton,
  Skeleton,
  Spacer,
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
import { ErrorFallback } from "components/ErrorFallback";
import { NetworkBoundary } from "components/NetworkBoundary";
import { queryClient } from "queryClient";

import { FuelEconomy } from "./components/FuelEconomy";
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

  return (
    <>
      <Helmet>
        <title>{vehicleName}</title>
      </Helmet>
      <Menu isLazy matchWidth>
        {({ isOpen }) => (
          <>
            <MenuButton as={Button} tabIndex={0} width="fit-content" variant="ghost" padding={0}>
              <HStack as="span">
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
      <Spacer paddingBottom={4} />
      <FuelEconomy vehicle={data} />
      <Spacer paddingBottom={4} />
      <Heading as="h2" fontSize="xl" role="">
        Mileage driven per month
      </Heading>
      <Spacer paddingBottom={2} />
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

function Fallback() {
  return (
    <>
      <Skeleton>
        <HStack as="span" spacing={1}>
          <VStack spacing={0}>
            <Heading as="h1">Vehicle Name</Heading>
          </VStack>
        </HStack>
      </Skeleton>
      <Skeleton>
        <Text fontSize="lg" alignSelf="flex-start">
          Series and style
        </Text>
      </Skeleton>
      <Spacer paddingBottom={4} flex={0} />
      <FuelEconomy />
    </>
  );
}

const backButtonHover = {
  transform: "translateX(-2px)",
  transition: "transform 200ms ease-in-out",
};

export const VehicleInfo = memo(function VehicleInfo() {
  const { vehicleId } = useParams();

  if (!vehicleId) {
    return <ErrorFallback />;
  }

  return (
    <>
      <Helmet>
        <title>Vehicle</title>
      </Helmet>
      <Link to="/vehicles">
        <HStack as="span" spacing={1} paddingBottom={1} _hover={backButtonHover}>
          <ChevronLeftIcon />
          <Text as="span">Back to My Vehicles</Text>
        </HStack>
      </Link>
      <NetworkBoundary fallback={<Fallback />}>
        <VehicleContent vehicleId={vehicleId} />
      </NetworkBoundary>
    </>
  );
});

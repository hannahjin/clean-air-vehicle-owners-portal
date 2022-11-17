import { memo } from "react";

import { ChevronDownIcon } from "@chakra-ui/icons";
import { Heading, HStack, Menu, MenuButton } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

import { API_HOST, Vehicle, VEHICLES_ENDPOINT } from "api";
import { ErrorFallback } from "components/ErrorFallback";
import { NetworkBoundary } from "components/NetworkBoundary";
import { queryClient } from "queryClient";

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
                <Heading as="h1">{vehicleName}</Heading>
                <ChevronDownIcon boxSize="40px" />
              </HStack>
            </MenuButton>
            {isOpen && <VehicleMenu />}
          </>
        )}
      </Menu>
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
      <VehicleContent vehicleId={vehicleId} />
    </NetworkBoundary>
  );
});

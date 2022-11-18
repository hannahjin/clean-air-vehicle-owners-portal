import { useMemo } from "react";

import { AddIcon } from "@chakra-ui/icons";
import { HStack, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import { NetworkBoundary } from "components/NetworkBoundary";

import { getVehicleName } from "../getVehicleName";
import { vehiclesListQuery } from "../query";

interface VehicleMenuContentProps {
  currentVehicleId?: string;
}

function VehicleMenuContent({ currentVehicleId }: VehicleMenuContentProps) {
  const { data } = useQuery(vehiclesListQuery());
  const vehicles = useMemo(
    () => data?.filter((item) => item.id !== currentVehicleId),
    [data, currentVehicleId]
  );

  const navigate = useNavigate();

  if (!vehicles) {
    return <Text paddingX={2}>Sorry, we are not able to find your vehicles right now.</Text>;
  }

  if (vehicles.length === 0) {
    // TODO (hananh): support add a vehicle action.
    return (
      <MenuItem as={HStack} paddingX={2} spacing={2}>
        <AddIcon />
        <Text>Add a vehicle</Text>
      </MenuItem>
    );
  }

  return (
    <>
      {vehicles.map((vehicle) => {
        return (
          <MenuItem
            key={vehicle.id}
            cursor="pointer"
            onClick={() => {
              navigate(`/vehicles/${vehicle.id}`);
            }}
            flexDirection="column"
            alignItems="flex-start"
          >
            <Text fontSize="xl">{getVehicleName(vehicle)}</Text>
            <Text fontSize="sm" color="GrayText">
              {vehicle.series}
            </Text>
          </MenuItem>
        );
      })}
    </>
  );
}

export function VehicleMenu() {
  const { vehicleId } = useParams();

  return (
    <MenuList padding={0}>
      <NetworkBoundary>
        <VehicleMenuContent currentVehicleId={vehicleId} />
      </NetworkBoundary>
    </MenuList>
  );
}

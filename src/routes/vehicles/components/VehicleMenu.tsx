import { useMemo } from "react";

import { MenuItem, MenuList, Text } from "@chakra-ui/react";
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
    return null;
  }

  return (
    <MenuList>
      {vehicles.map((vehicle) => {
        return (
          <MenuItem
            key={vehicle.id}
            cursor="pointer"
            onClick={() => {
              navigate(`/vehicles/${vehicle.id}`);
            }}
          >
            <Text fontSize="xl">{getVehicleName(vehicle)}</Text>
          </MenuItem>
        );
      })}
    </MenuList>
  );
}

export function VehicleMenu() {
  const { vehicleId } = useParams();

  return (
    <NetworkBoundary>
      <VehicleMenuContent currentVehicleId={vehicleId} />
    </NetworkBoundary>
  );
}

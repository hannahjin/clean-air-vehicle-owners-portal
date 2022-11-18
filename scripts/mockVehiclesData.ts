import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

const PROJECT_ROOT = path.resolve(__dirname, "../");
const VEHICLE_INPUT = path.resolve(PROJECT_ROOT, "data/trips.json");
const MANUFACTURER_INPUT = path.resolve(PROJECT_ROOT, "data/inputs.json");
const API_OUTPUT = path.resolve(PROJECT_ROOT, "data/api.json");

// | lbs CO2/kWh | $/kWh | lbs CO2/gal gas | $/gal gas |
// | ----------- | ----- | --------------- | --------- |
// | 0.90        | 0.14  | 19.59           | 3.60      |

const CARBON_DIOXIDE_EMISSION_EV = 0.9;
const CARBON_DIOXIDE_EMISSION_GAS = 19.59;
const ELECTRICITY_UNIT_COST = 0.14;
const GAS_UNIT_COST = 3.6;
const ESTIMATED_AVG_MPG = 23;
// Applicable to PHEV
const ESTIMATED_GAS_DRIVING_PERCENTAGE = 0.92;

function main() {
  const drivingInputString = fs.readFileSync(VEHICLE_INPUT, "utf-8");
  const manufacturerString = fs.readFileSync(MANUFACTURER_INPUT, "utf-8");
  try {
    const data = JSON.parse(drivingInputString);
    const manufacturerData = JSON.parse(manufacturerString);
    const normalizedData = normalizeVehiclesData(data, manufacturerData);
    fs.writeFileSync(
      API_OUTPUT,
      JSON.stringify({
        vehicles: normalizedData,
      })
    );
  } catch (error) {
    console.error("Cannot mock api data", error);
    return;
  }

  console.log("Successfully created", API_OUTPUT);
}

main();

function normalizeVehiclesData(
  data: Record<string, string>[],
  manufacturerData: Record<string, string>[]
) {
  return data.map((item) => {
    const mileage = {
      jan: Number(item.Jan),
      feb: Number(item.Feb),
      mar: Number(item.Mar),
      apr: Number(item.Apr),
      may: Number(item.May),
      jun: Number(item.Jun),
      jul: Number(item.Jul),
      aug: Number(item.Aug),
      sep: Number(item.Sep),
      oct: Number(item.Oct),
      nov: Number(item.Nov),
      dec: Number(item.Dec),
    };
    const vehicle = {
      id: uuidv4(),
      year: item.Year,
      make: item.Make,
      model: item.Model,
      series: item.Series,
      style: item.Style,
      annualMileage: sum(Object.values(mileage)),
      mileage,
    };
    const manufacturerVehicle = manufacturerData.find(
      (car) =>
        car.Year === vehicle.year &&
        car.Make === vehicle.make &&
        car.Model === vehicle.model &&
        car.Series === vehicle.series &&
        car.Style === vehicle.style
    );

    return {
      ...vehicle,
      annualFuelCost: manufacturerVehicle && calculateAnnualFuelCost(vehicle, manufacturerVehicle),
      fuelSaving: manufacturerVehicle && calculateFuelCostSaving(vehicle, manufacturerVehicle),
      emissionReduction:
        manufacturerVehicle && calculateEmissionReduction(vehicle, manufacturerVehicle),
    };
  });
}

function estimateElectricityUsage(
  drivingData: Record<string, unknown>,
  manufacturerData: Record<string, string>,
  portion = 1
) {
  return (Number(drivingData.annualMileage) * portion) / Number(manufacturerData["Miles per kWh"]);
}

function estimateGasUsage(
  drivingData: Record<string, unknown>,
  manufacturerData: Record<string, string>,
  portion = 1
) {
  let mpg = Number(manufacturerData["Miles per gallon"]);
  if (Number.isNaN(mpg)) {
    mpg = ESTIMATED_AVG_MPG;
  }
  return (Number(drivingData.annualMileage) * portion) / mpg;
}

function calculateAnnualFuelCost(
  drivingData: Record<string, unknown>,
  manufacturerData: Record<string, string>
) {
  if (manufacturerData.Classification === "EV") {
    const eletricityOnlyEstimate = estimateElectricityUsage(drivingData, manufacturerData);
    return ELECTRICITY_UNIT_COST * eletricityOnlyEstimate;
  }

  if (manufacturerData.Classification === "PHEV") {
    const hybridElectricityEstimate = estimateElectricityUsage(
      drivingData,
      manufacturerData,
      1 - ESTIMATED_GAS_DRIVING_PERCENTAGE
    );
    const hybridGasEstimate = estimateGasUsage(
      drivingData,
      manufacturerData,
      ESTIMATED_GAS_DRIVING_PERCENTAGE
    );
    return ELECTRICITY_UNIT_COST * hybridElectricityEstimate + GAS_UNIT_COST * hybridGasEstimate;
  }
}

function calculateFuelCostSaving(
  drivingData: Record<string, unknown>,
  manufacturerData: Record<string, string>
) {
  if (manufacturerData.Classification === "EV") {
    const eletricityOnlyEstimate = estimateElectricityUsage(drivingData, manufacturerData);
    const gasOnlyEstimate = estimateGasUsage(drivingData, manufacturerData);
    return GAS_UNIT_COST * gasOnlyEstimate - ELECTRICITY_UNIT_COST * eletricityOnlyEstimate;
  }

  if (manufacturerData.Classification === "PHEV") {
    const hybridElectricityEstimate = estimateElectricityUsage(
      drivingData,
      manufacturerData,
      1 - ESTIMATED_GAS_DRIVING_PERCENTAGE
    );
    const hybridGasEstimate = estimateGasUsage(
      drivingData,
      manufacturerData,
      ESTIMATED_GAS_DRIVING_PERCENTAGE
    );
    const gasOnlyEstimate = estimateGasUsage(drivingData, manufacturerData);
    return (
      GAS_UNIT_COST * gasOnlyEstimate -
      (ELECTRICITY_UNIT_COST * hybridElectricityEstimate + GAS_UNIT_COST * hybridGasEstimate)
    );
  }
}

function calculateEmissionReduction(
  drivingData: Record<string, unknown>,
  manufacturerData: Record<string, string>
) {
  if (manufacturerData.Classification === "EV") {
    const eletricityOnlyEstimate = estimateElectricityUsage(drivingData, manufacturerData);
    const gasOnlyEstimate = estimateGasUsage(drivingData, manufacturerData);
    return (
      CARBON_DIOXIDE_EMISSION_GAS * gasOnlyEstimate -
      CARBON_DIOXIDE_EMISSION_EV * eletricityOnlyEstimate
    );
  }

  if (manufacturerData.Classification === "PHEV") {
    const hybridElectricityEstimate = estimateElectricityUsage(
      drivingData,
      manufacturerData,
      1 - ESTIMATED_GAS_DRIVING_PERCENTAGE
    );
    const hybridGasEstimate = estimateGasUsage(
      drivingData,
      manufacturerData,
      ESTIMATED_GAS_DRIVING_PERCENTAGE
    );
    const gasOnlyEstimate = estimateGasUsage(drivingData, manufacturerData);
    return (
      CARBON_DIOXIDE_EMISSION_GAS * gasOnlyEstimate -
      (CARBON_DIOXIDE_EMISSION_EV * hybridElectricityEstimate +
        CARBON_DIOXIDE_EMISSION_GAS * hybridGasEstimate)
    );
  }
}

function sum(values: number[]) {
  return values.reduce((sum, value) => {
    return sum + value;
  }, 0);
}

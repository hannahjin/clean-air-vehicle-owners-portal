import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

const PROJECT_ROOT = path.resolve(__dirname, "../");
const VEHICLE_INPUT = path.resolve(PROJECT_ROOT, "data/trips.json");
const API_OUTPUT = path.resolve(PROJECT_ROOT, "data/api.json");

function main() {
  const inputString = fs.readFileSync(VEHICLE_INPUT, "utf-8");

  try {
    const data = JSON.parse(inputString);
    const normalizedData = normalizeOwnersData(data);
    fs.writeFileSync(
      API_OUTPUT,
      JSON.stringify({
        vehicles: normalizedData,
      })
    );
  } catch (error) {
    console.error("Cannot mock api data");
    return;
  }

  console.log("Successfully created", API_OUTPUT);
}

main();

function normalizeOwnersData(data: Record<string, string>[]) {
  return data.map((item) => ({
    id: uuidv4(),
    year: item.Year,
    make: item.Make,
    model: item.Model,
    series: item.Series,
    style: item.Style,
    mileage: {
      jan: item.Jan,
      feb: item.Feb,
      mar: item.Mar,
      apr: item.Apr,
      may: item.May,
      jun: item.Jun,
      jul: item.Jul,
      aug: item.Aug,
      sep: item.Sep,
      oct: item.Oct,
      nov: item.Nov,
      dec: item.Dec,
    },
  }));
}

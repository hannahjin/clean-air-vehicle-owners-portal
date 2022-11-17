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
    },
  }));
}

export const API_HOST = "http://localhost:4000";
export const VEHICLES_ENDPOINT = "/vehicles";

export interface Vehicle {
  id: string;
  year: string;
  make: string;
  model: string;
  series: string;
  style: string;
  mileage: {
    jan: string;
    feb: string;
    mar: string;
    apr: string;
    may: string;
    jun: string;
    jul: string;
    aug: string;
    sep: string;
    oct: string;
    nov: string;
    dec: string;
  };
}

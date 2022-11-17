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
    jan: number;
    feb: number;
    mar: number;
    apr: number;
    may: number;
    jun: number;
    jul: number;
    aug: number;
    sep: number;
    oct: number;
    nov: number;
    dec: number;
  };
}

import { formatNumber } from "./formatNumber";

describe("formatNumber", () => {
  it("format numbers correctly", () => {
    expect(formatNumber(1234)).toBe("1,234");
  });

  it("supports currency option", () => {
    expect(
      formatNumber(12345, {
        style: "currency",
        currency: "USD",
      })
    ).toBe("$12,345");
  });

  it("supports minimumFractionDigits option", () => {
    expect(
      formatNumber(1234, {
        minimumFractionDigits: 2,
      })
    ).toBe("1,234.00");
  });

  it("supports maximumFractionDigits option", () => {
    expect(
      formatNumber(1.234567891, {
        maximumFractionDigits: 8,
      })
    ).toBe("1.23456789");
  });

  it("supports locale based on window.navigator properly", () => {
    jest.spyOn(window.navigator, "language", "get").mockReturnValueOnce("fr-FR");
    expect(formatNumber(12345.9)).toBe("12 345,9");

    jest.spyOn(window.navigator, "language", "get").mockReturnValueOnce("es-CO");
    expect(formatNumber(12345.9)).toBe("12.345,9");
  });
});

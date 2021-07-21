import { formatCurrency } from "./CurrencyFormat"

it("should return correct format", () => {
    expect(formatCurrency(123, "$")).toEqual("$123");
})

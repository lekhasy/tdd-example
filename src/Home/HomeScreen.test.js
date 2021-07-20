import { render, screen } from "@testing-library/react";
import * as BalanceService from "../Services/BalanceService";
import { HomeScreen } from "./HomeScreen";


describe("Home", () => {

    it("Should show loading icon",  () => {
        render(<HomeScreen/>);

        expect(screen.getByTestId("loading-icon")).toBeVisible();
    });

    it("Should call to getUserBalance", () => {
        const spy = jest.spyOn(BalanceService, 'getBalance');

        const getBalanceFn = jest.fn(async () => {
            return 123456;
        });

        BalanceService.getBalance.mockImplementation(getBalanceFn);

        render(<HomeScreen/>);

        expect(getBalanceFn).toBeCalled();

        spy.mockRestore();
    });
});
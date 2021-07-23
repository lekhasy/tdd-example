import { findByDisplayValue, findByText, render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as BalanceService from "../Services/BalanceService";
import * as UserService from "../Services/UserService";
import { formatCurrency } from "../Utils/CurrencyFormat";
import { HomeScreen } from "./HomeScreen";

function mockModuleMethod(module, methodName, impl) {
    const spy = jest.spyOn(module, methodName);
    const mockFn = jest.fn(impl);
    module[methodName].mockImplementation(mockFn);
    return {
        spy, mockFn
    }
}

function mockGetBalanceImplement(impl) {
    return mockModuleMethod(BalanceService, 'getBalance', impl);
}

function mockGetAvailableCurrencyCode(impl) {
    return mockModuleMethod(UserService, 'getAvailableCurrencyCode', impl);
}

describe("Home", () => {

    it("Should show loading icon and call to getUserBalance", async () => {

        const { spy, mockFn } = mockGetBalanceImplement(async () => {
            return 123456;
        });

        const { spy: spy1 } = mockGetAvailableCurrencyCode(async () => {
            return UserService.mock.getAvailableCurrencyCode.success
        });

        render(<HomeScreen />);

        expect(screen.getByTestId("loading-icon")).toBeVisible();
        expect(mockFn).toBeCalled();
        // wait for data fetching to complete before move on to next test
        await waitForElementToBeRemoved(() => screen.getByTestId("loading-icon"));

        spy.mockRestore();
        spy1.mockRestore();
    });

    it("Should hide loading icon and show error screen if getBalance fail", async () => {
        const { spy } = mockGetBalanceImplement(async () => {
            throw new Error();
        });

        render(<HomeScreen />);

        await waitForElementToBeRemoved(() => screen.getByTestId("loading-icon"));

        await screen.findByText("Error occured");

        spy.mockRestore();
    });

    describe("getBalance success", () => {

        it("should call to getAvailableCurrencyCode", async () => {
            const { spy, mockFn } = mockGetAvailableCurrencyCode(() => {
                return UserService.mock.getAvailableCurrencyCode.success
            });

            const { spy: spy1 } = mockGetBalanceImplement(() => {
                return 123456;
            });

            render(<HomeScreen />);

            await waitForElementToBeRemoved(() => screen.getByTestId("loading-icon"));
            expect(mockFn).toBeCalled();
            spy.mockRestore();
            spy1.mockRestore();
        });

        it("Should hide loading icon and show error screen if getAvailableCurrencyCode fail", async () => {
            const { spy } = mockGetBalanceImplement(async () => {
                return 1;
            });

            const { spy: spy1 } = mockGetAvailableCurrencyCode(() => {
                throw new Error();
            });

            render(<HomeScreen />);

            await waitForElementToBeRemoved(() => screen.getByTestId("loading-icon"));

            await screen.findByText("Error occured");

            spy.mockRestore();
            spy1.mockRestore();
        });

        it("should hide loading icon and show the amount in default currency code", async () => {

            const { spy } = mockGetAvailableCurrencyCode(() => {
                return UserService.mock.getAvailableCurrencyCode.success
            });

            const { spy: spy1 } = mockGetBalanceImplement(() => {
                return 123456;
            });

            render(<HomeScreen />);

            await waitForElementToBeRemoved(() => screen.getByTestId("loading-icon"));
            await screen.findByText(formatCurrency(123456, "$"));
            spy.mockRestore();
            spy1.mockRestore();
        });

        it("should show curency selector with default value selected", async () => {
            const { spy } = mockGetBalanceImplement(async () => {
                return 123456;
            });

            const { spy: spy1 } = mockGetAvailableCurrencyCode(() => {
                return UserService.mock.getAvailableCurrencyCode.success
            });

            render(<HomeScreen />);

            await waitForElementToBeRemoved(() => screen.getByTestId("loading-icon"));

            const dropdown = screen.getByText(UserService.mock.getAvailableCurrencyCode.success[0].displayName);

            spy.mockRestore();
            spy1.mockRestore();
        });

        it("should update display balance amount when user select another currency", async () => {
            const { spy } = mockGetBalanceImplement(async () => {
                return 123456;
            });

            const { spy: spy1 } = mockGetAvailableCurrencyCode(() => {
                return UserService.mock.getAvailableCurrencyCode.success
            });

            render(<HomeScreen />);

            const dropdown = await screen.findByText(UserService.mock.getAvailableCurrencyCode.success[0].displayName);

            userEvent.click(dropdown);

            const vietNamDongOption = screen.getByText(UserService.mock.getAvailableCurrencyCode.success[1].displayName);

            userEvent.click(vietNamDongOption);

            await screen.findByText(formatCurrency(123456, UserService.mock.getAvailableCurrencyCode.success[1].sign));

            spy.mockRestore();
            spy1.mockRestore();
        });

    });
});

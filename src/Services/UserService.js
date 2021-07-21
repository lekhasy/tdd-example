import { delayAsync } from "../Utils/DelayUtil"

export const getAvailableCurrencyCode = async () => {
    await delayAsync(2000);
    return mock.getAvailableCurrencyCode.success
}

export const mock = {
    getAvailableCurrencyCode: {
        success: [
            {
                displayName: "USD",
                sign: "$"
            },
            {
                displayName: "Viet Nam Dong",
                sign: "VNĐ"
            }
        ]
    }
}

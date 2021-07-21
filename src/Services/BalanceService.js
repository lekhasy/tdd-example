import { delayAsync } from "../Utils/DelayUtil";

export const getBalance = async () => {
    await delayAsync(2000);
    return 150000;
}

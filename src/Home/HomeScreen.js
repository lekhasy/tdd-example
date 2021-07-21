import React from 'react';
import { usePromiseResult } from 'use-promise-result';
import { getBalance } from '../Services/BalanceService';
import { getAvailableCurrencyCode } from '../Services/UserService';
import { formatCurrency } from '../Utils/CurrencyFormat';

export function HomeScreen() {
    const { success, error, data } = usePromiseResult(async () => {
        const balanceData = await getBalance();
        const currencyData = await getAvailableCurrencyCode();
        return {
            balanceData,
            currencyData
        }
    });

    const renderStatus = () => {
        return error ? <span>Error occured</span> : <span data-testid="loading-icon">Loading...</span>;
    }

    const renderData = () => {
        return <span>
            {formatCurrency(data.balanceData, data.currencyData[0].sign)}
        </span>
    }

    return <div>{success ? renderData() : renderStatus()}</div>;
}

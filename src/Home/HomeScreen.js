import { Select } from 'antd';
import React, { useState } from 'react';
import { usePromiseResult } from 'use-promise-result';
import { getBalance } from '../Services/BalanceService';
import { getAvailableCurrencyCode } from '../Services/UserService';
import { formatCurrency } from '../Utils/CurrencyFormat';

export function HomeScreen() {

    const [selectedCurrency, setSelectedCurrency] = useState();

    const { success, error, data } = usePromiseResult(async () => {
        const balanceData = await getBalance();
        const currencyData = await getAvailableCurrencyCode();
        return {
            balanceData,
            currencyData
        }
    });

    const handleCurrencyChange = (value) => {
        setSelectedCurrency(data.currencyData.find(i => i.sign === value));
    }

    const renderStatus = () => {
        return error ? <span>Error occured</span> : <span data-testid="loading-icon">Loading...</span>;
    }

    const renderData = () => {
        return <>
            <div>
                <Select value={(selectedCurrency || data.currencyData[0]).sign} style={{ width: 120 }} onChange={handleCurrencyChange}>
                    {data.currencyData.map(i => {
                        return <Select.Option key={i.sign} value={i.sign}>{i.displayName}</Select.Option>
                    })}
                </Select>
            </div>
            <div>
                {formatCurrency(data.balanceData, (selectedCurrency || data.currencyData[0]).sign)}
            </div>
        </>
    }

    return <div>{success ? renderData() : renderStatus()}</div>;
}

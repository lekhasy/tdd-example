import React from 'react';
import { usePromiseResult } from 'use-promise-result';
import { getBalance } from '../Services/BalanceService';

export function HomeScreen() {

    const { success, error } = usePromiseResult(getBalance);

    const renderStatus = () => {
        return error ? <span>Error</span> : <span data-testid="loading-icon">Loading...</span>;
    }

    const renderData = () => {
        return <span></span>
    }

    return <div>{success ? renderData() : renderStatus()}</div>;
}

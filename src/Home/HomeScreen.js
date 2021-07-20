import React from 'react';
import { usePromiseResult } from 'use-promise-result';
import { getBalance } from '../Services/BalanceService';

export function HomeScreen() {

    const { } = usePromiseResult(getBalance);

    return <div><span data-testid="loading-icon">Loading...</span></div>;
}

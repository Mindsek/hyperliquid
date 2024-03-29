"use client";
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
export const AddressContext = createContext<any>(null);
export const AddressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [addresses, setAddresses] = useState<string[]>([]);
    const [balances, setBalances] = useState<any>(null);
    const [error, setError] = useState<any>(null);
    const [volumeOverAll, setVolumeOverAll] = useState<any>(null);
    const value = {
        addresses,
        balances,
        error,
        volumeOverAll,
        setVolumeOverAll,
        setBalances,
        setError,
        setAddresses
    };

    return (
        <AddressContext.Provider value={value}>
            {children}
        </AddressContext.Provider>
    );
};

export const useAddress = () => {
    const context = useContext(AddressContext);
    if (!context) {
        throw new Error('useAddress must be used within a AddressProvider');
    }
    return context;
};
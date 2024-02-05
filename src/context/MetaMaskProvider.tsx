"use client";
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
export const AddressContext = createContext<any>(null);
export const AddressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [addresses, setAddresses] = useState<string[]>([]);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<any>(null);
    const value = {
        addresses,
        data,
        error,
        setData,
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
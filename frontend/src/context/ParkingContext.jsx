import { createContext, useContext, useState, useCallback } from 'react';

const ParkingContext = createContext(null);

export function ParkingProvider({ children }) {
    const [slots, setSlots] = useState([]);
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);

    const updateSlot = useCallback((updatedSlot) => {
        setSlots((prev) =>
            prev.map((slot) => (slot.id === updatedSlot.id ? { ...slot, ...updatedSlot } : slot))
        );
    }, []);

    const value = {
        slots,
        setSlots,
        zones,
        setZones,
        loading,
        setLoading,
        updateSlot,
    };

    return <ParkingContext.Provider value={value}>{children}</ParkingContext.Provider>;
}

export function useParking() {
    const context = useContext(ParkingContext);
    if (!context) {
        throw new Error('useParking must be used within a ParkingProvider');
    }
    return context;
}

export default ParkingContext;

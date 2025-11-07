import { useContext } from 'react';
import { GobelinsContext } from '../context/GobelinsContex';

export function useGobelins() {
    const context = useContext(GobelinsContext);
    if (!context) {
        throw new Error('useGobelins must be used within a GobelinsProvider');
    }
    return context;
}
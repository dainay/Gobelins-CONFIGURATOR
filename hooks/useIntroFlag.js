import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const INTRO_KEY = 'HAS_SEEN_INTRO';

export function useIntroFlag() {
    const [hasSeenIntro, setHasSeenIntro] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const value = await AsyncStorage.getItem(INTRO_KEY);
                setHasSeenIntro(value === 'true');
            } catch (error) {
                console.error('Error getting intro flag:', error);
                setHasSeenIntro(false);
            }
        })();
    }, []);

    const markIntroSeen = async () => {
        try {
            await AsyncStorage.setItem(INTRO_KEY, 'true');
            setHasSeenIntro(true);
            console.log('Intro seen marked');
        } catch (error) {
            console.error('Error marking intro seen:', error);
            setHasSeenIntro(true);
        }
    };

    const resetIntro = async () => {
        try {
            await AsyncStorage.removeItem(INTRO_KEY);
            setHasSeenIntro(false);
            console.log('Intro reset');
        } catch (error) {
            console.error('Error resetting intro:', error);
            setHasSeenIntro(false);
        }
    };

    return { hasSeenIntro, markIntroSeen, resetIntro };

}
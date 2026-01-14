import { useEffect } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export default function ProgressDiamonds({ currentStep, totalSteps, onDiamondPress }) {
    const steps = Array.from({ length: totalSteps }, (_, i) => i);
    const progressWidth = useSharedValue(0);

    // Animer la largeur de la ligne quand currentStep change
    useEffect(() => {
        const targetWidth = (currentStep / (totalSteps - 1)) * 100;
        progressWidth.value = withTiming(targetWidth, { duration: 300 });
    }, [currentStep, totalSteps]);

    const animatedProgressStyle = useAnimatedStyle(() => {
        return {
            width: `${progressWidth.value}%`,
        };
    });

    return (
        <View style={styles.container}>
            <View style={styles.lineContainer}>
                {/* Ligne de fond (gris) */}
                <View style={styles.backgroundLine} />
                
                {/* Ligne verte de progression */}
                <Animated.View 
                    style={[
                        styles.progressLine,
                        animatedProgressStyle
                    ]} 
                />
                
                {/* Losanges */}
                {steps.map((step) => {
                    const isCompleted = step < currentStep;
                    const isCurrent = step === currentStep;
                    const isInactive = step > currentStep;
                    
                    // Position du losange en pourcentage
                    const position = (step / (totalSteps - 1)) * 100;
                    
                    const DiamondWrapper = onDiamondPress ? TouchableOpacity : View;
                    
                    return (
                        <DiamondWrapper
                            key={step}
                            onPress={onDiamondPress ? () => onDiamondPress(step) : undefined}
                            activeOpacity={onDiamondPress ? 0.7 : 1}
                            style={[
                                styles.diamondContainer,
                                { left: `${position}%` }
                            ]}
                        >
                            <Image 
                                source={
                                    isInactive 
                                        ? require('../../assets/ui/progress-bar/crystal-off.png')
                                        : require('../../assets/ui/progress-bar/crystal-on.png')
                                }
                                style={[
                                    styles.diamond,
                                    isCurrent && styles.diamondCurrent
                                ]}
                                resizeMode="contain"
                            />
                            
                        </DiamondWrapper>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        //borderWidth: 1,
        //borderColor: "red",
    },
    lineContainer: {
        width: "100%",
        height: 40,
        position: "relative",
        justifyContent: "center",
    },
    backgroundLine: {
        position: "absolute",
        left: 0,
        right: 0,
        height: 5,
        backgroundColor: "#333",
        top: "50%",
        marginTop: -2.5,
        borderWidth: 1,
        borderColor: "#1a1a1a",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
    },
    progressLine: {
        position: "absolute",
        left: 0,
        height: 5,
        backgroundColor: "#67f038",
        top: "50%",
        marginTop: -2.5,
        zIndex: 1,
        borderWidth: 1,
        borderColor: "#4fa028",
        shadowColor: "#67f038",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 3,
    },
    diamondContainer: {
        position: "absolute",
        width: 25,
        height: 25,
        top: "50%",
        marginTop: -12.5,
        marginLeft: -12.5,
        zIndex: 2,
        justifyContent: "center",
        alignItems: "center",
    },
    diamond: {
        width: 25,
        height: 25,
    },
});

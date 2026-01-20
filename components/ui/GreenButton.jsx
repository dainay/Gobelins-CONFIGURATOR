import { ImageBackground, Pressable, StyleSheet, Text } from "react-native";
import { Colors } from "../../constants/Colors";

export default function GreenButton({ 
    title, 
    onPress, 
    width = "50%", 
    style, 
    textStyle 
}) {
    return (
        <Pressable onPress={onPress} style={[styles.button, { width }, style]}>
            <ImageBackground 
                source={require('../../assets/ui/buttons/green-button.webp')}
                style={styles.buttonImage}
                resizeMode="contain"
            >
                <Text style={[styles.buttonText, textStyle]}>
                    {title}
                </Text>
            </ImageBackground>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 80,
        marginBottom: 12,
        shadowColor: Colors.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonImage: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
        letterSpacing: 0.5,
        fontFamily: 'Merriweather',
        // textShadowColor: '#000',
        // textShadowOffset: { width: 1, height: 1 },
        // textShadowRadius: 2,
    },
});

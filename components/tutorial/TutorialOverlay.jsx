import { Pressable, StyleSheet, Text, View, useColorScheme } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Colors } from "../../constants/Colors";
import { useConfigurateurStore } from "../../src/store/configurateurStore";


const tutorialPages1 = [
    {title : "Bienvenue dans le configurateur", description : "Dans cet espace, tu peux configurer l’apparence de ton gobelin."},
    {title : "À toi de créer", description : "Parcours les différents onglets pour ajuster son style, ses traits et révéler sa personnalité.."},
]


export default function TutorialOverlay() {

    const showTutorial = useConfigurateurStore((state) => state.showTutorial);
    const tutorialStep = useConfigurateurStore((state) => state.tutorialStep);
    const nextTutorialStep = useConfigurateurStore((state) => state.nextTutorialStep);
    const finishTutorial = useConfigurateurStore((state) => state.finishTutorial);
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme] ?? Colors.light;

    if (!showTutorial) {
        return null;
    }

    const currentPage = tutorialPages1[tutorialStep];

    if (!currentPage) {
        finishTutorial();
        return null;
    }

    const isLastPage = tutorialStep >= tutorialPages1.length - 1;


    const handlePress = () => {
        if (isLastPage) {
            finishTutorial();
        } else {
            nextTutorialStep();
        }
    }

    // Calculer la largeur de la barre de progression
    const progressWidth = ((tutorialStep + 1) / tutorialPages1.length) * 100;

    return (
        <Pressable onPress={handlePress} style={styles.containerPressableTutorial}>
            <Animated.View 
                entering={FadeIn.duration(300)}
                exiting={FadeOut.duration(200)}
                style={[styles.containerPageTutorial, { backgroundColor: theme.uiBackground }]}
            >
                {/* Indicateur de progression */}
                <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { backgroundColor: theme.iconColor }]}>
                        <View 
                            style={[
                                styles.progressFill, 
                                { 
                                    width: `${progressWidth}%`,
                                    backgroundColor: Colors.primary 
                                }
                            ]} 
                        />
                    </View>
                    <Text style={[styles.progressText, { color: theme.text }]}>
                        {tutorialStep + 1} / {tutorialPages1.length}
                    </Text>
                </View>

                {/* Contenu principal */}
                <View style={styles.contentContainer}>
                    <Text style={[styles.titlePageTutorial, { color: theme.title }]}>
                        {currentPage.title}
                    </Text>
                    <Text style={[styles.descriptionPageTutorial, { color: theme.text }]}>
                        {currentPage.description}
                    </Text>
                </View>

                {/* Bouton d'action */}
                <View style={styles.buttonContainer}>
                    <View style={[styles.button, { backgroundColor: Colors.primary }]}>
                        <Text style={styles.buttonText}>
                            {isLastPage ? "Commencer" : "Continuer"}
                        </Text>
                    </View>
                    <Text style={[styles.hintText, { color: theme.iconColor }]}>
                        Appuyez n'importe où pour continuer
                    </Text>
                </View>
            </Animated.View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    containerPressableTutorial: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    containerPageTutorial: {
        width: "100%",
        maxWidth: 400,
        // borderRadius: 20,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        paddingBlock: 50,
        height: "65%",
        justifyContent: "space-between",
    },
    progressContainer: {
        width: "100%",
        marginBottom: 32,
    },
    progressBar: {
        width: "100%",
        height: 4,
        borderRadius: 2,
        overflow: "hidden",
        marginBottom: 8,
    },
    progressFill: {
        height: "100%",
        borderRadius: 2,
    },
    progressText: {
        fontSize: 12,
        fontWeight: "600",
        textAlign: "right",
        letterSpacing: 0.5,
    },
    contentContainer: {
        marginBottom: 32,
    },
    titlePageTutorial: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 16,
        letterSpacing: 0.5,
    },
    descriptionPageTutorial: {
        fontSize: 16,
        textAlign: "center",
        lineHeight: 24,
        letterSpacing: 0.2,
    },
    buttonContainer: {
        alignItems: "center",
    },
    button: {
        width: "100%",
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
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
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
        letterSpacing: 0.5,
    },
    hintText: {
        fontSize: 12,
        textAlign: "center",
        fontStyle: "italic",
    },
})
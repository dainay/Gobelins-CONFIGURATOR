import { Pressable, StyleSheet, Text, View } from "react-native";
import { useConfigurateurStore } from "../../src/store/configurateurStore";


const tutorialPages1 = [
    {title : "Bienvenue dans le configurateur", description : "Dans cette section, vous pouvez configurer l'apparence de votre gobelin."},
    {title : "Configuration de l'apparence", description : "Vous pouvez configurer l'apparence de votre gobelin en utilisant les différents onglets."},
]


export default function TutorialOverlay() {

    const showTutorial = useConfigurateurStore((state) => state.showTutorial);
    const tutorialStep = useConfigurateurStore((state) => state.tutorialStep);
    const nextTutorialStep = useConfigurateurStore((state) => state.nextTutorialStep);
    const finishTutorial = useConfigurateurStore((state) => state.finishTutorial);

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


    return (
        <Pressable onPress={handlePress} style={styles.containerPressableTutorial}>
            <View style={styles.containerPageTutorial}>
                <Text style={styles.titlePageTutorial}>{currentPage.title}</Text>
                <Text style={styles.descriptionPageTutorial}>{currentPage.description}</Text>
                <Text style={styles.progress}>
                    {tutorialStep + 1} / {tutorialPages1.length}
                </Text>
                <Text style={styles.buttonNextPageTutorial}>Appuyez pour continuer</Text>
            </View>
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
    },
    containerPageTutorial: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    titlePageTutorial: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        color: "black",
    },
    descriptionPageTutorial: {
        fontSize: 16,
        color: "black",
        textAlign: "center",
        marginBottom: 20,
    },
    progress: {
        fontSize: 16,
        color: "black",
        textAlign: "center",
        marginBottom: 20,
    },
    buttonNextPageTutorial: {
        fontSize: 16,
        color: "black",
        textAlign: "center",
        marginBottom: 20,
    },
})
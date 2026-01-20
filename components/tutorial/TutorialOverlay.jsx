import { Image, ImageBackground, Pressable, StyleSheet, Text, View, useColorScheme } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Colors } from "../../constants/Colors";
import { useConfigurateurStore } from "../../src/store/configurateurStore";
import GreenButton from "../ui/GreenButton";
import ProgressDiamonds from "../ui/ProgressDiamonds";


const tutorialPages1 = [
    {title : "Bienvenue dans le configurateur", description : "Dans cet espace, tu peux configurer l'apparence de ton gobelin."},
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

    // Créer un composant ImageBackground animé
    const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);

    return (
        // Sur la dernière page: seul le bouton est cliquable (pas tout l'écran)
        isLastPage ? (
        <View style={styles.containerPressableTutorial}>
            <AnimatedImageBackground 
                source={require('../../assets/ui/tutorial/tutorial-background.png')}
                entering={FadeIn.duration(300)}
                exiting={FadeOut.duration(200)}
                style={styles.containerPageTutorial}
                resizeMode="stretch"
                imageStyle={styles.backgroundImage}
            >
                {/* Conteneur interne avec le padding pour le contenu */}
                <View style={styles.contentWrapper}>
                {/* Indicateur de progression */}
                <View style={styles.progressContainer}>
                    <ProgressDiamonds 
                        currentStep={tutorialStep} 
                        totalSteps={tutorialPages1.length} 
                    />
                </View>

                {/* Contenu principal */}
                <View style={styles.contentContainer}>
                    <Text style={styles.titlePageTutorial}>
                        {currentPage.title}
                    </Text>
                    <Image 
                        source={require('../../assets/ui/tutorial/bar-subtitle.png')}
                        style={styles.subtitleTutorialImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.descriptionPageTutorial}>
                        {currentPage.description}
                    </Text>
                </View>

                {/* Bouton d'action */}
                <View style={styles.buttonContainer}>
                    {isLastPage && (
                        <GreenButton title="Démarrer" onPress={finishTutorial} />
                    )}
                </View>
                </View>
            </AnimatedImageBackground>
        </View>
        ) : (
        <Pressable onPress={handlePress} style={styles.containerPressableTutorial}>
            <AnimatedImageBackground 
                source={require('../../assets/ui/tutorial/tutorial-background.png')}
                entering={FadeIn.duration(300)}
                exiting={FadeOut.duration(200)}
                style={styles.containerPageTutorial}
                resizeMode="stretch"
                imageStyle={styles.backgroundImage}
            >
                {/* Conteneur interne avec le padding pour le contenu */}
                <View style={styles.contentWrapper}>
                {/* Indicateur de progression */}
                <View style={styles.progressContainer}>
                    <ProgressDiamonds 
                        currentStep={tutorialStep} 
                        totalSteps={tutorialPages1.length} 
                    />
                </View>

                {/* Contenu principal */}
                <View style={styles.contentContainer}>
                    <Text style={styles.titlePageTutorial}>
                        {currentPage.title}
                    </Text>
                    <Image 
                        source={require('../../assets/ui/tutorial/bar-subtitle.png')}
                        style={styles.subtitleTutorialImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.descriptionPageTutorial}>
                        {currentPage.description}
                    </Text>
                </View>

                {/* Bouton d'action */}
                <View style={styles.buttonContainer}>
                    <Text style={styles.hintText}>
                        Appuyez n'importe où pour continuer
                    </Text>
                </View>
                </View>
            </AnimatedImageBackground>
        </Pressable>
        )
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
        width: "105%",
        maxWidth: 425,
        height: "65%",
        minHeight: 500, 
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        overflow: "hidden", // Pour que l'image ne dépasse pas
        //borderWidth: 3,
        //borderColor: "blue",
    },
    backgroundImage: {
        width: "100%",
        height: "100%",
    },
    contentWrapper: {
        flex: 1,
        padding: 24,
        paddingTop: 0,
        paddingBlock: 50,
        paddingBottom: 62,
        justifyContent: "space-between",
    },
    progressContainer: {
        width: "70%",
        paddingTop: 12,
        paddingInline: 48,
        marginHorizontal: "auto",
        height: 60,
        justifyContent: "center",
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
        color: Colors.brownText,
        fontFamily: 'Merriweather',
    },
    contentContainer: {
        marginBottom: 32,
        paddingInline: 36,
    },
    titlePageTutorial: {
        fontSize: 24,
        textAlign: "center",
        marginBottom: 16,
        letterSpacing: 0.5,
        color: Colors.brownText,
        fontFamily: 'Merriweather-Bold',
    },
    subtitleTutorialImage: {
        width: "100%",
        marginBottom: 16,
        alignSelf: "center",
    },
    descriptionPageTutorial: {
        fontSize: 16,
        textAlign: "center",
        lineHeight: 24,
        letterSpacing: 0.2,
        color: Colors.brownText,
        fontFamily: 'Merriweather',
    },
    buttonContainer: {
        alignItems: "center",
        //borderWidth: 1,
        //borderColor: "blue",
    },
    hintText: {
        fontSize: 12,
        textAlign: "center",
        fontStyle: "italic",
        color: Colors.brownText,
        fontFamily: 'Merriweather',
    },
})
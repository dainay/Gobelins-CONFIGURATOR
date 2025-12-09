import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { router } from "expo-router";

import ThemedView from "../../components/ui/ThemedView";
import ThemedText from "../../components/ui/ThemedText";
import ThemedButton from "../../components/ui/ThemedButton";

import { useTestStore } from "../../src/store/testStore";
import { readPhoneMetrics } from "../../src/utils/readPhoneMetrics";
import { calculateSensorGuild } from "../../src/utils/calculateSensorGuild";

function getWinnerGuild(scores) {
  if (!scores) return null;
  let best = null;
  let bestScore = -Infinity;

  for (const key in scores) {
    if (scores[key] > bestScore) {
      bestScore = scores[key];
      best = key;
    }
  }
  return best;
}

const GUILD_LABELS = {
  ardembouls: "Ardembouls",
  brumelins: "Brumelins",
  mecrocks: "Mécarocks",
  lumivel: "Lumivel",
};

const GUILD_DESCRIPTIONS = {
  ardembouls:
    "Les Ardembouls sont puissants, explosifs et guidés par une énergie intérieure brûlante.",
  brumelins:
    "Les Brumelins sont joueurs, imprévisibles et laissent la magie suivre leur humeur.",
  mecrocks:
    "Les Mécarocks sont stables, réfléchis et avancent avec une détermination tranquille.",
  lumivel:
    "Les Lumivel sont doux, calmes et maîtrisent l’art des mouvements fluides et subtils.",
};

export default function ShakeResultScreen() {
  const shakeGuild = useTestStore((s) => s.shakeGuild);

  const [finalScores, setFinalScores] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // если по какой-то причине сюда попали без шейк-теста
    if (!shakeGuild) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const metrics = await readPhoneMetrics();
        const sensorScores = calculateSensorGuild(metrics);

        const combined = {
          ardembouls:
            sensorScores.ardembouls === -1
              ? (shakeGuild.ardembouls || 0)
              : (shakeGuild.ardembouls || 0) + sensorScores.ardembouls,
          brumelins:
            sensorScores.brumelins === -1
              ? (shakeGuild.brumelins || 0)
              : (shakeGuild.brumelins || 0) + sensorScores.brumelins,
          mecrocks:
            sensorScores.mecrocks === -1
              ? (shakeGuild.mecrocks || 0)
              : (shakeGuild.mecrocks || 0) + sensorScores.mecrocks,
          lumivel:
            sensorScores.lumivel === -1
              ? (shakeGuild.lumivel || 0)
              : (shakeGuild.lumivel || 0) + sensorScores.lumivel,
        };

        setFinalScores(combined);
      } catch (e) {
        console.log("Sensor error:", e);   
        setFinalScores(shakeGuild);
      } finally {
        setLoading(false);
      }
    })();
  }, [shakeGuild]);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Lecture de ta magie de Gobelin…</ThemedText>
      </ThemedView>
    );
  }

  if (!finalScores) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Aucun résultat trouvé. Essaie de refaire le test.</ThemedText>
        <ThemedButton onPress={() => router.push("/shake-test")}>
          Revenir au test
        </ThemedButton>
      </ThemedView>
    );
  }

  const winner = getWinnerGuild(finalScores);
  const label = GUILD_LABELS[winner] || winner;
  const description = GUILD_DESCRIPTIONS[winner] || "";

  return (
    <ThemedView style={styles.container}>
      <ThemedText title style={styles.title}>
        Tu es…
      </ThemedText>

      <ThemedText title style={styles.guildName}>
        {label}
      </ThemedText>

      <ThemedText style={styles.desc}>
        {description}
      </ThemedText>

       
      <ThemedText style={styles.debug}>
        {JSON.stringify(finalScores, null, 2)}
      </ThemedText>

      <ThemedButton onPress={() => router.push("/(dashboard)/openWorld")}>
        Mon gobelin est prêt !
      </ThemedButton>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 22,
    marginBottom: 8,
    textAlign: "center",
  },
  guildName: {
    fontSize: 28,
    marginBottom: 16,
    textAlign: "center",
  },
  desc: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
  },
  debug: {
    fontSize: 12,
    marginTop: 16,
  },
});

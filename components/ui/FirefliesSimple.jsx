import { useEffect, useRef } from "react";
import { Animated, Dimensions, View } from "react-native";

function Spark({ left, top, size, duration, delay }) {
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, {
          toValue: 1,
          duration: duration * 0.4,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: duration * 0.6,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity, duration, delay]);

  // Glow cross-platform: un cercle plus grand derrière
  const glowSize = size * 4;
  const glowOffset = (glowSize - size) / 2;
  const glowOpacity = Animated.multiply(opacity, 0.55);

  return (
    <View style={{ position: "absolute", left, top }}>
      {/* halo (fake blur): plusieurs couches */}
      <Animated.View
        style={{
          position: "absolute",
          left: -(size * 6 - size) / 2,
          top: -(size * 6 - size) / 2,
          width: size * 6,
          height: size * 6,
          borderRadius: (size * 6) / 2,
          backgroundColor: "rgba(255,230,120,0.12)",
          opacity: Animated.multiply(opacity, 0.35),
        }}
      />
      <Animated.View
        style={{
          position: "absolute",
          left: -(size * 4.8 - size) / 2,
          top: -(size * 4.8 - size) / 2,
          width: size * 4.8,
          height: size * 4.8,
          borderRadius: (size * 4.8) / 2,
          backgroundColor: "rgba(255,230,120,0.18)",
          opacity: Animated.multiply(opacity, 0.45),
        }}
      />
      <Animated.View
        style={{
          position: "absolute",
          left: -glowOffset,
          top: -glowOffset,
          width: glowSize,
          height: glowSize,
          borderRadius: glowSize / 2,
          backgroundColor: "rgba(255,230,120,0.28)",
          opacity: glowOpacity,
        }}
      />
      {/* coeur */}
      <Animated.View
        style={{
          width: size,
          height: size,
          borderRadius: size,
          backgroundColor: "rgba(255,230,120,1)",
          opacity,
        }}
      />
    </View>
  );
}

export default function FirefliesSparkle({ count = 30 }) {
  const { width: W, height: H } = Dimensions.get("window");
  const rand = (min, max) => Math.random() * (max - min) + min;
  return (
    <View pointerEvents="none" style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Spark
          key={i}
          left={rand(10, W - 10)}
          top={rand(10, H - 10)}
          size={rand(3, 6)}
          duration={rand(1500, 3200)}
          delay={rand(0, 3000)}
        />
      ))}
    </View>
  );
}

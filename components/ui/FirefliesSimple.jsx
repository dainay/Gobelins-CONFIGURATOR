import { useEffect, useRef } from "react";
import { Animated, Dimensions, View, Platform } from "react-native";

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
  return (
    <Animated.View
      style={{
        position: "absolute",
        left,
        top,
        width: size,
        height: size,
        borderRadius: size,
        backgroundColor: "rgba(255,230,120,1)",
        opacity,
        // iOS shadow
        shadowColor: '#fffbe6',
        shadowOpacity: 0.9,
        shadowRadius: size * 2.2,
        shadowOffset: { width: 0, height: 0 },
      }}
    >
      {/* Android simple bloom effect */}
      {Platform.OS === 'android' && (
        <View
          style={{
            position: 'absolute',
            left: -size,
            top: -size,
            width: size * 3,
            height: size * 3,
            borderRadius: size * 1.5,
            backgroundColor: 'rgba(255,230,120,0.18)',
            opacity: 0.7,
          }}
        />
      )}
    </Animated.View>
  );
}

export default function FirefliesSparkle({ count = 6 }) {
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
          duration={rand(1800, 4200)}
          delay={rand(0, 3000)}
        />
      ))}
    </View>
  );
}

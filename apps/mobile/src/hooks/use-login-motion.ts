import { useEffect } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { motion } from "@/src/theme/motion";

export function useLoginMotion() {
  const heroOpacity = useSharedValue<number>(0);
  const appleTranslateY = useSharedValue<number>(motion.distance.buttonEnterY);
  const googleTranslateY = useSharedValue<number>(motion.distance.buttonEnterY);
  const appleOpacity = useSharedValue<number>(0);
  const googleOpacity = useSharedValue<number>(0);

  useEffect(() => {
    heroOpacity.value = withTiming(1, {
      duration: motion.duration.imageFadeIn,
      easing: motion.easing.standardOut,
    });

    appleTranslateY.value = withDelay(
      motion.delay.appleButton,
      withTiming(0, {
        duration: motion.duration.buttonEnter,
        easing: motion.easing.standardOut,
      }),
    );
    appleOpacity.value = withDelay(
      motion.delay.appleButton,
      withTiming(1, {
        duration: motion.duration.buttonEnter,
        easing: motion.easing.standardOut,
      }),
    );

    googleTranslateY.value = withDelay(
      motion.delay.googleButton,
      withTiming(0, {
        duration: motion.duration.buttonEnter,
        easing: motion.easing.standardOut,
      }),
    );
    googleOpacity.value = withDelay(
      motion.delay.googleButton,
      withTiming(1, {
        duration: motion.duration.buttonEnter,
        easing: motion.easing.standardOut,
      }),
    );
  }, [
    appleOpacity,
    appleTranslateY,
    googleOpacity,
    googleTranslateY,
    heroOpacity,
  ]);

  const heroAnimatedStyle = useAnimatedStyle(() => ({
    opacity: heroOpacity.value,
  }));

  const appleButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: appleOpacity.value,
    transform: [{ translateY: appleTranslateY.value }],
  }));

  const googleButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: googleOpacity.value,
    transform: [{ translateY: googleTranslateY.value }],
  }));

  return {
    heroAnimatedStyle,
    appleButtonAnimatedStyle,
    googleButtonAnimatedStyle,
  };
}

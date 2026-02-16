import { Easing } from "react-native-reanimated";

export const motion = {
  duration: {
    imageFadeIn: 760,
    buttonEnter: 620,
  },
  delay: {
    appleButton: 320,
    googleButton: 520,
  },
  distance: {
    buttonEnterY: 22,
  },
  easing: {
    standardOut: Easing.out(Easing.cubic),
  },
} as const;

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import {
  ONBOARDING_PROFILE_SETUP_ROUTE,
  ROOT_INITIAL_ROUTE,
  ROOT_STACK_OPTIONS,
} from "@/src/navigation/root-stack";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Keep route initialization explicit for predictable reload behavior.
  initialRouteName: ROOT_INITIAL_ROUTE,
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "NotoSerifKR-Regular": require("../assets/fonts/NotoSerifKR-Regular.ttf"),
    "NotoSerifKR-SemiBold": require("../assets/fonts/NotoSerifKR-SemiBold.ttf"),
    "NotoSerifKR-Bold": require("../assets/fonts/NotoSerifKR-Bold.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={ROOT_STACK_OPTIONS.index} />
        <Stack.Screen
          name={ONBOARDING_PROFILE_SETUP_ROUTE}
          options={ROOT_STACK_OPTIONS[ONBOARDING_PROFILE_SETUP_ROUTE]}
        />
      </Stack>
    </ThemeProvider>
  );
}

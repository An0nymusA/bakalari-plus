// import '@tamagui/core/reset.css'

import { useColorScheme, StatusBar } from "react-native";
import { TamaguiProvider, Theme, View, Text } from "tamagui";
import { useFonts } from "expo-font";
import { SafeAreaView } from "react-native-safe-area-context";

import config from "./tamagui.config";

import { Button } from "./src/components/form/Button";

export default function App() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });
  if (!loaded) {
    return null;
  }
  return (
    <TamaguiProvider config={config}>
      {/* <Theme name={colorScheme === 'dark' ? 'dark' : 'light'}> */}
      <Theme name="dark">
        <View flex={1}>
          <SafeAreaView edges={["top"]}>
            <StatusBar
              backgroundColor={"blue"}
              barStyle={`${colorScheme === "dark" ? "light" : "dark"}-content`}
            />
          </SafeAreaView>

          <View flex={1} bg="$red">
            <Text style={{ fontSize: 36 }}>Heading</Text>
            <Button>Test baka button</Button>
          </View>
        </View>
      </Theme>
    </TamaguiProvider>
  );
}

import { createAnimations } from "@tamagui/animations-react-native";
import { createMedia } from "@tamagui/react-native-media-driver";
import { shorthands } from "@tamagui/shorthands";
import { tokens } from "@tamagui/themes";
import { createTokens, createTamagui, createFont } from "tamagui";

import colors from "./src/constants/colors";

const animations = createAnimations({
  bouncy: {
    type: "spring",
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  lazy: {
    type: "spring",
    damping: 20,
    stiffness: 60,
  },
  quick: {
    type: "spring",
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
});

const montserratFont = createFont({
  family: "Montserrat, Helvetica, Arial, sans-serif",
  size: {
    true: 12,
    1: 12,
    2: 14,
    3: 18,
    4: 24,
  },
  weight: {
    normal: "400",
    medium: "500",
    bold: "700",
  },
  face: {
    400: { normal: "MontserratRegular" },
    500: { normal: "MontserratMedium" },
    700: { normal: "MontserratBold" },
  },
});

const config = createTamagui({
  animations,
  defaultTheme: "dark",
  shouldAddPrefersColorThemes: false,
  themeClassNameOnRoot: false,
  shorthands,
  fonts: {
    heading: montserratFont,
    body: montserratFont,
  },
  themes: {
    dark: colors,
    light: colors,
  },
  tokens: createTokens({
    ...tokens,
    color: colors,
    radius: {
      1: 8,
      2: 16,
    },
  }),
  media: createMedia({
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: "none" },
    pointerCoarse: { pointer: "coarse" },
  }),
  defaultProps: {
    color: "$grey0",
  },
});

export type AppConfig = typeof config;

declare module "tamagui" {
  // overrides TamaguiCustomConfig so your custom types
  // work everywhere you import `tamagui`
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;

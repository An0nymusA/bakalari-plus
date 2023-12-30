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
    damping: 22,
    mass: 1.1,
    stiffness: 250,
  },
});

const montserratFont = createFont({
  family: "Montserrat, Helvetica, Arial, sans-serif",
  size: {
    true: 12,
    "1": 12,
    "1.5": 14,
    "2": 16,
    "2.5": 18,
    "3": 20,
    "4": 24,
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
      "1": 4,
      "2": 8,
      "3": 12,
      "4": 16,
    },
    space: {
      true: 0,
      "1": 4,
      "1.5": 6,
      "2": 8,
      "2.5": 10,
      "3": 12,
      "3.5": 14,
      "4": 16,
      "4.5": 18,
      "5": 20,
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
    portait: { orientation: "portrait" },
    landscape: { orientation: "landscape" },
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

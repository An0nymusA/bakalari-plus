import { Easing } from "react-native";
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
  spring: {
    type: "spring",
    damping: 25,
    mass: 0.7,
    stiffness: 250,
  },
  linear: {
    type: "timing",
    duration: 300,
    easing: Easing.inOut(Easing.ease),
  },
  quick: {
    type: "timing",
    duration: 150,
    easing: Easing.inOut(Easing.ease),
  },
});

const baseFont = createFont({
  family: "sans-serif",
  size: {
    true: 12,
    "0.5": 10,
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
  // face: {
  //   400: { normal: "MontserratRegular" },
  //   500: { normal: "MontserratMedium" },
  //   700: { normal: "MontserratBold" },
  // },
});

const config = createTamagui({
  animations,
  defaultTheme: "dark",
  shouldAddPrefersColorThemes: false,
  themeClassNameOnRoot: false,
  shorthands,
  fonts: {
    heading: baseFont,
    body: baseFont,
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
      "0.5": 2,
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
    xsLandscape: { maxWidth: 660, orientation: "landscape" },
    xsPortrait: { maxWidth: 660, orientation: "portrait" },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtXsLandscape: { minWidth: 660 + 1, orientation: "landscape" },
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
});

export type AppConfig = typeof config;

declare module "tamagui" {
  // overrides TamaguiCustomConfig so your custom types
  // work everywhere you import `tamagui`
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;

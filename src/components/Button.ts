import {
  Text,
  Button as TamaguiButton,
  styled,
  withStaticProperties,
  createStyledContext,
  GetProps,
} from "tamagui";

export const ButtonContext = createStyledContext({
  buttonColor: "true",
});

export const ButtonFrame = styled(TamaguiButton, {
  name: "ButtonFrame",
  context: ButtonContext,
  borderRadius: 8,
  padding: 10,

  textAlign: "center",
  width: "auto",

  backgroundColor: "transparent",

  hoverStyle: { opacity: 0.7 },
  pressStyle: {
    opacity: 0.7,
  },

  variants: {
    buttonColor: {
      true: {
        backgroundColor: "$primary",
      },
      red: {
        backgroundColor: "$redTransparent",
      },
      white: {
        borderColor: "$grey0",
      },
    },
  },
});

const ButtonText = styled(Text, {
  name: "ButtonText",
  context: ButtonContext,
  fontSize: "$3",
  fontWeight: "$medium",

  variants: {
    buttonColor: {
      true: {
        color: "$grey0",
      },
      red: {
        color: "$red",
      },
      white: {
        color: "$grey0",
      },
    },
  },
});

export const Button = withStaticProperties(ButtonFrame, {
  Props: ButtonContext.Provider,
  Text: ButtonText,
});

import React, { ReactElement } from "react";
import {
  Stack,
  Input as TamaguiInput,
  createStyledContext,
  styled,
  withStaticProperties,
} from "tamagui";

export const InputContext = createStyledContext({
  inputError: "false",
  elementDisabled: "false",
});

const InputFrame = styled(Stack, {
  name: "InputFrame",
  context: InputContext,
  backgroundColor: "$transparent",
  flexDirection: "row",
  gap: 12,

  borderRadius: "$2",
  padding: 10,

  borderColor: "$grey80",
  borderWidth: 2,

  width: "100%",

  variants: {
    inputError: {
      true: {
        borderColor: "$redTransparent",
      },
    },
  },
});

const Input = styled(TamaguiInput, {
  name: "Input",
  context: InputContext,
  autoCapitalize: "none",
  unstyled: true,
  fontSize: "$1.5",
  fontWeight: "$normal",
  color: "$grey0",
  placeholderTextColor: "$grey050",
  width: "100%",
  flex: 1,
  variants: {
    elementDisabled: {
      true: {
        disabled: true,
        editable: false,
        selectable: false,
        opacity: 0.5,
      },
    },
  },
});

const InputIcon = (props: { children: React.ReactNode }): ReactElement => {
  return React.cloneElement(props.children as ReactElement, {
    width: 35,
    height: 35,
  });
};

export const LoginInput = withStaticProperties(InputFrame, {
  Props: InputContext.Provider,
  Icon: InputIcon,
  Input,
});

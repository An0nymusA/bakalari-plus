import React, { ReactElement } from "react";
import {
  Stack,
  Input as TamaguiInput,
  createStyledContext,
  styled,
  withStaticProperties,
} from "tamagui";

export const InputContext = createStyledContext({
  elementDisabled: "false",
});

const InputFrame = styled(Stack, {
  name: "InputFrame",
  context: InputContext,
  backgroundColor: "$transparent",
  flexDirection: "row",
  gap: 12,

  borderRadius: '$1',
  padding: 10,

  borderColor: "$grey80",
  borderWidth: 2,

  width: "100%",
});

const Input = styled(TamaguiInput, {
  name: "Input",
  context: InputContext,
  unstyled: true,
  fontSize: "$2",
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

import { Stack, styled, withStaticProperties } from "@tamagui/core";
import React, { ReactElement } from "react";
import { Input as TamaguiInput } from "tamagui";

const InputFrame = styled(Stack, {
  name: "InputFrame",
  backgroundColor: "$transparent",
  flexDirection: "row",
  gap: 12,

  borderRadius: 8,
  padding: 10,

  borderColor: "$grey80",
  borderWidth: 2,

  width: "100%",
});

const Input = styled(TamaguiInput, {
  name: "Input",
  unstyled: true,
  fontSize: "$2",
  fontWeight: "$normal",
  color: "$grey0",
  placeholderTextColor: "$grey050",
  width: "100%",
  flex: 1,
});

const InputIcon = (props: { children: React.ReactNode }): ReactElement => {
  return React.cloneElement(props.children as ReactElement, {
    width: 35,
    height: 35,
  });
};

export const LoginInput = withStaticProperties(InputFrame, {
  Icon: InputIcon,
  Input,
});

import React, { ReactElement } from "react";
import {
  XStack,
  Text,
  createStyledContext,
  styled,
  withStaticProperties,
} from "tamagui";

export const BaseToastContext = createStyledContext({
  elementDisabled: "false",
});

const BaseToastFrame = styled(XStack, {
  name: "ToastFrame",
  context: BaseToastContext,
  borderRadius: "$2",
  backgroundColor: "$grey100",
  padding: 15,
  paddingVertical: 10,
  space: 15,
  alignItems: "center",
  borderWidth: 1,
});

const BaseToastText = styled(Text, {
  name: "ToastText",
  context: BaseToastContext,
  fontSize: "$1",
  color: "$grey0",
  textAlign: "left",
  maxWidth: 180,
});

const BaseToastIcon = (props: { children: React.ReactNode }): ReactElement => {
  return React.cloneElement(props.children as ReactElement, {
    width: 30,
    height: 30,
  });
};

export const BaseToast = withStaticProperties(BaseToastFrame, {
  Props: BaseToastContext.Provider,
  Icon: BaseToastIcon,
  Text: BaseToastText,
});

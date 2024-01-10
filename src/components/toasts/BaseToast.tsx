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
  // borderBottomLeftRadius: "$2",
  // borderBottomRightRadius: "$2",
  borderRadius: "$2",
  backgroundColor: "$grey80",
  paddingHorizontal: 15,
  paddingVertical: 10,
  space: 10,
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  maxWidth: 350,
});

const BaseToastText = styled(Text, {
  name: "ToastText",
  context: BaseToastContext,
  fontSize: "$2",
  color: "$grey0",
  textAlign: "center",
  alignSelf: "center",
  paddingBottom: 2,
});

const BaseToastIcon = (props: { children: React.ReactNode }): ReactElement => {
  return React.cloneElement(props.children as ReactElement, {
    width: 25,
    height: 25,
  });
};

export const BaseToast = withStaticProperties(BaseToastFrame, {
  Props: BaseToastContext.Provider,
  Icon: BaseToastIcon,
  Text: BaseToastText,
});

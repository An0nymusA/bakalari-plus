import { Text } from "tamagui";
import { PageButtonProp } from "./PageMenu";

const PageMenuButton = ({ button }: { button: PageButtonProp }) => {

  return (
    <Text
      unstyled={true}
      flex={1}
      display="flex"
      textAlign="center"
      paddingVertical={"$3"}
      onPress={() => {
        button.onPress();
      }}
      pressStyle={{
        color: "$primaryLight",
      }}
      color={"$grey0"}
      fontSize={"$2.5"}
      {...(button.disabled && {
        disabled: true,
        editable: false,
        selectable: false,
        opacity: 0.5,
      })}
    >
      {button.text}
    </Text>
  );
};

export default PageMenuButton;

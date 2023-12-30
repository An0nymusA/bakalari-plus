import { useState } from "react";
import { Text } from "tamagui";
import { PageButtonProp } from "../general/PageMenu";

const PageMenuButton = ({ button }: { button: PageButtonProp }) => {
  const [text, setText] = useState(button.text);

  return (
    <Text
      unstyled={true}
      flex={1}
      display="flex"
      textAlign="center"
      paddingVertical={"$3"}
      onPress={() => {
        button.onPress(setText);
      }}
      pressStyle={{
        color: "$primaryLight",
      }}
      color={"$grey0"}
      fontSize={"$2.5"}
    >
      {text}
    </Text>
  );
};

export default PageMenuButton;

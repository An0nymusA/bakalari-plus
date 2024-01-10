import { Text, styled } from "tamagui";
import { PageButtonProp } from "./PageMenu";

const PageMenuButton = ({ button }: { button: PageButtonProp }) => {
  return (
    <ButtonText
      onPress={() => {
        button.onPress();
      }}
      disabled={button.disabled}
      highlighted={button.highlighted}
    >
      {button.text}
    </ButtonText>
  );
};

const ButtonText = styled(Text, {
  unstyled: true,
  flex: 1,
  display: "flex",
  paddingVertical: "$3",
  textAlign: "center",
  color: "$grey0",
  fontSize: "$2.5",
  pressStyle: {
    color: "$primaryLight",
  },
  variants: {
    disabled: {
      true: {
        disabled: true,
        editable: false,
        selectable: false,
        opacity: 0.5,
      },
    },
    highlighted: {
      true: {
        color: "$grey40",
      },
    },
  },
});

export default PageMenuButton;

import { Stack, styled } from "tamagui";

const PopupMenuButton = styled(Stack, {
  name: "PopupMenuButton",
  backgroundColor: "$transparent",
  borderRadius: "$2",
  padding: "$1",

  variants: {
    type: {
      normal: {
        backgroundColor: "$transparent",
      },
      red: {
        backgroundColor: "$redTransparent",
      },
    },
  },
});

export default PopupMenuButton;

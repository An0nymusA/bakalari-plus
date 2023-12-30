import { Fragment } from "react";
import { View } from "tamagui";
import PageMenuButton from "../menu/PageMenuButton";
import { useMedia } from "tamagui";

interface PageButtonProp {
  onPress: (setText: () => void) => void;
  text: string;
}
interface PageButtonProps {
  buttons: PageButtonProp[];
}

/**
 * Page specific menu
 */
const PageMenu = ({ buttons }: PageButtonProps) => {
  const maxIndex = buttons.length - 1;
  const media = useMedia();

  return (
    media.portait && (
      <View
        width="100%"
        backgroundColor="$transparent"
        borderTopWidth={1}
        borderTopColor="$grey60"
      >
        <View display="flex" flexDirection="row" alignItems="center">
          {buttons.map((button, index) => (
            <Fragment key={`${index}-wrapper`}>
              <PageMenuButton key={index} button={button} />
              <View
                key={`${index}-separator`}
                height={"60%"}
                borderColor={"$grey60"}
                borderRightWidth={maxIndex != 0 && index !== maxIndex ? 2 : 0}
              ></View>
            </Fragment>
          ))}
        </View>
      </View>
    )
  );
};

export default PageMenu;
export type { PageButtonProp };

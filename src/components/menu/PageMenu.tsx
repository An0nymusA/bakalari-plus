import { Fragment } from "react";
import { View, useMedia } from "tamagui";

import PageMenuButton from "@components/menu/PageMenuButton";

interface PageButtonProp {
  onPress: () => void;
  text: string;
  disabled?: boolean;
  highlighted?: boolean;
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
    (media.portait || media.gtSm) && (
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

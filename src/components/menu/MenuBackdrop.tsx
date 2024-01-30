import React, { useEffect } from "react";
import { View } from "tamagui";

import PopupMenu from "@components/menu/PopupMenu";
import useBakalariStore from "@hooks/useBakalariStore";

const Backdrop = () => {
  const { backdropVisible, setBackdropVisible } = useBakalariStore();

  useEffect(() => {
    return () => setBackdropVisible(false);
  }, []);

  return (
    <>
      {/* <AnimatePresence> */}
      {backdropVisible && (
        <>
          <View
            key={"backdrop"}
            position="absolute"
            left="0"
            top="0"
            width={"100%"}
            height={"100%"}
            onPress={() => setBackdropVisible(false)}
            backgroundColor={"#141518B3"}
            animation="linear"
            marginBottom="$3"
            enterStyle={{
              opacity: 0,
            }}
            exitStyle={{
              opacity: 0,
            }}
          />

          <View
            position="absolute"
            left="0"
            top="0"
            width={"100%"}
            height={"100%"}
            key={"popup-menu-wrap"}
            flex={1}
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
          >
            <PopupMenu key={"popup-menu"} />
          </View>
        </>
      )}
      {/* </ AnimatePresence> */}
    </>
  );
};

export default Backdrop;

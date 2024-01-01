import React, { useEffect, useState } from "react";
import { EventEmitter } from "events";
import { View, AnimatePresence } from "tamagui";

import PopupMenu from "./PopupMenu";

const backdropEventEmitter = new EventEmitter();

const setVisibility = (visible: boolean) => {
  backdropEventEmitter.emit("visibilityChange", { detail: visible });
};

const toggleVisibility = () => {
  backdropEventEmitter.emit("visibilityToggle");
};

const Backdrop = () => {
  const [visibility, setVisibilityState] = useState(false);

  useEffect(() => {
    const visibilityChangeHandler = (event: any) => {
      setVisibilityState(event.detail);
    };
    const visibilityToggleHandler = () => {
      setVisibilityState((prev) => !prev);
    };

    backdropEventEmitter.on("visibilityChange", visibilityChangeHandler);
    backdropEventEmitter.on("visibilityToggle", visibilityToggleHandler);

    return () => {
      backdropEventEmitter.removeListener(
        "visibilityChange",
        visibilityChangeHandler
      );
      backdropEventEmitter.removeListener(
        "visibilityToggle",
        visibilityToggleHandler
      );
    };
  }, []);

  return (
    <AnimatePresence>
      {visibility && (
        <>
          <View
            key={"backdrop"}
            position="absolute"
            left="0"
            top="0"
            width={"100%"}
            height={"100%"}
            onPress={() => setVisibility(false)}
            backgroundColor={"#141518B3"}
            animation="quick-bg"
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
    </AnimatePresence>
  );
};

export default Backdrop;
export { setVisibility, toggleVisibility };

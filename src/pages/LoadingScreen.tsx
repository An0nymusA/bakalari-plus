import { ActivityIndicator } from "react-native";
import { View } from "tamagui";

import { Logo } from "@assets/images";
import colors from "@constants/colors";
import useBakalariStore from "@hooks/useBakalariStore";

const LoadingScreen = () => {
  const { loaderVisible } = useBakalariStore();

  return (
    loaderVisible && (
      <View
        position="absolute"
        left="0"
        top="0"
        width="100%"
        height="100%"
        backgroundColor={
          loaderVisible === "transparent"
            ? "$backgroundTransparent"
            : "$background"
        }
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        gap={"$2"}
        flex={1}
      >
        {loaderVisible === true && <Logo width={100} height={100} />}
        <ActivityIndicator size={"large"} color={colors.primary} />
      </View>
    )
  );
};

export default LoadingScreen;

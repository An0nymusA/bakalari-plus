import { View } from "tamagui";
import { Logo } from "../assets/images";
import useBakalariStore from "../utils/useBakalariStore";
import { ActivityIndicator } from "react-native";
import colors from "../constants/colors";

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
        backgroundColor="$background"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        gap={"$2"}
        flex={1}
      >
        <Logo width={100} height={100} />
        <ActivityIndicator size={"large"} color={colors.primary} />
      </View>
    )
  );
};

export default LoadingScreen;

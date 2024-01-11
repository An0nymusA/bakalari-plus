import { View } from "tamagui";
import { Empty } from "@/src/assets/images";

const NoData = ({ showNoData }: { showNoData: boolean }) => {
  if (!showNoData) return;

  return (
    <View flex={1} justifyContent="center" alignItems="center">
      <Empty width={100} height={100} />
    </View>
  );
};

export default NoData;

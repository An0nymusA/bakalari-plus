import { usePathname, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator } from "react-native";
import { Button, View, useMedia } from "tamagui";

import queryClient from "@api/queryClient";
import { Menu, NoSignal, Refresh, User, UserActive } from "@assets/images";
import { PopupMenuButtons } from "@components/menu/PopupMenu";
import colors from "@constants/colors";
import { invalidateQueries } from "@hooks/useApi";
import useBakalariStore from "@hooks/useBakalariStore";

const StaticMenu = () => {
  const media = useMedia();
  const pathname = usePathname();
  const router = useRouter();
  const [dataLoading, setDataLoading] = useState(false);
  const {
    loaderVisible,
    onlineStatus,
    toggleBackdropVisible,
    setBackdropVisible,
  } = useBakalariStore();

  return (
    <View
      width="100%"
      backgroundColor="$grey100"
      paddingVertical="$2"
      paddingHorizontal="$4"
      borderTopWidth={1}
      borderTopColor="$grey60"
    >
      <View
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        {/* Settings Button */}
        <Button
          backgroundColor="transparent"
          onPress={() => {
            setBackdropVisible(false);

            router.push("/modules/user");
          }}
        >
          {pathname.includes("user") ? (
            <UserActive width={40} height={40} />
          ) : (
            <User width={40} height={40} />
          )}
        </Button>

        {media.sm ? (
          // Menu Button
          <Button
            backgroundColor="transparent"
            onPress={() => toggleBackdropVisible()}
          >
            <Menu width={45} height={45} />
          </Button>
        ) : (
          <View>
            <PopupMenuButtons />
          </View>
        )}

        {/* Sync Button / Indicator */}
        <Button
          backgroundColor="transparent"
          onPress={async () => {
            if (dataLoading || loaderVisible) return;

            setDataLoading(true);
            if (!onlineStatus) {
              await queryClient.invalidateQueries({ queryKey: ["auth"] });
            }

            if (!onlineStatus) {
              setDataLoading(false);
              return;
            }

            await invalidateQueries();
            setDataLoading(false);
          }}
        >
          <RefreshButtonIcon
            dataLoading={dataLoading}
            isOnline={onlineStatus === true}
            iconSize={35}
          />
        </Button>
      </View>
    </View>
  );
};

const RefreshButtonIcon = ({
  dataLoading,
  isOnline,
  iconSize,
}: {
  dataLoading: boolean;
  isOnline: boolean;
  iconSize: number;
}) => {
  if (dataLoading) {
    return <ActivityIndicator size={iconSize} color={colors.grey0} />;
  }

  if (isOnline) {
    return <Refresh width={iconSize} height={iconSize} />;
  } else {
    return <NoSignal width={iconSize} height={iconSize} />;
  }
};

export default StaticMenu;

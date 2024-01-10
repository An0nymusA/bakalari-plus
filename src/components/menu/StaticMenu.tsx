import { useState } from "react";
import { ActivityIndicator } from "react-native";
import { View, Button, useMedia } from "tamagui";
import { usePathname } from "expo-router";
import { onlineManager } from "@tanstack/react-query";

import {
  NoSignal,
  Refresh,
  Settings,
  SettingsActive,
} from "@src/assets/images";
import { Menu } from "@src/assets/images";
import colors from "@/src/constants/colors";
import queryClient from "@/src/api/queryClient";
import { toggleVisibility } from "./MenuBackdrop";
import useBakalariStore from "@utils/useBakalariStore";
import { invalidateQueries } from "@/src/hooks/useApi";
import { PopupMenuButtons } from "./PopupMenu";

const StaticMenu = () => {
  const media = useMedia();
  const pathname = usePathname();
  const [dataLoading, setDataLoading] = useState(false);
  const { loaderVisible } = useBakalariStore();
  const isOnline = onlineManager.isOnline();

  const iconSize = 35;

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
        <Button backgroundColor="transparent">
          {pathname.includes("settings") ? (
            <SettingsActive width={iconSize} height={iconSize} />
          ) : (
            <Settings width={iconSize} height={iconSize} />
          )}
        </Button>

        {media.xs ? (
          // Menu Button
          <Button
            backgroundColor="transparent"
            onPress={() => toggleVisibility()}
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
            if (!isOnline) {
              await queryClient.invalidateQueries({ queryKey: ["auth"] });
            }

            if (!isOnline) {
              setDataLoading(false);
              return;
            }

            await invalidateQueries();
            setDataLoading(false);
          }}
        >
          <RefreshButtonIcon
            dataLoading={dataLoading}
            isOnline={isOnline}
            iconSize={iconSize}
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

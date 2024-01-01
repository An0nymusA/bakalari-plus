import { useState } from "react";
import { ActivityIndicator } from "react-native";
import { View, Button, useMedia } from "tamagui";
import { usePathname } from "expo-router";
import colors from "@/src/constants/colors";

import {
  NoSignal,
  ProgressError,
  Refresh,
  Settings,
  SettingsActive,
} from "@src/assets/images";
import { Menu } from "@src/assets/images";

import queryClient from "@/src/api/queryClient";
import { toggleVisibility } from "./MenuBackdrop";
import { onlineManager } from "@tanstack/react-query";

const StaticMenu = () => {
  const media = useMedia();
  const pathname = usePathname();
  const [dataLoading, setDataLoading] = useState(false);
  const isOnline = onlineManager.isOnline();

  const iconSize = media.sm ? 35 : 40;

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

        {/* Menu Button */}
        <Button
          backgroundColor="transparent"
          onPress={() => toggleVisibility()}
        >
          <Menu
            width={45 + (media.sm ? 0 : 5)}
            height={45 + (media.sm ? 0 : 5)}
          />
        </Button>

        {/* Sync Button / Indicator */}
        <Button
          backgroundColor="transparent"
          onPress={async () => {
            if (dataLoading) return;

            setDataLoading(true);
            if (!isOnline) {
              await queryClient.invalidateQueries({ queryKey: ["auth"] });
            }
            await queryClient.invalidateQueries({ queryKey: ["module"] });
            setDataLoading(false);
          }}
        >
          {dataLoading ? (
            <ActivityIndicator size={"large"} color={colors.grey0} />
          ) : isOnline ? (
            <Refresh width={iconSize} height={iconSize} />
          ) : (
            <NoSignal width={iconSize} height={iconSize} />
          )}
        </Button>
      </View>
    </View>
  );
};

export default StaticMenu;

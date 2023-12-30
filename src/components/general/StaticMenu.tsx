import { View, Button } from "tamagui";
import { usePathname } from "expo-router";

import { Settings, SettingsActive } from "@/src/assets/images";
import { Menu } from "@/src/assets/images";
import {
  SyncButton,
  SyncError,
  SyncPending,
  SyncSuccess,
} from "@/src/assets/images";

import { toggleVisibility } from "./MenuBackdrop";

const StaticMenu = () => {
  const pathname = usePathname();

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
            <SettingsActive width={35} height={35} />
          ) : (
            <Settings width={35} height={35} />
          )}
        </Button>

        {/* Menu Button */}
        <Button
          backgroundColor="transparent"
          onPress={() => toggleVisibility()}
        >
          <Menu width={40} height={40} />
        </Button>

        {/* Sync Button / Indicator */}
        <Button backgroundColor="transparent">
          <SyncSuccess width={30} height={30} />
        </Button>
      </View>
    </View>
  );
};

export default StaticMenu;

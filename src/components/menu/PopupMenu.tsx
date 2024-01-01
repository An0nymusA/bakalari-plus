import { View, useMedia } from "tamagui";
import { usePathname, useRouter } from "expo-router";

import { useLogout } from "@hooks/useAuth";

import { Logout } from "@/src/assets/images";
import { Kommens, KommensActive } from "@/src/assets/images";
import { Marks, MarksActive } from "@/src/assets/images";
import { Timetable, TimetableActive } from "@/src/assets/images";
import { VerticalLine } from "../VerticalLine";
import PopupMenuButton from "./PopupMenuButton";
import { setVisibility } from "./MenuBackdrop";

const PopupMenu = () => {
  const pathname = usePathname();
  const router = useRouter();
  const media = useMedia();
  const logout = useLogout();

  const redirect = (module: string) => {
    if (!pathname.includes(module)) router.push(`/modules/${module}`);

    setVisibility(false);
  };

  const iconSize = media.sm ? 32 : 40;

  return (
    <View
      padding="$2.5"
      borderRadius="$4"
      backgroundColor="$grey100"
      display="flex"
      flexDirection="row"
      gap="$5"
      animation="quick"
      marginBottom="$3"
      enterStyle={{
        y: 100,
      }}
      exitStyle={{
        y: 100,
      }}
    >
      <PopupMenuButton type="red" onPress={() => logout()}>
        <Logout width={iconSize} height={iconSize} />
      </PopupMenuButton>
      <VerticalLine />

      {/* Marks Button */}
      <PopupMenuButton onPress={() => redirect("marks")}>
        {pathname.includes("marks") ? (
          <MarksActive width={iconSize} height={iconSize} />
        ) : (
          <Marks width={iconSize} height={iconSize} />
        )}
      </PopupMenuButton>

      {/* Timetable Button */}
      <PopupMenuButton onPress={() => redirect("timetable")}>
        {pathname.includes("timetable") ? (
          <TimetableActive width={iconSize} height={iconSize} />
        ) : (
          <Timetable width={iconSize} height={iconSize} />
        )}
      </PopupMenuButton>

      {/* Kommens Button */}
      <PopupMenuButton onPress={() => redirect("kommens")}>
        {pathname.includes("kommens") ? (
          <KommensActive width={iconSize} height={iconSize} />
        ) : (
          <Kommens width={iconSize} height={iconSize} />
        )}
      </PopupMenuButton>
    </View>
  );
};

export default PopupMenu;

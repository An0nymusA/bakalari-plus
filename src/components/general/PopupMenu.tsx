import { View } from "tamagui";
import PopupMenuButton from "../menu/PopupMenuButton";

import { usePathname, useRouter } from "expo-router";
import { setVisibility } from "./MenuBackdrop";
import useAuth from "@hooks/useAuth";

import { Logout } from "@/src/assets/images";
import { Kommens, KommensActive } from "@/src/assets/images";
import { Marks, MarksActive } from "@/src/assets/images";
import { Timetable, TimetableActive } from "@/src/assets/images";
import { VerticalLine } from "../VerticalLine";

const PopupMenu = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { logout } = useAuth();

  const redirect = (module: string) => {
    router.push(`/modules/${module}`);
    setVisibility(false);
  };

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
        <Logout width={32} height={32} />
      </PopupMenuButton>
      <VerticalLine />

      {/* Marks Button */}
      <PopupMenuButton onPress={() => redirect("marks")}>
        {pathname.includes("marks") ? (
          <MarksActive width={32} height={32} />
        ) : (
          <Marks width={32} height={32} />
        )}
      </PopupMenuButton>

      {/* Timetable Button */}
      <PopupMenuButton onPress={() => redirect("timetable")}>
        {pathname.includes("timetable") ? (
          <TimetableActive width={32} height={32} />
        ) : (
          <Timetable width={32} height={32} />
        )}
      </PopupMenuButton>

      {/* Kommens Button */}
      <PopupMenuButton onPress={() => redirect("kommens")}>
        {pathname.includes("kommens") ? (
          <KommensActive width={32} height={32} />
        ) : (
          <Kommens width={32} height={32} />
        )}
      </PopupMenuButton>
    </View>
  );
};

export default PopupMenu;

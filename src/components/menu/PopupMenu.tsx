import { View, Stack, styled, XStack } from "tamagui";
import { usePathname, useRouter } from "expo-router";

import { useLogout } from "@hooks/useAuth";

import { Absence, AbsenceActive, Logout } from "@/src/assets/images";
import { Komens, KomensActive } from "@/src/assets/images";
import { Marks, MarksActive } from "@/src/assets/images";
import { Timetable, TimetableActive } from "@/src/assets/images";
import { VerticalLine } from "../VerticalLine";
import useBakalariStore from "@/src/utils/useBakalariStore";

const PopupMenu = () => {
  return (
    <View
      padding="$2.5"
      borderRadius="$4"
      backgroundColor="$grey100"
      borderWidth={1}
      borderColor={"$transparent"}
      animation="spring"
      marginBottom="$3"
      enterStyle={{
        y: 100,
      }}
    >
      <PopupMenuButtons />
    </View>
  );
};

export const PopupMenuButtons = () => {
  const { setBackdropVisible } = useBakalariStore();

  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout();

  const redirect = (module: string) => {
    if (!pathname.includes(module)) router.push(`/modules/${module}`);

    setBackdropVisible(false);
  };
  const iconSize = 32;

  return (
    <XStack display="flex" gap="$5">
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

      {/* Komens Button */}
      <PopupMenuButton onPress={() => redirect("komens")}>
        {pathname.includes("komens") ? (
          <KomensActive width={iconSize} height={iconSize} />
        ) : (
          <Komens width={iconSize} height={iconSize} />
        )}
      </PopupMenuButton>

      {/* Absence Button */}
      <PopupMenuButton onPress={() => redirect("absence")}>
        {pathname.includes("absence") ? (
          <AbsenceActive width={iconSize} height={iconSize} />
        ) : (
          <Absence width={iconSize} height={iconSize} />
        )}
      </PopupMenuButton>
    </XStack>
  );
};

const PopupMenuButton = styled(Stack, {
  name: "PopupMenuButton",
  backgroundColor: "$transparent",
  borderRadius: "$2",
  padding: "$1",
  shadowRadius: "$2",

  variants: {
    type: {
      normal: {
        backgroundColor: "$transparent",
      },
      red: {
        backgroundColor: "$redTransparent",
      },
    },
  },
});

export default PopupMenu;

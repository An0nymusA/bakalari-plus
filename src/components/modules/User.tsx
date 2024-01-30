import { User as UserType } from "bakalari-ts-api";
import { Button, Text, YStack } from "tamagui";

import { Logout, User as UserImage } from "@assets/images";
import { useLogout } from "@hooks/useAuth";

const User = ({ data }: { data: UserType }) => {
  return (
    <YStack alignItems="center">
      <UserImage width={100} height={100} />
      <Text fontSize={"$4"} color={"$grey0"} fontWeight={500}>
        {data.FullUserName}
      </Text>
      <Text fontSize={"$2"} color={"$grey60"}>
        ( {data.Class.Abbrev} )
      </Text>
    </YStack>
  );
};

const LogoutButton = () => {
  const logout = useLogout();

  return (
    <Button
      unstyled={true}
      display="flex"
      flexDirection="row"
      alignItems="center"
      backgroundColor={"$redTransparent"}
      color={"$grey0"}
      borderRadius={"$3"}
      paddingVertical={"$1"}
      paddingLeft={"$1.5"}
      paddingRight={"$2.5"}
      marginTop={"$6"}
      onPress={() => logout()}
    >
      <Logout width={32} height={32} />
      <Text color={"$grey0"} fontSize={"$2"}>
        Odlásit se
      </Text>
    </Button>
  );
};

export default User;

import { View, Text, Button, XStack, YStack, styled } from "tamagui";
import { FormattedTimetableHour } from "bakalari-ts-api";

import { Calendar, Teacher, Change as ChangeIcon } from "@/src/assets/images";
import useTimetableModalStore from "@hooks/useTimetableModalStore";
import { formatDate } from "@utils/utils";
import { HorizontalLine } from "../HorizontalLine";

const TimetableModal = () => {
  const { current, clearCurrent } = useTimetableModalStore();

  if (current == null || current.Change == null) return null;

  return (
    <ModalWrapper onPress={() => clearCurrent()}>
      <Modal data={current} />
    </ModalWrapper>
  );
};

const Modal = ({ data }: { data: FormattedTimetableHour }) => {
  const { clearCurrent } = useTimetableModalStore();

  const Change = data.Change;

  if (!Change) return null;

  return (
    <YStack
      backgroundColor={"$grey100"}
      width="100%"
      maxWidth={500}
      borderWidth={1}
      borderColor={"$transparent"}
      borderRadius={"$3"}
      overflow="hidden"
      space={"$3"}
    >
      <YStack
        paddingHorizontal={"$2"}
        paddingVertical={"$3"}
        display="flex"
        alignItems="center"
        backgroundColor={"$transparent"}
      >
        <Text fontSize={"$3"} color={"$primaryLight"} textAlign="center">
          {data.SubjectFull ?? Change.Description}
        </Text>
        <Text fontSize={"$2"} color={"$grey40"}>
          {Change.Hours}
        </Text>
      </YStack>
      <YStack paddingHorizontal={"$2"} space={"$2.5"}>
        {data.TeacherFull && (
          <XStack paddingHorizontal={"$2"} space={"$2"} alignItems="center">
            <Teacher width={22} height={22} />
            <Text fontSize={"$2"} color={"$grey20"}>
              {data.TeacherFull}
            </Text>
          </XStack>
        )}
        {data.TeacherFull && (
          <HorizontalLine borderBottomColor={"$transparent"} />
        )}
        <XStack paddingHorizontal={"$2"} space={"$2"} alignItems="center">
          <Calendar width={22} height={22} />
          <Text fontSize={"$2"} color={"$grey20"}>
            {formatDate(Change.Day, "weekday-full-date")}
          </Text>
        </XStack>
        <HorizontalLine borderBottomColor={"$transparent"} />
        <XStack paddingHorizontal={"$2"} space={"$2"} alignItems="center">
          <ChangeIcon width={22} height={22} />
          <Text fontSize={"$2"} color={"$grey20"} flex={1}>
            {Change.Description}
          </Text>
        </XStack>
      </YStack>
      <Button
        unstyled={true}
        backgroundColor={"$redTransparent"}
        paddingVertical={"$1.5"}
        onPress={() => clearCurrent()}
        alignItems="center"
      >
        <Text fontSize={"$2"} color={"$red"}>
          Zavřít
        </Text>
      </Button>
    </YStack>
  );
};

const ModalWrapper = styled(View, {
  position: "absolute",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: "$2",
  backgroundColor: "#141518B3",
});

export default TimetableModal;

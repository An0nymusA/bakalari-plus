import { useState, useMemo, useEffect } from "react";
import {
  Adapt,
  Select,
  Sheet,
  Text,
  View,
  XStack,
  YStack,
  styled,
  Input,
} from "tamagui";
import { FormattedMarksBySubject } from "bakalari-ts-api";

import { HorizontalLine } from "../HorizontalLine";
import { getLastNumericKey } from "@utils/utils";
import {
  calculateAverage,
  getValidMarksNumber,
} from "@/src/moduleUtils/MarksUtils";
import { Check, Chevron, Weight } from "@/src/assets/images";
import useAddedMarks from "@hooks/useAddedMarks";

const MarkPredictor = ({ marks }: { marks: FormattedMarksBySubject }) => {
  const [value, setValue] = useState<string>("");
  const {
    addedMarks,
    removeMark,
    clearMarks,
    updateMark,
    checkIfLastAndAddNewItem,
  } = useAddedMarks();

  useEffect(() => {
    clearMarks();
  }, [value]);

  const subject = useMemo(() => {
    return marks[value] ?? null;
  }, [value]);
  const validMarksNumber = useMemo(
    () => getValidMarksNumber(addedMarks),
    [addedMarks]
  );

  return (
    <YStack marginBottom={"$4"}>
      <XStack
        backgroundColor="$grey100"
        alignItems="center"
        justifyContent="space-between"
        padding="$3"
        borderRadius={"$3"}
        borderBottomLeftRadius={value == "" ? "$3" : 0}
        borderBottomRightRadius={value == "" ? "$3" : 0}
      >
        <YStack flex={1}>
          <Text
            fontWeight={500}
            fontSize="$3"
            color={"$primaryLight"}
            textAlign="center"
          >
            Předvídač známek
          </Text>
          <HorizontalLine marginTop={"$2"} marginBottom={"$3"} />
          {useMemo(
            () => (
              <SubjectSelect marks={marks} value={value} setValue={setValue} />
            ),
            [marks, value]
          )}
          {subject && (
            <XStack gap="$3" alignItems="center">
              <View>
                <Text fontSize="$1.5" color="$grey60">
                  průměr:{" "}
                  <Text color="$grey40">
                    {calculateAverage(subject.Marks, addedMarks)}
                  </Text>
                </Text>
              </View>
              <View>
                <Text fontSize="$1.5" color="$grey60">
                  známky:{" "}
                  <Text color="$grey40">
                    {Object.keys(subject.Marks).length}
                  </Text>
                  {validMarksNumber > 0 && (
                    <Text color="$grey40"> + {validMarksNumber}</Text>
                  )}
                </Text>
              </View>
            </XStack>
          )}
        </YStack>
      </XStack>
      {subject && (
        <YStack
          paddingTop={"$2"}
          paddingBottom={"$2.5"}
          backgroundColor={"$transparent"}
          borderBottomLeftRadius={"$3"}
          borderBottomRightRadius={"$3"}
        >
          {Object.keys(addedMarks).map((key) => (
            <YStack key={key} paddingHorizontal={"$1"}>
              <XStack justifyContent="space-between" alignItems="center">
                <XStack alignItems="center">
                  <MarkInput
                    onTouchStart={() => checkIfLastAndAddNewItem(key)}
                    onChangeText={(text) => updateMark(key, text, "value")}
                  />
                  <XStack alignItems="center" gap="$1">
                    <Weight width={20} height={20} />
                    <WeightInput
                      onTouchStart={() => checkIfLastAndAddNewItem(key)}
                      onChangeText={(text) => updateMark(key, text, "weight")}
                    />
                  </XStack>
                </XStack>
                {/* {getLastNumericKey(addedMarks) != Number(key) && (
                  <Remove
                    width={24}
                    height={24}
                    onPress={() => removeMark(key)}
                  />
                )} */}
              </XStack>
              {Number(key) < getLastNumericKey(addedMarks) && (
                <HorizontalLine
                  width={"100%"}
                  backgroundColor="$grey80"
                  marginVertical={"$2"}
                />
              )}
            </YStack>
          ))}
        </YStack>
      )}
    </YStack>
  );
};

const PredictorInput = styled(Input, {
  unstyled: true,
  paddingHorizontal: "$1",
});
const MarkInput = styled(PredictorInput, {
  textAlign: "center",
  minWidth: 40,
  color: "$primary",
  fontSize: "$2.5",
  fontWeight: "$medium",
  placeholder: "1",
  placeholderTextColor: "$grey60",
  inputMode: "numeric",
});
const WeightInput = styled(PredictorInput, {
  color: "$primaryLight",
  fontWeight: "$medium",
  placeholder: "20",
  placeholderTextColor: "$grey60",
  inputMode: "numeric",
});

const SubjectSelect = ({
  marks,
  value,
  setValue,
}: {
  marks: FormattedMarksBySubject;
  value: string;
  setValue: (value: string) => void;
}) => {
  return (
    <Select
      id="subjects"
      value={value}
      onValueChange={setValue}
      disablePreventBodyScroll
    >
      <Select.Trigger
        width={"100%"}
        borderWidth={0}
        gap={"$1"}
        backgroundColor={"transparent"}
        minHeight={0}
        paddingVertical={"$1"}
      >
        <Select.Value
          fontSize={"$2.5"}
          placeholder="Vybrat předmět"
          color={"$grey0"}
          paddingBottom={"$0.5"}
        />
        <Chevron width={24} height={24} />
      </Select.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet native={true} modal dismissOnSnapToBottom animation={"quick"}>
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            backgroundColor={"$backgroundTransparent"}
            animation="quick"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200000}>
        <Select.Viewport unstyled={true} minWidth={200}>
          <Select.Group>
            <Select.Label
              fontSize={"$3"}
              paddingHorizontal={"$2"}
              color={"$grey0"}
            >
              Předměty
            </Select.Label>
            <Select.Item index={-1} value={""}>
              <Select.ItemText
                paddingHorizontal={"$2"}
                unstyled={true}
                fontSize={"$1.5"}
                color={"$grey0"}
              >
                Vybrat předmět
              </Select.ItemText>
              <Select.ItemIndicator marginLeft={"auto"} mr={"$4"}>
                <Check width={24} height={24} />
              </Select.ItemIndicator>
            </Select.Item>
            {Object.entries(marks).map(([id, subject], i) => {
              return (
                <Select.Item index={i} key={id} value={id}>
                  <Select.ItemText
                    paddingHorizontal={"$2"}
                    unstyled={true}
                    fontSize={"$1.5"}
                    color={"$grey0"}
                  >
                    {subject.Subject.Name}
                  </Select.ItemText>
                  <Select.ItemIndicator marginLeft={"auto"} mr={"$4"}>
                    <Check width={24} height={24} />
                  </Select.ItemIndicator>
                </Select.Item>
              );
            })}
          </Select.Group>
        </Select.Viewport>
      </Select.Content>
    </Select>
  );
};

export default MarkPredictor;
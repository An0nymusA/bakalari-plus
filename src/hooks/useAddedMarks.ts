import { useState } from "react";
import { getLastNumericKey } from "../utils/utils";

export interface AddedMarks {
  [key: number]: { value: number; weight: number };
}

const useAddedMarks = () => {
  const blankMarks: AddedMarks = { 0: { value: 0, weight: 0 } };
  const [addedMarks, setAddedMarks] = useState<AddedMarks>({} as AddedMarks);

  const addMark = () => {
    setAddedMarks((prevAddedMarks) => ({
      ...prevAddedMarks,
      [getLastNumericKey(prevAddedMarks) + 1]: {
        value: 0,
        weight: 0,
      },
    }));
  };

  const removeMark = (index: number | string) => {
    index = Number(index);

    if (Object.keys(addedMarks).length == 1) return clearMarks();

    const newAddedMarks = { ...addedMarks };
    delete newAddedMarks[index];
    setAddedMarks(newAddedMarks);
  };

  const clearMarks = () => {
    setAddedMarks(blankMarks);
  };

  const checkIfLastAndAddNewItem = (index: number | string) => {
    index = Number(index);

    if (index != getLastNumericKey(addedMarks)) return;

    addMark();
  };

  const updateMark = (
    index: number | string,
    value: number | string,
    field: "weight" | "value"
  ) => {
    value = Number(value);

    setAddedMarks((prevAddedMarks) => ({
      ...prevAddedMarks,
      [index]: { ...prevAddedMarks[Number(index)], [field]: value },
    }));
  };

  return {
    addedMarks,
    removeMark,
    clearMarks,
    updateMark,
    checkIfLastAndAddNewItem,
  };
};

export default useAddedMarks;

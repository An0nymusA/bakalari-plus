import { useState } from "react";

type InitialDataType = { [key: string]: string };

export const useFormInputs = (initialData: InitialDataType = {}) => {
  const [inputData, setInputData] = useState(initialData);

  const updateInput = (key: string, value: string) => {
    setInputData({
      ...inputData,
      [key]: value.trim(),
    });
  };

  return { inputData, updateInput };
};

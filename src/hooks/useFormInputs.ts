import { useState } from "react";

type InitialDataType = { [key: string]: string };

export const useFormInputs = (initialData: InitialDataType = {}) => {
  const [inputData, setInputData] = useState(initialData);

  const [inputErrors, setInputErrors] = useState(
    Object.keys(initialData).reduce(
      (acc: { [key: string]: boolean }, key: string) => {
        acc[key] = false;
        return acc;
      },
      {}
    )
  );

  const setInputError = (key: string, value: boolean) => {
    setInputErrors((inputErrors) => ({
      ...inputErrors,
      [key]: value,
    }));
  };

  const updateInput = (key: string, value: string) => {
    setInputError(key, false);

    setInputData((inputData) => ({
      ...inputData,
      [key]: value.trim(),
    }));
  };

  return { inputData, updateInput, inputErrors, setInputError };
};

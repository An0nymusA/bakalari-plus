import { FormattedMarkBySubject } from "bakalari-ts-api";
import { AddedMarks } from "../hooks/useAddedMarks";
import { roundPlaces } from "../utils/utils";

export const calculateAverage = (
  marks: FormattedMarkBySubject["Marks"],
  addedMarks: AddedMarks
) => {
  let sum = 0;
  let weightSum = 0;

  Object.entries(marks).forEach(([, mark]) => {
    const markText = Number(mark.MarkText);

    if (isNaN(markText)) return;

    sum += markText * mark.Weight;
    weightSum += mark.Weight;
  });
  Object.values(addedMarks).forEach(({ value, weight }) => {
    if (isNaN(value) || isNaN(weight) || value == "0") return;

    sum += value * weight;
    weightSum += weight;
  });

  return roundPlaces(sum / weightSum, 2);
};

export const getValidMarksNumber = (marks: AddedMarks) => {
  return Object.values(marks).filter(
    ({ value, weight }) =>
      !(isNaN(value) || isNaN(weight) || value == "0" || weight == "0")
  ).length;
};

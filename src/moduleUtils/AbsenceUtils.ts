import { Absence, AbsencesPerSubject } from "bakalari-ts-api";

export const countMissedPerSubject = (data: AbsencesPerSubject): number => {
  return data.DistanceTeaching + data.Base + data.Soon;
};

export const countMissedPerDate = (data: Absence): number => {
  return data.DistanceTeaching + data.Missed + data.Soon + data.Unsolved;
};

export const parseAbsencePerDay = (data: Absence) => {
  const translations = {
    DistanceTeaching: "Distanční výuka",
    Soon: "Brzký přichod",
    Late: "Pozdní příchod",
    Missed: "Neomluvená absence",
    Ok: "Omluvená absence",
    Unsolved: "Absence",
  };

  const missed = countMissedPerDate(data);
  const ok = data.Ok;

  const parsed = Object.keys(translations).reduce<
    { name: string; value: number }[]
  >((acc, key) => {
    const value = Number(data[key as keyof Absence]);

    if (value === 0) return acc;

    return [
      ...acc,
      {
        name: translations[key as keyof typeof translations],
        value: Number(data[key as keyof Absence]),
      },
    ];
  }, []);

  return {
    missed,
    ok,
    parsed,
  };
};

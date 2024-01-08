import { useEffect, useState } from "react";

// const testDate = new Date();
// testDate.setHours(16);
// testDate.setMinutes(16);

export const useTime = (refreshCycle = 100) => {
  // const [now, setNow] = useState(testDate);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), refreshCycle);
    // const intervalId = setInterval(() => setNow(testDate), refreshCycle);

    return () => clearInterval(intervalId);
  }, []);

  return now;
};

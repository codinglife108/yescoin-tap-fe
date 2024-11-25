import { useEffect, useState } from "react";

const getRefreshDate = () => {
  const refreshTime = new Date();

  // If it's past 10:00:00 UTC, set the refresh time to the next day
  if (refreshTime.getUTCHours() >= 10) {
    refreshTime.setUTCDate(refreshTime.getDate() + 1);
  }
  refreshTime.setUTCHours(10, 0, 0, 0); // 10:00:00 UTC = 12:00:00 CET

  return refreshTime.getTime();
};

const useCountdown = () => {
  const [countDown, setCountDown] = useState(
    getRefreshDate() - new Date().getTime()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(getRefreshDate() - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return getReturnValues(countDown);
};

const getReturnValues = (countDown: number) => {
  // calculate time left
  const hours = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return [hours, minutes, seconds];
};

export { useCountdown };

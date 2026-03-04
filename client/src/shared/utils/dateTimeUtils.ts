export const getCurrentTime = (): string => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;
};

export const getCurrentTimePlusMinutes = (minutes: number): string => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutes);
  return `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;
};

// Generate time options from 00:00 to 23:30 with 30-minute intervals
export const generateTimeOptions = (): string[] => {
  const times: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${String(hour).padStart(2, "0")}:${String(
        minute
      ).padStart(2, "0")}`;
      times.push(timeString);
    }
  }
  return times;
};

// Round current time to next 30-minute interval for time options
export const getNextAvailableTime = (): string => {
  const now = new Date();
  const currentMinutes = now.getMinutes();
  const currentHour = now.getHours();

  // Round up to next 30-minute interval
  let nextMinutes = Math.ceil(currentMinutes / 30) * 30;
  let nextHour = currentHour;

  if (nextMinutes >= 60) {
    nextMinutes = 0;
    nextHour = (currentHour + 1) % 24;
  }

  // Cap at 23:30 (last available time)
  if (nextHour === 23 && nextMinutes > 30) {
    return "23:30";
  }

  return `${String(nextHour).padStart(2, "0")}:${String(nextMinutes).padStart(
    2,
    "0"
  )}`;
};

import { format, addMinutes, parse } from "date-fns";
import { ru } from "date-fns/locale";

export const getFormattedDateTime = (
  date: Date,
  time: string,
  duration: number
) => {
  const start = parse(time, "HH:mm", date);
  const end = addMinutes(start, duration);

  const datePart = format(start, "d MMMM", { locale: ru });
  const startTime = format(start, "HH:mm");
  const endTime = format(end, "HH:mm");

  return `${datePart} ${startTime}—${endTime}`;
};

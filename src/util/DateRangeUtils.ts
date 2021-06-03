import { eachDayOfInterval, format } from 'date-fns';

export const dateRange = (days: number) => {
  const date = new Date();

  const arrayDate = eachDayOfInterval({
    start: date.setDate(date.getDate() - days),
    end: new Date(),
  });

  const dates = arrayDate.map((x) => ({
    periodo: format(x, 'yyyy-M-d'),
    total: 0,
  }));

  return dates;
};

export const normalizedDateRange = <T>(dates: T[], key: keyof T) => {
  const normalizedDates: T[] = [];

  dates.forEach((item) => {
    const duplicated =
      normalizedDates.findIndex((redItem) => {
        return item[key] == redItem[key];
      }) > -1;

    if (!duplicated) {
      normalizedDates.push(item);
    }
  });

  return normalizedDates.sort((a, b) => {
    if (a[key] > b[key]) {
      return 1;
    }
    if (a[key] < b[key]) {
      return -1;
    }
    return 0;
  });
};

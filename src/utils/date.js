import moment from "moment";
moment.updateLocale("en", {
  weekdays: {
    dow: 1,
  },
});

export const isDateToday = (date) => {
  const inputDate = moment(date, "YYYY-MM-DD:mm:ss.SSS");
  const currentDate = moment();
  return inputDate.isSame(currentDate, "day");
};

export default moment;

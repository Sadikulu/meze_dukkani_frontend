import moment from "moment/moment";

export const checkExpireDate = (date) => {
  if (!date) return false;
  if (date.includes("_")) return false;

  const expireDate = moment(date, "MM/YY").add(1, "month").add(-1, "day");

  if (!expireDate.isValid()) return false;
  if (expireDate < moment()) return false;

  return true;
};

export const getDate = (dateTime) => {
  return moment(dateTime).format("YYYY-MM-DD");
};
export const getDateDayMountYear = (date) => {
  return moment(date).format("DD-MM-YYYY");
};

export const getTime = (dateTime) => {
  return moment.utc(dateTime).local().format("HH:mm");
}

//admin-report
export const checkDates = (dates, val) => {
  const { date1, date2 } = dates;
  const dateStart = moment(date1, "YYYY-MM-DD");
  const dateEnd = moment(date2, "YYYY-MM-DD");
  if (!date2 || !val) {
    return true;
  }
  return dateEnd.isSameOrAfter(dateStart);
};
export const getCurrentDate = () => {
  return moment().format("YYYY-MM-DD");
};

export const validateEndDate = (beginningDate, endDate) => {
  const start = moment(beginningDate);
  const end = moment(endDate);
  if (end.isBefore(start)) {
    return start.format("YYYY-MM-DD");
  }
  return endDate;
};

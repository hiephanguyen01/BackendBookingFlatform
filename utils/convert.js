const moment = require("moment");

exports.convertTimeUTC = (datetime, date) => {
  if (date) {
    return moment(datetime).subtract(7, "hours").format("DD-MM-YYYY  HH:mm");
  }
  return moment(datetime).subtract(7, "hours").format("DD-MM-YYYY");
};
exports.convertTime = (datetime, date) => {
  if (date) {
    return moment(datetime).format("DD-MM-YYYY  HH:mm");
  }
  return moment(datetime).format("DD-MM-YYYY");
};

exports.converPriceVND = (price = 0) => {
  return Number(price).toLocaleString("it-IT", {
    style: "currency",
    currency: "VND",
  });
};

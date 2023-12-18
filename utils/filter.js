const { Op } = require("sequelize");
const moment = require("moment");

exports.filterDateTime = (option, date) => {
  let min, max;
  let filterDate = { [Op.not]: null };
  switch (String(option)) {
    case "1":
      // {
      //   [Op.and]: {
      //     [Op.gte]: option.startDate,
      //     [Op.lte]: option.endDate,
      //   },
      // }
      min = moment().subtract(6, "days").startOf("day");
      max = moment().add(1, "days").endOf("day");
      filterDate = {
        [Op.and]: {
          [Op.gte]: min,
          [Op.lte]: max,
        },
      };
      break;
    case "2":
      min = moment().subtract(30, "days").startOf("day");
      max = new Date(Date.now());
      filterDate = {
        [Op.and]: {
          [Op.gte]: min,
          [Op.lte]: max,
        },
      };

      break;
    case "3":
      min = moment().startOf("month").startOf("day");
      max = moment().endOf("month");
      filterDate = {
        [Op.and]: {
          [Op.gte]: min,
          [Op.lte]: max,
        },
      };

      break;
    case "4":
      const lastMonth = moment().subtract(1, "month");
      min = moment(lastMonth).startOf("month").startOf("day");
      max = moment(lastMonth).endOf("month");
      filterDate = {
        [Op.and]: {
          [Op.gte]: min,
          [Op.lte]: max,
        },
      };

      break;

    case "5":
      min = moment().startOf("quarter").startOf("day");
      max = moment().endOf("quarter");
      filterDate = {
        [Op.and]: {
          [Op.gte]: min,
          [Op.lte]: max,
        },
      };

      break;
    case "6":
      const lastQuarter = moment().subtract(1, "quarter");
      min = moment(lastQuarter).startOf("quarter").startOf("day");
      max = moment(lastQuarter).endOf("quarter");
      filterDate = {
        [Op.and]: {
          [Op.gte]: min,
          [Op.lte]: max,
        },
      };

      break;
    case "7":
      (min = moment().startOf("years")).startOf(),
        (max = moment().endOf("years")),
        (filterDate = {
          [Op.and]: {
            [Op.gte]: min,
            [Op.lte]: max,
          },
        });

      break;
    case "8":
      let date1 = JSON.parse(date);
      (min = date1.startDate),
        (max = date1.endDate),
        (filterDate = {
          [Op.and]: {
            [Op.gte]: min,
            [Op.lte]: max,
          },
        });

      break;
  }
  return { filterDate, min, max };
};

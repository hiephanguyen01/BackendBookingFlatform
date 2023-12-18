const ApiError = require("../utils/ApiError");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const { NumberOfVisit } = require("../models");
const catchAsync = require("../middlewares/async");
const moment = require("moment");
exports.count = catchAsync(async (req, res) => {
  const date = new Date();
  const nowDay = date.getDate();
  const nowMonth = date.getMonth() + 1;
  const nowYear = date.getFullYear();
  const visitor = await NumberOfVisit.findOne({
    where: {
      [Op.and]: [
        sequelize.where(sequelize.fn("DAY", sequelize.col("Date")), nowDay),
        sequelize.where(sequelize.fn("MONTH", sequelize.col("Date")), nowMonth),
        sequelize.where(sequelize.fn("YEAR", sequelize.col("Date")), nowYear),
      ],
    },
  });
  if (!visitor) {
    await NumberOfVisit.create({
      Date: moment(),
      AppCount: 0,
      WebCount: 1,
      Description: "",
    });
  } else {
    await NumberOfVisit.update(
      {
        AppCount: 0,
        WebCount: visitor.dataValues.WebCount + 1,
        Description: "",
      },
      {
        where: {
          id: visitor.dataValues.id,
        },
      }
    );
  }
  res.status(200).json({
    success: true,
  });
});
exports.getLastManyDay = catchAsync(async (req, res) => {
  let { option, date = "" } = req.query;
  if (date !== "") {
    date = JSON.parse(date);
  }
  const condition = {
    1: await getDataLastNDay(7),
    2: await getDataLastNDay(30),
    3: await getDataMonth(true),
    4: await getDataMonth(false),
    5: await get3Month(true),
    6: await get3Month(false),
    7: await ThisYear(),
    8: await spec(date),
  };

  res.status(200).json(condition[option]);
});

const getDataLastNDay = async (day) => {
  const visitor = await NumberOfVisit.findAll({
    where: {
      Date: {
        [Op.between]: [
          moment().utc().subtract(day, "days").startOf("day"),
          moment().utc().endOf("day"),
        ],
      },
    },
  });
  const countsByDate = {};

  for (const item of visitor.map((val) => val.dataValues)) {
    const date = new moment(item.Date).utc().format("DD/MM/YYYY");
    if (!countsByDate[date]) {
      countsByDate[date] = {
        AppCount: 0,
        WebCount: 0,
      };
    }
    countsByDate[date].AppCount += item.AppCount;
    countsByDate[date].WebCount += item.WebCount;
  }

  const counts = Object.entries(countsByDate).map(
    ([date, { AppCount, WebCount }]) => ({ date, AppCount, WebCount })
  );
  return dayAdding(counts);
};
const spec = async (day) => {
  const visitor = await NumberOfVisit.findAll({
    where: {
      Date: {
        [Op.between]: [
          moment(day.startDate).startOf("day"),
          moment(day.endDate).endOf("day"),
        ],
      },
    },
  });
  const countsByDate = {};

  for (const item of visitor.map((val) => val.dataValues)) {
    const date = new moment(item.Date).utc().format("DD/MM/YYYY");
    if (!countsByDate[date]) {
      countsByDate[date] = {
        AppCount: 0,
        WebCount: 0,
      };
    }
    countsByDate[date].AppCount += item.AppCount;
    countsByDate[date].WebCount += item.WebCount;
  }

  const counts = Object.entries(countsByDate).map(
    ([date, { AppCount, WebCount }]) => ({ date, AppCount, WebCount })
  );
  return dayAdding(
    counts,
    moment(day.startDate).startOf("days"),
    moment(day.endDate).endOf("days")
  );
};
const getDataMonth = async (thisMonth) => {
  const start = thisMonth
    ? moment().startOf("month")
    : moment().subtract(1, "months").startOf("month");
  const end = thisMonth
    ? moment().endOf("month")
    : moment().subtract(1, "months").endOf("month");
  const visitor = await NumberOfVisit.findAll({
    where: {
      Date: {
        [Op.between]: [start, end],
      },
    },
  });
  const countsByDate = {};

  for (const item of visitor.map((val) => val.dataValues)) {
    const date = new moment(item.Date).utc().format("DD/MM/YYYY");
    if (!countsByDate[date]) {
      countsByDate[date] = {
        AppCount: 0,
        WebCount: 0,
      };
    }
    countsByDate[date].AppCount += item.AppCount;
    countsByDate[date].WebCount += item.WebCount;
  }

  const counts = Object.entries(countsByDate).map(
    ([date, { AppCount, WebCount }]) => ({ date, AppCount, WebCount })
  );
  return dayAdding(counts, start, thisMonth ? undefined : end);
};
const get3Month = async (thisQ) => {
  const start = thisQ
    ? moment().startOf("quarter")
    : moment().subtract(1, "quarter").startOf("quarter");
  const end = thisQ
    ? moment().endOf("quarter")
    : moment().subtract(1, "quarter").endOf("quarter");
  const visitor = await NumberOfVisit.findAll({
    where: {
      Date: {
        [Op.between]: [start, end],
      },
    },
  });
  const countsByDate = {};

  for (const item of visitor.map((val) => val.dataValues)) {
    const date = new moment(item.Date).utc().format("DD/MM/YYYY");
    if (!countsByDate[date]) {
      countsByDate[date] = {
        AppCount: 0,
        WebCount: 0,
      };
    }
    countsByDate[date].AppCount += item.AppCount;
    countsByDate[date].WebCount += item.WebCount;
  }

  const counts = Object.entries(countsByDate).map(
    ([date, { AppCount, WebCount }]) => ({ date, AppCount, WebCount })
  );
  const result = counts.reduce((acc, curr) => {
    const [year, month] = curr.date.split("/").reverse();
    const key = `${month}-${year}`;
    if (!acc[key]) {
      acc[key] = { Date: `${month}/${year}`, AppCount: 0, WebCount: 0 };
    }
    acc[key].AppCount += curr.AppCount;
    acc[key].WebCount += curr.WebCount;
    return acc;
  }, {});
  return Object.values(result);
};
const ThisYear = async () => {
  const start = moment().startOf("year");
  const end = moment().endOf("year");
  const visitor = await NumberOfVisit.findAll({
    where: {
      Date: {
        [Op.between]: [start, end],
      },
    },
  });
  const countsByDate = {};

  for (const item of visitor.map((val) => val.dataValues)) {
    const date = new moment(item.Date).utc().format("DD/MM/YYYY");
    if (!countsByDate[date]) {
      countsByDate[date] = {
        AppCount: 0,
        WebCount: 0,
      };
    }
    countsByDate[date].AppCount += item.AppCount;
    countsByDate[date].WebCount += item.WebCount;
  }

  const counts = Object.entries(countsByDate).map(
    ([date, { AppCount, WebCount }]) => ({ date, AppCount, WebCount })
  );
  const result = counts.reduce((acc, curr) => {
    const [year, month] = curr.date.split("/").reverse();
    const key = `${month}-${year}`;
    if (!acc[key]) {
      acc[key] = { Date: `${month}/${year}`, AppCount: 0, WebCount: 0 };
    }
    acc[key].AppCount += curr.AppCount;
    acc[key].WebCount += curr.WebCount;
    return acc;
  }, {});
  return Object.values(result);
};

const dayAdding = (data, startDate = undefined, endDate = undefined) => {
  var result = [];
  if (!startDate) {
    startDate = moment(data[0].date, "DD/MM/YYYY");
  } else {
    startDate = moment(startDate, "DD/MM/YYYY");
  }
  if (!endDate) {
    endDate = moment(data[data.length - 1].date, "DD/MM/YYYY");
  } else {
    endDate = moment(endDate, "DD/MM/YYYY");
  }

  let currentDate = startDate;
  while (currentDate.isBefore(endDate)) {
    var dateString = moment(currentDate).format("DD/MM/YYYY");
    var currentData = data.find(function (obj) {
      return obj.date === dateString;
    });
    if (!currentData) {
      currentData = {
        Date: dateString,
        AppCount: 0,
        WebCount: 0,
      };
    } else {
      currentData = {
        Date: dateString,
        AppCount: currentData.AppCount,
        WebCount: currentData.WebCount,
      };
    }
    result.push(currentData);
    currentDate = moment(currentDate).add(1, "days");
  }
  return result;
};

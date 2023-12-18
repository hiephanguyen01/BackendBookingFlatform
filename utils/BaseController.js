const excel = require("exceljs");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const ApiError = require("../utils/ApiError");
const MailSevice = require("./MailService");
const md5 = require("md5");
const moment = require("moment");

class BaseController {
  constructor() {}
  baseURL = "https://am.bookingstudio.vn";
  Pagination = async (Model, page, limit, where = {}, include = null) => {
    /**
     * Pagination function, return limited amount of data in pages
     *
     * Input: Model name <string>, page <int>, limit <int || string>,
     *          where clause <object>, include clause <object>
     *
     * Special case: limit === "all" => Output all record
     *
     * Output: object:{
     *      success: boolean,
     *      pagination: object,
     *      data: object
     *    }
     */

    let total = await Model.count({
      ...where,
    });

    if (+limit <= 0 || isNaN(+limit) || +limit >= 20) {
      limit = 10;
    }
    if (+page <= 0 || isNaN(+page)) {
      page = 1;
    }
    let totalPages = Math.ceil(total / limit);
    let skip = (+page - 1) * +limit;
    if (totalPages < +page) {
      page = 1;
    }

    let List = null;
    if (limit === "all") {
      List = await Model.findAll({
        offset: skip,
        include,
        ...where,
      });
    } else {
      List = await Model.findAll({
        limit: +limit,
        offset: skip,
        include,
        ...where,
      });
    }
    return {
      success: true,
      pagination: {
        totalPages,
        limit: +limit,
        total,
        currentPage: +page,
        hasNextPage: page <= totalPages - 1,
      },
      data: List,
    };
  };
  downloadExcel = (data, res) => {
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Data");
    worksheet.columns = Object.keys(data[0].dataValues).map((obj) => {
      return { header: obj, key: obj, width: 15 };
    });

    // Add Array Rows
    worksheet.addRows(data);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=" + "Data.xlsx");
    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  };
  randomIdentifyCode = async (Model, code) => {
    let id = crypto.randomBytes(6).toString("hex");
    let checked = await Model.findAll({
      where: {
        IdentifyCode: code + id,
      },
    });
    while (checked.length) {
      id = crypto.randomBytes(20).toString("hex");
      checked = await Model.findAll({
        where: {
          IdentifyCode: code + id,
        },
      });
    }
    return code + id;
  };
  filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
  };
  sendHTMLmail = (option, BookingEmail, EmailData) => {
    const optionList = {
      1: {
        filename: "/success.html",
        subject: "Booking Success",
        content: "Booking Success",
      },
      2: {
        filename: "/OTP.html",
        subject: "Booking Studio Verify Code",
        content: "Booking Studio Verify Code",
      },
      3: {
        filename: "/EmailVerify.html",
        subject: "Booking Studio Email Verification",
        content: "Booking Studio Email Verification",
      },
      4: {
        filename: "/CancelBooking.html",
        subject: "Booking Cancel",
        content: "Booking Cancel",
      },
      5: {
        filename: "/Request.html",
        subject: "Yêu cầu chỉnh sửa thông tin",
        content: "Yêu cầu chỉnh sửa thông tin",
      },
      6: {
        filename: "/affiliateAccept.html",
        subject: "Kích hoạt tài khoản thành công",
        content: "Kích hoạt tài khoản thành công",
      },
    };
    const newpath = path.join(__dirname, "../EmailHTML");
    fs.readFile(
      newpath + optionList[option].filename,
      "utf8",
      async (err, html) => {
        if (err) {
          throw new ApiError(400, "Something went wrong");
        } else {
          const newHTMLs = EmailData.reduce((acc, val) => {
            return acc.replaceAll(val.key, val.value);
          }, html);
          await MailSevice.sendMail(
            BookingEmail,
            optionList[option].subject,
            "",
            newHTMLs
          );
        }
      }
    );
  };
  convertPrice = (price) => {
    let format;
    if (price) {
      format = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    } else {
      return 0;
    }
    return format;
  };
  tokenImage = ({ token1, token2, ts }, imageId) => {
    const secrect = md5(
      imageId +
        imageId +
        "92019201" +
        "vnplus" +
        "v1" +
        `${(1000 * 6080 * 11) / 699}` +
        imageId +
        moment().format("YYYY-MM-DD HH")
    );
    const secrect2 = md5(md5(md5(secrect)) + moment().format("YYYY-MM-DD HH"));
    const tsS = Math.floor(Date.now() / 1000);
    if (secrect !== token1) return false;
    if (secrect2 !== token2) return false;
    if (tsS - +ts > 600) return false;
    if (tsS - +ts < 0) return false;
    return true;
  };
  tokenEmail = (category, id) => {
    return md5(
      id +
        id +
        "92019201" +
        "vnplus" +
        "v1" +
        `${(1000 * 6080 * 11) / 699}` +
        id +
        category
    );
  };
  checkTokenEmail = (category, id, token) => {
    const secrect = md5(
      id +
        id +
        "92019201" +
        "vnplus" +
        "v1" +
        `${(1000 * 6080 * 11) / 699}` +
        id +
        category
    );
    if (secrect !== token) return false;
    return true;
  };
  affiliate = ({ link }, imageId) => {
    const secrect = md5(
      imageId + imageId + "v1" + imageId + moment().format("YYYY-MM-DD HH")
    );
    const secrect2 = md5(md5(md5(secrect)) + moment().format("YYYY-MM-DD HH"));
    const tsS = Math.floor(Date.now() / 1000);
    if (secrect !== token1) return false;
    if (secrect2 !== token2) return false;
    if (tsS - +ts > 60) return false;
    if (tsS - +ts < 0) return false;
    return true;
  };
}
const baseController = new BaseController();
module.exports = baseController;

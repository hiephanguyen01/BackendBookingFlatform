const excel = require("exceljs");
const moment = require("moment");
exports.downloadCustomerExcel = (data, res) => {
  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet("Data");
  worksheet.columns = [
    { header: "SỐ ĐỊNH DANH", key: "id", width: 25 },
    { header: "TÊN TÀI KHOẢN", key: "Fullname", width: 25 },
    { header: "SỐ ĐIỆN THOẠI", key: "Phone", width: 25 },
    { header: "GMAIL", key: "Email", width: 25 },
    { header: "ZALO", key: "ZaloName", width: 20 },
    { header: "FACEBOOK", key: "fbFullname", width: 20 },
    { header: "NGÀY TẠO", key: "CreationTime", width: 20 },
    {
      header: "NGÀY CẬP NHẬT GẦN NHẤT",
      key: "LastModificationTime",
      width: 20,
    },
    { header: "TRẠNG THÁI", key: "IsDeleted", width: 10 },
    // { header: "SỐ ĐƠN ĐẶT ", key: "Note", width: 5 },
    { header: "GHI CHÚ", key: "Note", width: 30 },
  ];

  worksheet.addRows(data);

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber !== 1) {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { vertical: "middle", horizontal: "left" };
      });
    }
  });
  // Add Array Rows

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + "customer.xlsx"
  );
  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
};
exports.downloadPartnerExcel = (data, res) => {
  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet("Data");
  worksheet.columns = [
    { header: "SỐ ĐỊNH DANH", key: "Id", width: 25 },
    { header: "TÊN ĐỐI TÁC  ", key: "PartnerName", width: 25 },
    { header: "SỐ ĐIỆN THOẠI", key: "Phone", width: 25 },
    { header: "GMAIL", key: "Email", width: 25 },
    { header: "SỐ CMND/CCCD", key: "PersonalIdentity", width: 20 },
    { header: "NGÀY CẤP", key: "FacebookLastname", width: 20 },
    { header: "NƠI CẤP", key: "CreationTime", width: 20 },
    { header: "TÊN TỔ CHỨC", key: "CompanyName", width: 20 },
    {
      header: "SỐ GIẤY CHỨNG NHẬN ĐĂNG KÝ KINH DOANH (SỐ GPĐKKD)",
      key: "BusinessRegistrationLicenseNumber",
      width: 20,
    },
    { header: "NGƯỜI ĐẠI DIỆN", key: "RepresentativeName", width: 20 },
    { header: "ĐỊA CHỈ", key: "Address", width: 20 },
    { header: "NGÀY TẠO", key: "CreationTime", width: 20 },
    {
      header: "NGÀY CẬP NHẬT GẦN NHẤT",
      key: "LastModificationTime",
      width: 20,
    },
    { header: "TRẠNG THÁI", key: "IsDeleted", width: 10 },
    { header: "SỐ LƯỢNG ĐƠN ĐẶT ", key: "bookingCount", width: 5 },
    { header: "GHI CHÚ", key: "Note", width: 30 },
    { header: "SỐ BÀI ĐĂNG", key: "PostCount", width: 30 },
    { header: "CÂU HỎI BẢO MẬT 1", key: "SecurityQuestion1", width: 30 },
    {
      header: "TRẢ LỜI CÂU HỎI BẢO MẬT 1",
      key: "SecurityQuestion1Answer",
      width: 30,
    },
    { header: "CÂU HỎI BẢO MẬT 2", key: "SecurityQuestion2", width: 30 },
    {
      header: "TRẢ LỜI CÂU HỎI BẢO MẬT 2",
      key: "SecurityQuestion2Answer",
      width: 30,
    },
    { header: "CÂU HỎI BẢO MẬT 3", key: "SecurityQuestion3", width: 30 },
    {
      header: "TRẢ LỜI CÂU HỎI BẢO MẬT 3",
      key: "SecurityQuestion3Answer",
      width: 30,
    },
    { header: "% PHÍ HOA HỒNG", key: "CommissionRate", width: 30 },
    { header: "SỐ TÀI KHOẢN NGÂN HÀNG", key: "BankAccount", width: 30 },
    { header: "TÊN NGÂN HÀNG", key: "BankBranchName", width: 30 },
    {
      header: "CHỦ TÀI KHOẢN NGÂN HÀNG",
      key: "BankAccountOwnerName",
      width: 30,
    },
  ];

  worksheet.addRows(data);

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber !== 1) {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { vertical: "middle", horizontal: "left" };
      });
    }
  });
  // Add Array Rows

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + "Partner.xlsx"
  );
  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
};

exports.downloadPostExcel = (data, res) => {
  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet("Data");
  worksheet.columns = [
    { header: "SỐ ĐỊNH DANH", key: "TenantId", width: 25 },
    { header: "MÃ BÀI ĐĂNG  ", key: "Id", width: 25 },
    { header: "TIÊU ĐỀ BÀI ĐĂNG", key: "Name", width: 25 },
    { header: "ĐỊA CHỈ ", key: "Address", width: 25 },
    { header: "TỔNG SỐ DỊCH VỤ", key: "TotalServices", width: 20 },
    { header: "TRẠNG THÁI ", key: "IsVisible", width: 20 },
    {
      header: "THỜI GIAN LÀM VIỆC BUỔI SÁNG",
      key: "OpenMorning",
      width: 40,
    },
    {
      header: "THỜI GIAN LÀM VIỆC BUỔI CHIỀU",
      key: "OpenAfternoon",
      width: 20,
    },
    { header: "NGÀY ĐĂNG", key: "CreationTime", width: 20 },
    {
      header: "NGÀY CẬP NHẬT GẦN NHẤT",
      key: "LastModificationTime",
      width: 20,
    },
    { header: "SỐ ĐƠN ĐẶT THÀNH CÔNG ", key: "BookingCount", width: 10 },
    {
      header: "SỐ SAO ĐÁNH GIÁ TRUNG BÌNH ",
      key: "TotalRate",
      width: 5,
      height: 5,
    },
    { header: "GHI CHÚ", key: "Note", width: 30 },
    { header: "SỐ BÁO CÁO VI PHẠM", key: "TotalReports", width: 30 },
    // { header: "LÝ DO BÁO CÁO VI PHẠM", key: "ContentReport", width: 50 },
  ];

  worksheet.addRows(data);

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber !== 1) {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { vertical: "middle", horizontal: "left" };
      });
    }
  });
  // Add Array Rows

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=" + "Posts.xlsx");
  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
};

exports.downloadCommissionExcel = async (data, res) => {
  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet("Data");
  worksheet.columns = [
    { header: "Mã THAM CHIẾU", key: "id" },
    { header: "MÃ ĐƠN ĐẶT", key: "IdentifyCode" },
    { header: "NGÀY THỰC TẾ  ", key: "actualDate", width: 20 },
    { header: "MÃ ĐỐI TÁC", key: "TenantId", width: 10 },
    { header: "TÊN ĐỐI TÁC ", key: "PartnerName", width: 25 },
    { header: "TÊN KHÁCH HÀNG", key: "BookingUserName", width: 20 },
    { header: "TRẠNG THÁI ĐƠN ĐẶT ", key: "bookingStatus", width: 10 },
    {
      header: "TỔNG TIỀN TẠM TÍNH PHÍ HOA HỒNG",
      key: "temporaryCommissionFee",
      width: 20,
    },
    {
      header: "SỐ TIỀN HOÀN TRẢ LẠI KHÁCH HÀNG",
      key: "refundValue",
      width: 20,
    },
    {
      header: "TỔNG TIỀN TẠM TÍNH PHÍ HOA HỒNG TRƯỚC KHUYẾN MÃI",
      key: "temporaryCommissionFeeBeforeSale",
      width: 20,
    },
    {
      header: "MÃ KHUYẾN MÃI",
      key: "PromoCodeId",
      width: 10,
    },
    {
      header: "TỔNG SỐ TIỀN KHUYẾN MÃI ",
      key: "totalSaleValue",
      width: 10,
      font: "bold",
    },
    {
      header: "% KHUYỄN MÃI BOOKING STUDIO  ",
      key: "SpendingBookingStudio",
      width: 5,
    },
    {
      header: "% KHUYỄN MÃI CỦA PARNER",
      key: "SpendingPartner",
      width: 5,
    },
    {
      header: "SỐ TIỀN KHUYỄN MÃI BOOKING STUDIO HỖ TRỢ",
      key: "SpendingBookingStudioPrice",
      width: 30,
    },
    {
      header: "SỐ TIỀN KHUYỄN MÃI CỦA PARNER",
      key: "SpendingPartnerPrice",
      width: 30,
    },
    {
      header: "TỔNG TIỀN TÍNH PHÍ HOA HỒNG",
      key: "totalCommission",
      width: 30,
    },
    {
      header: "% Phí hoa hồng",
      key: "CommissionRate",
      width: 10,
    },
    {
      header: "THÀNH TIỀN PHÍ HOA HỒNG ",
      key: "priceCommissionLasted",
      width: 30,
    },
  ];

  worksheet.addRows(data);
  [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
  ].map((item) => {
    worksheet.mergeCells(`${item}1:${item}2`);
    worksheet.getCell(`${item}1:${item}2`).font = { bold: true, size: 12 };
    worksheet.getCell(`${item}1:${item}2`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(`${item}1:${item}2`).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell(`${item}1:${item}2`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFC6E0B4" },
    };
  });
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber !== 1) {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { vertical: "middle", horizontal: "left" };
      });
    }
  });
  // worksheet.getCell("A1:A2").fill = {
  //   type: "pattern",
  //   pattern: "solid",
  //   fgColor: { argb: "FFC6E0B4" },
  // };

  // Add Array Rows

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + "Commission.xlsx"
  );
  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
};
exports.downloadOrderExcel = (data, res) => {
  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet("Data");
  worksheet.columns = [
    { header: "Mã đơn đặt", key: "IdentifyCode", width: 25 },
    { header: "Mã định danh đơn đặt", key: "id", width: 25 },
    {
      header: "Số Định Danh Khách Hàng  ",
      key: "IdentifierCodeUser",
      width: 40,
    },
    { header: "Mã BÀI ĐĂNG", key: "studioPostId", width: 25 },
    { header: "Tên Phòng ", key: "Name", width: 25 },
    { header: "Tên Khách Hàng", key: "BookingUserName", width: 20 },
    { header: "Gmail ", key: "BookingEmail", width: 20 },
    {
      header: "SỐ Điện Thoại",
      key: "BookingPhone",
      width: 40,
    },
    {
      header: "Ngày Đặt",
      key: "CreationTime",
      width: 20,
    },
    {
      header: "NGÀY Thực Hiện",
      key: "OrderByDateFrom",
      width: 20,
    },
    {
      header: "NGÀY Kết Thúc",
      key: "OrderByDateTo",
      width: 20,
    },
    {
      header: "Tổng Tạm Tính",
      key: "BookingValueBeforeDiscount",
      width: 20,
    },
    { header: "Mã Khuyến Mãi ", key: "PromoCodeId", width: 10 },
    {
      header: "Khuyến Mãi ",
      key: "totalSaleValue",
      width: 15,
    },
    { header: "Tổng Tiền", key: "BookingValue", width: 30 },
    { header: "Hình Thức Thanh Toán", key: "PaymentType", width: 30 },
    { header: "TRẠNG THÁI ĐƠN ĐẶT", key: "bookingStatus", width: 50 },
    { header: "TRẠNG THÁI THANH TOÁN", key: "paymentStatus", width: 50 },
    { header: "CỔNG THANH TOÁN", key: "ContentReport", width: 50 },
    { header: "TIỀN CỌC", key: "DepositValue", width: 50 },
    { header: "NGÀY HỦY", key: "DeletionTime", width: 50 },
    { header: "% PHÍ HỦY ĐƠN ", key: "percentCancel", width: 50 },
    { header: "HẠN HỦY ĐƠN MIỄN PHÍ", key: "CancelFreeDate", width: 50 },
    { header: "TRẠNG THÁI HOÀN TIỀN", key: "IsRefund", width: 50 },
    { header: "PHÍ HỦY ĐƠN", key: "CancelPrice", width: 50 },
    { header: "SỐ TIỀN ĐƯỢC HOÀN", key: "refundValue", width: 50 },
    { header: "LÝ DO HỦY ĐƠN", key: "DeletedNote", width: 50 },
    {
      header: "TÀI KHOẢN NGÂN HÀNG HOÀN TIỀN",
      key: "bankAccount",
      width: 50,
    },
    { header: "PHÍ VẮNG MẶT", key: "feeCancelDate", width: 50 },
  ];

  worksheet.addRows(data);
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber !== 1) {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { vertical: "middle", horizontal: "left" };
      });
    }
  });
  // Add Array Rows

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=" + "Orders.xlsx");
  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
};
exports.downloadListPublisherExcel = (data, res) => {
  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet("Data");
  worksheet.columns = [
    { header: "ID tài khoản", key: "id", width: 25 },
    { header: "Họ và tên  ", key: "fullName", width: 40 },
    { header: "Số điện thoại", key: "phone", width: 25 },
    { header: "Loại tài khoản ", key: "isPersonal", width: 25 },
    { header: "Ngày tạo ", key: "CreationTime", width: 25 },
    { header: "Email", key: "email", width: 20 },
    { header: "Địa chỉ ", key: "address", width: 20 },
    { header: "Địa chỉ thường trú ", key: "addressPermanent", width: 20 },
    {
      header: "Tên người đại diện",
      key: "representName",
      width: 40,
    },
    {
      header: "Số tài khoản ngân hàng",
      key: "bankAccount",
      width: 40,
    },
    {
      header: "Tên chủ tài khoản",
      key: "bankAccountOwner",
      width: 30,
    },
    {
      header: "Tên ngân hàng",
      key: "bankName",
      width: 20,
    },
    {
      header: "Số CMND/CCCD",
      key: "idNumber",
      width: 20,
    },
    {
      header: "Ngày cấp",
      key: "licenseDate",
      width: 20,
    },
    {
      header: "Nơi cấp",
      key: "",
      width: 20,
    },
    {
      header: "Mã số thuế",
      key: "taxCode",
      width: 20,
    },
    {
      header: "Tên công ty",
      key: "companyName",
      width: 20,
    },
    {
      header: "Trạng thái",
      key: "isActivate",
      width: 20,
    },
  ];

  worksheet.addRows(data);
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber !== 1) {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { vertical: "middle", horizontal: "left" };
      });
    }
  });
  // Add Array Rows

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + "Publisher.xlsx"
  );
  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
};
exports.downloadCommissionLinkExcel = (data, res) => {
  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet("Data");
  worksheet.columns = [
    { header: "ID/Dịch vụ sản phẩm", key: "id", width: 25 },
    { header: "Tên dịch vụ ", key: "name", width: 40 },
    { header: "Link", key: "link", width: 35 },
    {
      header: "% Hoa hồng theo ngày ",
      key: "AffiliateCommissionByDate",
      width: 25,
    },
    {
      header: "% Hoa hồng theo giờ ",
      key: "AffiliateCommissionByHour",
      width: 25,
    },
    // { header: "Hoa hồng", key: "totalComission", width: 20 },
  ];

  worksheet.addRows(data);
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber !== 1) {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { vertical: "middle", horizontal: "left" };
      });
    }
  });
  // Add Array Rows

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + "CommissionLink.xlsx"
  );
  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
};

exports.downloadCommissionAffiliateExcel = (data, res) => {
  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet("Data");
  worksheet.columns = [
    { header: "ID Publisher", key: "AffiliateUserId", width: 25 },
    { header: "ID Đơn đặt ", key: "Id", width: 40 },
    { header: "ID bài đăng", key: "studioPostId", width: 25 },
    { header: "Tên dịch vụ và sản phẩm ", key: "name", width: 40 },
    { header: "Ngày đặt", key: "CreationTime", width: 20 },
    { header: "Ngày thực hiện ", key: "dateStart", width: 20 },
    { header: "Ngày kết thúc ", key: "dateEnd", width: 20 },
    {
      header: "Trạng thái đơn đặt",
      key: "bookingStatus",
      width: 30,
    },
    {
      header: "Giá trị đơn đặt",
      key: "BookingValue",
      width: 40,
    },
    {
      header: "% Hoa hồng",
      key: "CommissionPercent",
      width: 20,
    },
    {
      header: "Hoa hồng",
      key: "AffiliateCommission",
      width: 30,
    },
  ];

  worksheet.addRows(data);
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber !== 1) {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { vertical: "middle", horizontal: "left" };
      });
    }
  });
  // Add Array Rows

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + "Commission.xlsx"
  );
  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
};
exports.downloadOrderAffiliateExcel = (data, res) => {
  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet("Data");
  worksheet.columns = [
    { header: "ID Publisher", key: "AffiliateUserId", width: 25 },
    { header: "ID Tham chiếu ", key: "Id", width: 40 },
    { header: "ID Đơn đặt ", key: "IdentifyCode", width: 40 },
    { header: "ID bài đăng", key: "studioPostId", width: 25 },
    { header: "Tên dịch vụ và sản phẩm ", key: "name", width: 40 },
    { header: "Ngày đặt", key: "CreationTime", width: 20 },
    { header: "Ngày thực hiện ", key: "dateStart", width: 20 },
    { header: "Ngày kêt thúc ", key: "dateEnd", width: 20 },
    {
      header: "Trạng thái đơn đặt",
      key: "bookingStatus",
      width: 30,
    },
    {
      header: "Giá trị đơn đặt",
      key: "BookingValue",
      width: 40,
    },
  ];

  worksheet.addRows(data);
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber !== 1) {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { vertical: "middle", horizontal: "left" };
      });
    }
  });
  // Add Array Rows

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + "OrdersAffiliate.xlsx"
  );
  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
};

exports.downloadSaleCodeExcel = (data, res) => {
  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet("Data");
  worksheet.columns = [
    { header: "MÃ KHUYẾN MÃI", key: "SaleCode", width: 25 },
    { header: "NGÀY TẠO ", key: "createdAt", width: 40 },
    { header: "TIÊU ĐỀ ", key: "Title", width: 40 },
    { header: "NGÀY/ GIỜ ÁP DỤNG", key: "DateTimeApply", width: 25 },
    { header: "NGÀY/ GIỜ HẾT HẠN ", key: "DateTimeExpire", width: 40 },
    { header: "TRẠNG THÁI", key: "IsDeleted", width: 20 },
    { header: "SỐ LƯỢNG MÃ ", key: "NoOfCode", width: 20 },
    { header: "SỐ LƯỢNG MÃ ĐÃ SỬ DỤNG ", key: "NoOfJoined", width: 20 },
    {
      header: "SỐ LƯỢNG MÃ / ĐỐI TƯỢNG",
      key: "NoOfJoin",
      width: 30,
    },
    {
      header: "% HỖ TRỢ CỦA BOOKING STUDIO",
      key: "SpendingBookingStudio",
      width: 40,
    },
    {
      header: "% ĐỐI TÁC CHỊU",
      key: "SpendingPartner",
      width: 40,
    },
    {
      header: "LOẠI HÌNH ĐƠN ĐẶT ÁP DỤNG",
      key: "Category",
      width: 40,
    },
    {
      header: "HÌNH THỨC ÁP DỤNG",
      key: "TypeReduce",
      width: 40,
    },
    {
      header: "SỐ TIỀN GIẢM",
      key: "ReduceAmount",
      width: 40,
    },
    {
      header: "TỶ LỆ GIẢM",
      key: "ReduceRate",
      width: 40,
    },
    {
      header: "GIÁ TRỊ GIẢM TỐI ĐA",
      key: "MaxReduce",
      width: 40,
    },
    {
      header: "GIÁ TRỊ ĐƠN ĐẶT TỐI THIẾU",
      key: "MinApply",
      width: 40,
    },
    {
      header: "YÊU CẦU XÁC NHẬN TỪ ĐỐI TÁC",
      key: "PartnerConfirm",
      width: 40,
    },
    {
      header: "GHI CHÚ",
      key: "Note",
      width: 40,
    },
  ];

  worksheet.addRows(data);
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber !== 1) {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { vertical: "middle", horizontal: "left" };
      });
    }
  });
  // Add Array Rows

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + "OrdersAffiliate.xlsx"
  );
  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
};
exports.downloadAffExcel = (data, res) => {
  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet("Data");
  worksheet.columns = [
    {
      header: "Mã ID Pulisher",
      key: "AffiliateUserId",
      width: 40,
    },
    {
      header: "Loại tài khoản",
      key: "isPersonal",
      width: 40,
    },
    {
      header: "Hoa hồng tích lũy chưa thanh toán  của kỳ trước chuyển sang",
      key: "unpaidLastPeriod",
      width: 40,
    },
    {
      header: "Hoa hồng kỳ này (Đã bao gồm VAT)",
      key: "commissionThisPeriod",
      width: 40,
    },
    {
      header: "Hoa hồng chưa thanh toán tích lũy (Đã bao gồm VAT)",
      key: "accumulatedUnpaidCommissions",
      width: 40,
    },
    {
      header: "Khấu trừ thuế TNCN",
      key: "TNCN",
      width: 40,
    },
    {
      header: "Hoa hồng thanh toán trong kỳ",
      key: "commissionPaidThisPeriod",
      width: 40,
    },
    {
      header: "Hoa hồng chưa thanh toán chuyển kỳ sau",
      key: "commissionNextPeriod",
      width: 40,
    },
    {
      header: "Hạn thanh toán",
      key: "payDate",
      width: 40,
    },
    {
      header: "Trạng thái thanh toán",
      key: "payStatus",
      width: 40,
    },
  ];

  worksheet.addRows(data);

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber !== 1) {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { vertical: "middle", horizontal: "left" };
      });
    }
  });
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" +
      `Thanhtoan-${moment(data[0].period).format("MM-YYYY")}.xlsx`
  );
  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
};
exports.downloadAffUserExcel = (data, res) => {
  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet("Data");
  worksheet.columns = [
    {
      header: "Kỳ thanh toán",
      key: "period",
      width: 40,
    },
    {
      header: "Hoa hồng kỳ này (Đã bao gồm VAT)",
      key: "commissionThisPeriod",
      width: 40,
    },
    {
      header: "Hoa hồng chưa thanh toán tích lũy (Đã bao gồm VAT)",
      key: "accumulatedUnpaidCommissions",
      width: 40,
    },
    {
      header: "Khấu trừ thuế TNCN",
      key: "TNCN",
      width: 40,
    },
    {
      header: "Hoa hồng thanh toán trong kỳ",
      key: "commissionPaidThisPeriod",
      width: 40,
    },
    {
      header: "Hoa hồng chưa thanh toán chuyển kỳ sau",
      key: "commissionNextPeriod",
      width: 40,
    },
    {
      header: "Hạn thanh toán",
      key: "payDate",
      width: 40,
    },
    {
      header: "Trạng thái thanh toán",
      key: "payStatus",
      width: 40,
    },
  ];

  worksheet.addRows(data);

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber !== 1) {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { vertical: "middle", horizontal: "left" };
      });
    }
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + `Thanhtoan-${data[0].year}.xlsx`
  );
  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
};

exports.downloadSaleCodePartnerExcel = (data, res) => {
  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet("Data");
  worksheet.columns = [
    { header: "MÃ KHUYẾN MÃI", key: "SaleCode", width: 25 },
    { header: "MÃ ĐỐI TÁC", key: "PartnerId", width: 25 },
    { header: "TÊN ĐỐI TÁC ", key: "PartnerName", width: 40 },
    { header: "TRẠNG THÁI THAM GIA ", key: "PartnerConfirm", width: 40 },
    {
      header: "SỐ LƯỢNG MÃ TỐI ĐA ĐƯỢC SỬ DỤNG",
      key: "NoOfJoin",
      width: 25,
    },
    { header: "SỐ LƯỢNG MÃ ĐÃ SỬ DỤNG ", key: "Used", width: 40 },
  ];

  worksheet.addRows(data);
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber !== 1) {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { vertical: "middle", horizontal: "left" };
      });
    }
  });
  // Add Array Rows

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + "ListPartnerSaleCode.xlsx"
  );
  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
};

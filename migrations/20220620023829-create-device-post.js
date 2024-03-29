"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("DevicePosts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      TenantId: {
        type: Sequelize.INTEGER,
      },
      Name: {
        type: Sequelize.STRING,
      },
      Description: {
        type: Sequelize.STRING,
      },
      BookingCount: {
        type: Sequelize.INTEGER,
      },
      Price: {
        type: Sequelize.DOUBLE,
      },
      Sales: {
        type: Sequelize.DOUBLE,
      },
      Image1: {
        type: Sequelize.STRING,
      },
      Image2: {
        type: Sequelize.STRING,
      },
      Image3: {
        type: Sequelize.STRING,
      },
      Image4: {
        type: Sequelize.STRING,
      },
      Image5: {
        type: Sequelize.STRING,
      },
      Image6: {
        type: Sequelize.STRING,
      },
      Image7: {
        type: Sequelize.STRING,
      },
      Image8: {
        type: Sequelize.STRING,
      },
      Image9: {
        type: Sequelize.STRING,
      },
      Image10: {
        type: Sequelize.STRING,
      },
      Image11: {
        type: Sequelize.STRING,
      },
      Image12: {
        type: Sequelize.STRING,
      },
      Image13: {
        type: Sequelize.STRING,
      },
      Image14: {
        type: Sequelize.STRING,
      },
      Image15: {
        type: Sequelize.STRING,
      },
      Image16: {
        type: Sequelize.STRING,
      },
      Image17: {
        type: Sequelize.STRING,
      },
      Image18: {
        type: Sequelize.STRING,
      },
      Image19: {
        type: Sequelize.STRING,
      },
      Image20: {
        type: Sequelize.STRING,
      },
      IsBestSell: {
        type: Sequelize.BOOLEAN,
      },
      IsNewest: {
        type: Sequelize.BOOLEAN,
      },
      DeviceShopId: {
        type: Sequelize.INTEGER,
      },
      CreationTime: {
        type: Sequelize.DATE,
      },
      CreatorUserId: {
        type: Sequelize.BIGINT,
      },
      LastModificationTime: {
        type: Sequelize.DATE,
      },
      LastModifierUserId: {
        type: Sequelize.BIGINT,
      },
      IsDeleted: {
        type: Sequelize.BOOLEAN,
      },
      DeleterUserId: {
        type: Sequelize.BIGINT,
      },
      DeletionTime: {
        type: Sequelize.DATE,
      },
      IsBestSell: {
        type: Sequelize.BOOLEAN,
      },
      IsNewest: {
        type: Sequelize.BOOLEAN,
      },
      IsPopular: {
        type: Sequelize.BOOLEAN,
      },
      Address: {
        type: Sequelize.STRING,
      },

      Note: Sequelize.STRING,
      TotalRate: Sequelize.DOUBLE,
      NumberOfRating: Sequelize.INTEGER,
      OpenMorningMinutes: Sequelize.INTEGER,
      OpenAfternoonHour: Sequelize.INTEGER,
      OpenAfternoonMinutes: Sequelize.INTEGER,
      OpenMorningHour: Sequelize.INTEGER,
      PriceByHour: Sequelize.DOUBLE,
      PriceByDate: Sequelize.DOUBLE,
      SalesByHour: Sequelize.DOUBLE,
      SalesByDate: Sequelize.DOUBLE,
      AffiliateCommissionByHour: Sequelize.FLOAT,
      Open: Sequelize.BOOLEAN,
      AffiliateCommissionByDate: Sequelize.FLOAT,
      CancelPriceByDate: Sequelize.INTEGER,
      CancelPriceByHour: Sequelize.INTEGER,
      AbsentPriceByDate: Sequelize.INTEGER,
      AbsentPriceByHour: Sequelize.INTEGER,
      DepositByDate: Sequelize.INTEGER,
      DepositByHour: Sequelize.INTEGER,
      FreeCancelByDate: Sequelize.STRING,
      FreeCancelByHour: Sequelize.STRING,
      CancelLostDepositPercent: Sequelize.INTEGER,
      DepositPaymentTypeByDate: Sequelize.INTEGER,
      DepositPaymentTypeByHour: Sequelize.INTEGER,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("DevicePosts");
  },
};

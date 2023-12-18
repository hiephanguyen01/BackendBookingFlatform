"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ModelServicePackages", {
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
      Price: {
        type: Sequelize.DOUBLE,
      },
      Sales: {
        type: Sequelize.DOUBLE,
      },
      PriceNote: {
        type: Sequelize.STRING,
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
      ModelPostId: {
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
      AffiliateCommissionByHour: { type: Sequelize.FLOAT },
      AffiliateCommissionByDate: { type: Sequelize.FLOAT },
      Deposit: { type: Sequelize.DOUBLE },
      Surcharge: { type: Sequelize.DOUBLE },
      Open: { type: Sequelize.BOOLEAN },
      CancelPriceByDate: { type: Sequelize.INTEGER },
      CancelPriceByHour: { type: Sequelize.INTEGER },
      AbsentPriceByDate: { type: Sequelize.INTEGER },
      AbsentPriceByHour: { type: Sequelize.INTEGER },
      DepositPaymentTypeByDate: { type: Sequelize.INTEGER },
      DepositPaymentTypeByHour: { type: Sequelize.INTEGER },
      DepositByDate: { type: Sequelize.INTEGER },
      DepositByHour: { type: Sequelize.INTEGER },
      FreeCancelByDate: { type: Sequelize.STRING },
      FreeCancelByHour: { type: Sequelize.STRING },
      CancelLostDepositPercent: { type: Sequelize.INTEGER },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ModelServicePackages");
  },
};

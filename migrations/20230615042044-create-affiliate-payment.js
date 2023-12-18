"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("AffiliatePayments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      period: {
        type: Sequelize.DATE,
      },
      unpaidLastPeriod: {
        type: Sequelize.BIGINT,
      },
      commissionThisPeriod: {
        type: Sequelize.BIGINT,
      },
      accumulatedUnpaidCommissions: {
        type: Sequelize.BIGINT,
      },
      TNCN: {
        type: Sequelize.BIGINT,
      },
      commissionPaidThisPeriod: {
        type: Sequelize.BIGINT,
      },
      commissionNextPeriod: {
        type: Sequelize.BIGINT,
      },
      payDate: {
        type: Sequelize.DATE,
      },
      payStatus: {
        type: Sequelize.INTEGER,
      },
      AffiliateUserId: {
        type: Sequelize.INTEGER,
        references: {
          model: "AffiliateUsers",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("AffiliatePayments");
  },
};

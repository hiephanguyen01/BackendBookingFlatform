"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("SaleCodes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      SaleCode: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      NoOfCode: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      NoOfJoin: {
        type: Sequelize.INTEGER,
      },
      NoOfJoined: {
        type: Sequelize.INTEGER,
      },
      Title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      Content: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      DateTimeApply: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      DateTimeExpire: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      SpendingPartner: {
        type: Sequelize.INTEGER,
      },
      SpendingBookingStudio: {
        type: Sequelize.INTEGER,
      },
      Note: {
        type: Sequelize.STRING,
      },
      TypeReduce: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      ReduceValue: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      MaxReduce: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      MinApply: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      Category: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      CusApply: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("SaleCodes");
  },
};

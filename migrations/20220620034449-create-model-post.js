"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ModelPosts", {
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
      Address: {
        type: Sequelize.STRING,
      },
      Price: {
        type: Sequelize.DOUBLE,
      },
      Sales: {
        type: Sequelize.DOUBLE,
      },
      BookingCount: {
        type: Sequelize.INTEGER,
      },
      Description: {
        type: Sequelize.STRING,
      },
      BookingUserId: {
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
      HourCloseDefault: {
        type: Sequelize.INTEGER,
      },
      HourOpenDefault: {
        type: Sequelize.INTEGER,
      },
      MinutesCloseDefault: {
        type: Sequelize.INTEGER,
      },
      IsHotDeal: {
        type: Sequelize.BOOLEAN,
      },
      MinutesOpenDefault: {
        type: Sequelize.INTEGER,
      },
      IsVisible: { type: Sequelize.BOOLEAN },
      Note: { type: Sequelize.STRING },
      TotalRate: { type: Sequelize.DOUBLE },
      NumberOfRating: { type: Sequelize.INTEGER },
      OpenMorningMinutes: { type: Sequelize.INTEGER },
      OpenAfternoonHour: { type: Sequelize.INTEGER },
      OpenAfternoonMinutes: { type: Sequelize.INTEGER },
      OpenMorningHour: { type: Sequelize.INTEGER },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ModelPosts");
  },
};

"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CartItems", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      CartId: {
        type: Sequelize.INTEGER,
      },
      Category: { type: Sequelize.INTEGER },
      StudioPostId: { type: Sequelize.INTEGER },
      PhotographerPostId: { type: Sequelize.INTEGER },
      ClothesPostId: { type: Sequelize.INTEGER },
      MakeupPostId: { type: Sequelize.INTEGER },
      DevicePostId: { type: Sequelize.INTEGER },
      ModelPostId: { type: Sequelize.INTEGER },
      ServiceId: {
        type: Sequelize.INTEGER,
      },
      RoomId: {
        type: Sequelize.INTEGER,
      },
      OrderByTime: {
        type: Sequelize.BOOLEAN,
      },
      OrderByTimeFrom: {
        type: Sequelize.DATE,
      },
      OrderByTimeTo: {
        type: Sequelize.DATE,
      },
      OrderByDateFrom: {
        type: Sequelize.DATE,
      },
      OrderByDateTo: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("CartItems");
  },
};

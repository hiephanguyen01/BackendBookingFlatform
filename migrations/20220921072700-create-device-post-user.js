"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("DevicePost_Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      DevicePostId: {
        type: Sequelize.INTEGER,
        references: {
          model: "DevicePosts",
          key: "id",
        },
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: "BookingUsers",
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
    await queryInterface.dropTable("DevicePost_Users");
  },
};

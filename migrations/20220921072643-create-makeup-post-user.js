"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("MakeupPost_Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      MakeupPostId: {
        type: Sequelize.INTEGER,
        references: {
          model: "MakeupPosts",
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
    await queryInterface.dropTable("MakeupPost_Users");
  },
};

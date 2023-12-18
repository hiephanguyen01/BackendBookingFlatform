"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PostReports", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      Category: {
        type: Sequelize.INTEGER,
      },
      PostId: {
        type: Sequelize.INTEGER,
      },
      BookingUserId: {
        type: Sequelize.INTEGER,
        references: {
          model: "BookingUsers",
          key: "id",
        },
      },
      Content: {
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
    await queryInterface.dropTable("PostReports");
  },
};

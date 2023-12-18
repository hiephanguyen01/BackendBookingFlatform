"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("NumberOfVisits", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      Date: {
        type: Sequelize.DATE,
      },
      AppCount: {
        type: Sequelize.INTEGER,
      },
      WebCount: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("NumberOfVisits");
  },
};

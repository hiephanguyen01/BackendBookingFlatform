"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Banners", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      Name: {
        type: Sequelize.STRING,
      },
      Description: {
        type: Sequelize.STRING,
      },
      Creator: {
        type: Sequelize.STRING,
      },
      IsVisible: {
        type: Sequelize.BOOLEAN,
      },
      Image1: {
        type: Sequelize.STRING,
      },
      Image2: {
        type: Sequelize.STRING,
      },
      Priority: {
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
    await queryInterface.dropTable("Banners");
  },
};

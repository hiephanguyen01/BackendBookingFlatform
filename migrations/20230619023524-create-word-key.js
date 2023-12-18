"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("WordKeys", {
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
      WordGroupId: {
        type: Sequelize.INTEGER,
        references: {
          model: "WordGroups",
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
    await queryInterface.dropTable("WordKeys");
  },
};

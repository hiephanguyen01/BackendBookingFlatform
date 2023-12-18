"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ParnerComments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      Content: {
        type: Sequelize.STRING,
      },
      PartnerId: {
        type: Sequelize.INTEGER,
        references: {
          model: "RegisterPartners",
          key: "id",
        },
      },
      PostId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Posts",
          key: "id",
        },
      },
      Services: {
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
    await queryInterface.dropTable("ParnerComments");
  },
};

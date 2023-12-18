"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PromoteCode_Partners", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      PromoteCodeId: {
        type: Sequelize.INTEGER,
        references: {
          model: "SaleCodes",
          key: "id",
        },
      },
      PartnerId: {
        type: Sequelize.INTEGER,
        references: {
          model: "RegisterPartners",
          key: "id",
        },
      },
      PartnerConfirm: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable("PromoteCode_Partners");
  },
};

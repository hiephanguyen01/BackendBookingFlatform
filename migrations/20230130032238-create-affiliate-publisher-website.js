"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("AffiliatePublisherWebsites", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      link: {
        type: Sequelize.STRING,
      },
      isConnected: {
        type: Sequelize.BOOLEAN,
      },
      affiliateUserId: {
        type: Sequelize.INTEGER,
        references: {
          model: "AffiliateUsers",
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
    await queryInterface.dropTable("AffiliatePublisherWebsites");
  },
};

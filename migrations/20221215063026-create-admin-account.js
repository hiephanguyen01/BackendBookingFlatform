'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AdminAccounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      partnerAccount: {
        type: Sequelize.INTEGER
      },
      customerAccount: {
        type: Sequelize.INTEGER
      },
      post: {
        type: Sequelize.INTEGER
      },
      report: {
        type: Sequelize.INTEGER
      },
      booking: {
        type: Sequelize.INTEGER
      },
      export: {
        type: Sequelize.INTEGER
      },
      dao: {
        type: Sequelize.INTEGER
      },
      permission: {
        type: Sequelize.INTEGER
      },
      notification: {
        type: Sequelize.INTEGER
      },
      promo: {
        type: Sequelize.INTEGER
      },
      setting: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('AdminAccounts');
  }
};
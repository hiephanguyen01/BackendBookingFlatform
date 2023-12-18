'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MessagesUsers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ConversationId: {
        type: Sequelize.BIGINT
      },
      Content: {
        type: Sequelize.STRING
      },
      PartnerId: {
        type: Sequelize.BIGINT
      },
      UserId: {
        type: Sequelize.BIGINT
      },
      IsRead:{
        type:Sequelize.BOOLEAN
      },
      Type:{
        type:Sequelize.STRING
      },
      fileName:{
        type:Sequelize.STRING
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
    await queryInterface.dropTable('MessagesUsers');
  }
};
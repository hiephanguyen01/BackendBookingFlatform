"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("AffiliateUsers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      isPersonal: {
        type: Sequelize.BOOLEAN,
      },
      firstName: {
        type: Sequelize.STRING,
      },
      lastName: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      companyAddress: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      links: {
        type: Sequelize.TEXT("long"),
      },
      companyName: {
        type: Sequelize.STRING,
      },
      taxCode: {
        type: Sequelize.STRING,
      },
      CCCD1: {
        type: Sequelize.STRING,
      },
      CCCD2: {
        type: Sequelize.STRING,
      },
      addressPermanent: {
        type: Sequelize.STRING,
      },
      bankAccount: {
        type: Sequelize.STRING,
      },
      bankAccountOwner: {
        type: Sequelize.STRING,
      },
      bankName: {
        type: Sequelize.STRING,
      },
      idNumber: {
        type: Sequelize.STRING,
      },
      licenseDate: {
        type: Sequelize.DATE,
      },
      phoneInfo: {
        type: Sequelize.STRING,
      },
      representName: {
        type: Sequelize.STRING,
      },
      isActivate: {
        type: Sequelize.BOOLEAN,
        default: false,
      },
      image: {
        type: Sequelize.STRING,
      },
      facebookId: {
        type: Sequelize.STRING,
      },
      facebookToken: {
        type: Sequelize.STRING,
      },
      facebookFirstname: {
        type: Sequelize.STRING,
      },
      facebookLastname: {
        type: Sequelize.STRING,
      },
      facebookEmail: {
        type: Sequelize.STRING,
      },
      facebookPicture: {
        type: Sequelize.STRING,
      },
      googleName: {
        type: Sequelize.STRING,
      },
      googleEmail: {
        type: Sequelize.STRING,
      },
      googlePicture: {
        type: Sequelize.STRING,
      },
      isDelete: {
        type: Sequelize.BOOLEAN,
        default: false,
      },
      note: {
        type: Sequelize.STRING,
      },
      isActivateEmail: {
        type: Sequelize.BOOLEAN,
        default: false,
      },
      isActivePhone: {
        type: Sequelize.BOOLEAN,
        default: false,
      },
      successCount: {
        type: Sequelize.INTEGER,
      },
      password: {
        type: Sequelize.STRING,
      },
      salt: {
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
    await queryInterface.dropTable("AffiliateUsers");
  },
};

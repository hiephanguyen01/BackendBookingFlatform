"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PhotographerRatings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      TenantId: {
        type: Sequelize.STRING,
      },
      Rate: {
        type: Sequelize.INTEGER,
      },
      Description: {
        type: Sequelize.STRING,
      },
      Image1: {
        type: Sequelize.STRING,
      },
      Image2: {
        type: Sequelize.STRING,
      },
      Image3: {
        type: Sequelize.STRING,
      },
      Image4: {
        type: Sequelize.STRING,
      },
      Image5: {
        type: Sequelize.STRING,
      },
      Image6: {
        type: Sequelize.STRING,
      },
      Image7: {
        type: Sequelize.STRING,
      },
      Image8: {
        type: Sequelize.STRING,
      },
      Image9: {
        type: Sequelize.STRING,
      },
      Image10: {
        type: Sequelize.STRING,
      },
      video1: {
        type: Sequelize.STRING,
      },
      video2: {
        type: Sequelize.STRING,
      },
      video3: {
        type: Sequelize.STRING,
      },
      video4: {
        type: Sequelize.STRING,
      },
      video5: {
        type: Sequelize.STRING,
      },
      video6: {
        type: Sequelize.STRING,
      },
      video7: {
        type: Sequelize.STRING,
      },
      video8: {
        type: Sequelize.STRING,
      },
      video9: {
        type: Sequelize.STRING,
      },
      video10: {
        type: Sequelize.STRING,
      },
      BookingUserId: {
        type: Sequelize.INTEGER,
      },
      PhotographerPostId: {
        type: Sequelize.INTEGER,
      },
      PhotographerServicePackageId: {
        type: Sequelize.INTEGER,
        references: {
          model: "PhotographerServicePackages",
          key: "id",
        },
      },
      PhotographerBookingId: {
        type: Sequelize.INTEGER,
        references: {
          model: "PhotographerBookings",
          key: "id",
        },
      },
      CreationTime: {
        type: Sequelize.DATE,
      },
      CreatorUserId: {
        type: Sequelize.BIGINT,
      },
      LastModificationTime: {
        type: Sequelize.DATE,
      },
      LastModifierUserId: {
        type: Sequelize.BIGINT,
      },
      IsDeleted: {
        type: Sequelize.BOOLEAN,
      },
      DeletedUserId: {
        type: Sequelize.BIGINT,
      },
      DeletionTime: {
        type: Sequelize.DATE,
      },
      IsAnonymous: {
        type: Sequelize.BOOLEAN,
      },
      ReplyComment: {
        type: Sequelize.STRING,
      },
      VideoThumb1: {
        type: Sequelize.STRING,
      },
      VideoThumb2: {
        type: Sequelize.STRING,
      },
      VideoThumb3: {
        type: Sequelize.STRING,
      },
      VideoThumb4: {
        type: Sequelize.STRING,
      },
      VideoThumb5: {
        type: Sequelize.STRING,
      },
      VideoThumb6: {
        type: Sequelize.STRING,
      },
      VideoThumb7: {
        type: Sequelize.STRING,
      },
      VideoThumb8: {
        type: Sequelize.STRING,
      },
      VideoThumb9: {
        type: Sequelize.STRING,
      },
      VideoThumb10: {
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
    await queryInterface.dropTable("PhotographerRatings");
  },
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StudioRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ StudioBooking, StudioPost, RegisterPartner, CartItem }) {
      StudioRoom.hasMany(StudioBooking, {
        foreignKey: "StudioRoomId",
        as: "Bookings",
      });
      this.belongsTo(StudioPost, {
        foreignKey: "StudioPostId",
      });
      this.belongsTo(RegisterPartner, {
        foreignKey: "TenantId",
      });
      this.hasMany(CartItem, {
        foreignKey: "RoomId",
      });
    }
  }
  StudioRoom.init(
    {
      TenantId: DataTypes.INTEGER,
      Name: DataTypes.STRING,
      Area: DataTypes.STRING,
      Style: DataTypes.STRING,
      Description: DataTypes.STRING,
      PriceByDate: DataTypes.DOUBLE,
      PriceByHour: DataTypes.DOUBLE,
      PriceNote: DataTypes.DOUBLE,
      Image1: DataTypes.STRING,
      Image2: DataTypes.STRING,
      Image3: DataTypes.STRING,
      Image4: DataTypes.STRING,
      Image5: DataTypes.STRING,
      Image6: DataTypes.STRING,
      Image7: DataTypes.STRING,
      Image8: DataTypes.STRING,
      Image9: DataTypes.STRING,
      Image10: DataTypes.STRING,
      Image11: DataTypes.STRING,
      Image12: DataTypes.STRING,
      Image13: DataTypes.STRING,
      Image14: DataTypes.STRING,
      Image15: DataTypes.STRING,
      Image16: DataTypes.STRING,
      Image17: DataTypes.STRING,
      Image18: DataTypes.STRING,
      Image19: DataTypes.STRING,
      Image20: DataTypes.STRING,
      StudioPostId: DataTypes.INTEGER,
      CreationTime: {
        type: DataTypes.DATE,
        defaultValue: new Date(), // Or DataTypes.UUIDV1
      },
      CreatorUserId: DataTypes.BIGINT,
      LastModificationTime: DataTypes.DATE,
      LastModifierUserId: DataTypes.BIGINT,
      IsDeleted: DataTypes.BOOLEAN,
      DeleterUserId: DataTypes.BIGINT,
      DeletionTime: DataTypes.DATE,
      Deposit: DataTypes.DOUBLE,
      Width: DataTypes.DOUBLE,
      Length: DataTypes.DOUBLE,
      Height: DataTypes.DOUBLE,
      HasLamp: { type: DataTypes.BOOLEAN },
      LampDescription: DataTypes.STRING,
      HasBackground: { type: DataTypes.BOOLEAN },
      BackgroundDescription: DataTypes.STRING,
      HasTable: { type: DataTypes.BOOLEAN },
      HasChair: { type: DataTypes.BOOLEAN },
      HasSofa: { type: DataTypes.BOOLEAN },
      HasFlower: { type: DataTypes.BOOLEAN },
      HasOtherDevice: { type: DataTypes.BOOLEAN },
      OtherDeviceDescription: DataTypes.STRING,
      HasFan: { type: DataTypes.BOOLEAN },
      HasAirConditioner: { type: DataTypes.BOOLEAN },
      HasDressingRoom: { type: DataTypes.BOOLEAN },
      HasWC: { type: DataTypes.BOOLEAN },
      HasCamera: { type: DataTypes.BOOLEAN },
      HasWifi: { type: DataTypes.BOOLEAN },
      HasMotorBikeParking: { type: DataTypes.BOOLEAN },
      HasCarParking: { type: DataTypes.BOOLEAN },
      HasSupporter: { type: DataTypes.BOOLEAN },
      MaximumCustomer: DataTypes.INTEGER,
      Surcharge: DataTypes.DOUBLE,
      AffiliateCommissionByHour: DataTypes.FLOAT,
      AffiliateCommissionByDate: DataTypes.FLOAT,
      Open: DataTypes.BOOLEAN,
      CancelPriceByDate: DataTypes.INTEGER,
      CancelPriceByHour: DataTypes.INTEGER,
      AbsentPriceByDate: DataTypes.INTEGER,
      AbsentPriceByHour: DataTypes.INTEGER,
      DepositPaymentTypeByDate: DataTypes.INTEGER,
      DepositPaymentTypeByHour: DataTypes.INTEGER,
      DepositByDate: DataTypes.INTEGER,
      DepositByHour: DataTypes.INTEGER,
      FreeCancelByDate: DataTypes.STRING,
      FreeCancelByHour: DataTypes.STRING,
      CancelLostDepositPercent: DataTypes.INTEGER,
      DepositPaymentTypeByDate: DataTypes.INTEGER,
      DepositPaymentTypeByHour: DataTypes.INTEGER,
    },
    {
      sequelize,
      timestamps: false,

      modelName: "StudioRoom",
    }
  );
  return StudioRoom;
};

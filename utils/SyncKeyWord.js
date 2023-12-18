const sequelize = require("sequelize");
const { Op } = require("sequelize");
const {
  RegisterPartner,
  MakeupPost,
  ModelPost,
  StudioPost,
  PhotographerPost,
  StudioRoom,
  PhotographerServicePackage,
  ModelServicePackage,
  MakeupServicePackage,
} = require("../models");
const _ = require("lodash");

const syncKeyWordPost = async () => {
  const partners = await RegisterPartner.findAll({
    attributes: ["Id", "TenantId"],
    raw: true,
  });

  for (const id of _.map(partners, "TenantId")) {
    await ModelSynce(id, StudioRoom, StudioPost);
    await ModelSynce(id, PhotographerServicePackage, PhotographerPost);
    // await ModelSynce(id, ClothesBooking, ClothesPost);
    // await ModelSynce(id, DeviceBooking, DevicePost);
    await ModelSynce(id, MakeupServicePackage, MakeupPost);
    await ModelSynce(id, ModelServicePackage, ModelPost);
  }
};

const ModelSynce = async (TenantId, ModelService, ModelPost) => {
  const modelServices = await ModelService.findAll({
    where: {
      TenantId,
    },
    attributes: ["Name", "Description"],
    raw: true,
  });
  const KeyWord = modelServices.reduce(
    (acc, val) => acc + " - " + val.Name,
    ""
  );
  const KeyWordDescription = modelServices.reduce(
    (acc, val) => acc + " - " + val.Description,
    ""
  );
  await ModelPost.update(
    {
      KeyWord,
      KeyWordDescription,
    },
    {
      where: {
        TenantId,
      },
    }
  );
};

module.exports = syncKeyWordPost;

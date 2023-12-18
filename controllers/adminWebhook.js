const {
  AbpWebhookSubscription,
  AbpWebhookEvent,
  AbpWebhookSendAttempt,
} = require("../models");
const catchAsync = require("../middlewares/async");
const { Op } = require("sequelize");
const baseController = require("../utils/BaseController");
const schedule = require("node-schedule");
const http = require("http");
exports.getAllWebhook = catchAsync(async (req, res) => {
  const { page, limit, method } = req.query;
  let data2;
  if (method !== "" && method !== undefined) {
    data2 = await AbpWebhookSubscription.findAll({
      where: { Method: method },
    });
  } else {
    data2 = await AbpWebhookSubscription.findAll();
  }
  data2 = data2.map((item) => {
    return {
      ...item.dataValues,
      Body: JSON.parse(item.dataValues.Body),
      Params: JSON.parse(item.dataValues.Params),
      Headers: JSON.parse(item.dataValues.Headers),
    };
  });
  // let list = await baseController.Pagination(AdminWebhook, page, limit);

  res.status(200).send(data2);
});

exports.createWebHook = catchAsync(async (req, res) => {
  let filteredBody = baseController.filterObj(
    req.body,
    "Method",
    "WebhookUri",
    "Body",
    "Params",
    "IsActive",
    "CreatorUserId",
    "TenantId",
    "Secret",
    "Headers",
    "WebhookName",
    "FlowId"
  );

  const data = await AbpWebhookSubscription.create({
    ...filteredBody,
    Body: JSON.stringify(filteredBody.Body),
    Params: JSON.stringify(filteredBody.Params),
    Headers: JSON.stringify(filteredBody.Headers),
  });

  res.status(200).send({ success: true, data });
});

exports.createWebHookEvents = catchAsync(async (req, Object) => {
  const result = await AbpWebhookSubscription.findOne({
    where: {
      WebhookUri: { [Op.like]: `%${req.path}` },
      Method: req.method,
    },
  });

  if (result) {
    let filteredBody = baseController.filterObj(
      { ...Object, WebhookSubscriptionId: result.Id },
      "Data",
      "TenantId",
      "IsDeleted",
      "DeletionTime",
      "IsDeleted",
      "WebhookName",
      "WebhookSubscriptionId"
    );
    await AbpWebhookEvent.create({
      ...filteredBody,
      Data: JSON.stringify(filteredBody.Data),
    });
  }
});

exports.createWebHookSendAttempts = catchAsync(async () => {
  const data = await AbpWebhookEvent.findAll({
    limit: 1,
    where: {
      IsDeleted: false,
    },
    order: [["CreationTime", "DESC"]],
  });
  const mJob = schedule.scheduleJob("*/10 * * * * *", async () => {
    if (data[0]) {
      AbpWebhookSendAttempt.create({
        WebhookSubscriptionId: data[0].WebhookSubscriptionId,
        WebhookEventId: data[0].Id,
        ResponseStatusCode: 200,
      })
        .then(async () => {
          await AbpWebhookEvent.update(
            {
              IsDeleted: true,
              DeletionTime: new Date(),
            },
            { where: { id: data[0].Id } }
          );
        })
        .catch(async () => {
          await AbpWebhookSendAttempt.create({
            WebhookSubscriptionId: data[0].WebhookSubscriptionId,
            WebhookEventId: data[0].Id,
            ResponseStatusCode: 400,
          });
        });
    }

    mJob.cancel();
  });
});
exports.webhookSubcriptDetail = catchAsync(async (req, res) => {
  const { id } = req.params;
  let data = await AbpWebhookSubscription.findOne({ where: { id } });
  data = {
    ...data.dataValues,
    Body: JSON.parse(data.Body),
    Params: JSON.parse(data.Params),
    Headers: JSON.parse(data.Headers),
  };
  res.status(200).send(data);
});

exports.UpdateWebhookSubcript = catchAsync(async (req, res) => {
  const { id } = req.params;
  let filteredBody = baseController.filterObj(
    req.body,
    "Method",
    "WebhookUri",
    "Body",
    "Params",
    "Headers",
    "WebhookName",
    "FlowId",
    "IsActive"
  );
  filteredBody = {
    ...filteredBody,
    Body: JSON.stringify(filteredBody?.Body) || {},
    Method: filteredBody?.Method?.toUpperCase(),
    Params: JSON.stringify(filteredBody?.Params) || {},
    Headers: JSON.stringify(filteredBody?.Headers) || {},
  };
  const data = await AbpWebhookSubscription.update(filteredBody, {
    where: { id },
  });
  res.status(200).send({
    success: true,
    // data: {
    //   ...data.dataValues,
    //   Body: JSON.parse(data.dataValues.Body) || {},
    //   Params: JSON.parse(data.dataValues.Params) || {},
    //   Headers: JSON.parse(data.dataValues.Headers) || {},
    // },
  });
});

exports.DeleteWebhookSubcript = catchAsync(async (req, res) => {
  const { id } = req.params;
  await AbpWebhookSubscription.destroy({ where: { id } });
  res.status(200).send("data2");
});

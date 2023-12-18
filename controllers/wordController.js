const { WordGroup, WordKey } = require("../models");
const catchAsync = require("../middlewares/async");
const ApiError = require("../utils/ApiError");

exports.createWordGroup = catchAsync(async (req, res) => {
  const { Name } = req.body;
  const check = await WordGroup.findOne({
    where: {
      Name,
    },
  });
  if (check) {
    throw new ApiError(400, "Name đã tồn tại");
  }
  const list = await WordGroup.create({
    Name,
  });
  res.status(200).send(list);
});

exports.createWord = catchAsync(async (req, res) => {
  const { Name, WordGroupId } = req.body;
  const check = await WordKey.findOne({
    where: {
      Name,
      WordGroupId,
    },
  });
  if (check) {
    throw new ApiError(400, "Name đã tồn tại");
  }
  const list = await WordKey.create({
    Name,
    WordGroupId,
  });
  res.status(200).send(list);
});
exports.updateWord = catchAsync(async (req, res) => {
  const { Name } = req.body;
  const { id } = req.query;
  await WordKey.update(
    {
      Name,
    },
    {
      where: {
        id,
      },
    }
  );

  res.status(200).send(true);
});
exports.updateGroupWord = catchAsync(async (req, res) => {
  const { Name } = req.body;
  const { id } = req.query;
  await WordGroup.update(
    {
      Name,
    },
    {
      where: {
        id,
      },
    }
  );

  res.status(200).send(true);
});

exports.deleteWordGroup = catchAsync(async (req, res) => {
  const { id } = req.query;
  await WordKey.destroy({
    where: {
      WordGroupId: id,
    },
  });
  await WordGroup.destroy({
    where: {
      id,
    },
  });
  res.status(200).send(true);
});
exports.deleteWord = catchAsync(async (req, res) => {
  const { id } = req.query;
  await WordKey.destroy({
    where: {
      id,
    },
  });
  res.status(200).send(true);
});

exports.getWordGroup = catchAsync(async (req, res) => {
  const data = await WordGroup.findAll({
    include: [
      {
        model: WordKey,
      },
    ],
  });
  res.status(200).send(data);
});

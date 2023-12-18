const { AskedQuestion } = require("../models");

const catchAsync = require("../middlewares/async");
const ApiError = require("../utils/ApiError");
const { Op } = require("sequelize");

exports.getAllAskedQuestion = catchAsync(async (req, res) => {
  const { likeText } = req.query;
  const list = await AskedQuestion.findAll({
    where: {
      [Op.or]: [
        {
          Question: {
            [Op.like]: likeText ? `%${likeText}%` : `%%`,
          },
        },
        {
          Answer: {
            [Op.like]: likeText ? `%${likeText}%` : `%%`,
          },
        },
      ],
    },
  });
  res.status(200).json({
    success: true,
    data: list,
  });
});

exports.getAskedQuestionById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const text = await AskedQuestion.findByPk(id);
  if (!text) {
    throw new ApiError(404, "Asked Question not found");
  }
  res.status(200).json({
    success: true,
    data: text,
  });
});

exports.createAskedQuestion = catchAsync(async (req, res) => {
  const { Question, Answer, AskedQuestionCategory } = req.body;
  const list = await AskedQuestion.create({
    Question,
    Answer,
    AskedQuestionCategory,
  });
  res.status(200).json({
    success: true,
    data: list,
  });
});

exports.updateAskedQuestion = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { Question, Answer, AskedQuestionCategory, updatedAt } = req.body;
  const text = await AskedQuestion.findByPk(id);
  if (!text) {
    throw new ApiError(404, "AskedQuestion not found");
  }
  await AskedQuestion.update(
    { Question, Answer, AskedQuestionCategory, updatedAt },
    {
      where: {
        id,
      },
    }
  );
  res.status(200).json({
    success: true,
    message: "update success",
  });
});
exports.deleteAskedQuestion = catchAsync(async (req, res) => {
  const { id } = req.params;
  const text = await AskedQuestion.findByPk(id);
  if (!text) {
    throw new ApiError(404, "AskedQuestion not found");
  }
  await AskedQuestion.destroy({
    where: {
      id,
    },
  });
  res.status(200).json({
    success: true,
    message: "delete success",
  });
});

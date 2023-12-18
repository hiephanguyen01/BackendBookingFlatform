const sharp = require("sharp");
const catchAsync = require("../middlewares/async");
const { AffiliatePublisherWebsite, AppBinaryObject } = require("../models");
const ApiError = require("../utils/ApiError");
const stream = require("stream");
const Jimp = require("jimp");
const path = require("path");
const fs = require("fs");

exports.connect = catchAsync(async (req, res) => {
  const isGood = await AffiliatePublisherWebsite.update(
    {
      isConnected: true,
    },
    {
      where: {
        link: req.headers.referer,
        // token: md5(req.headers.referer + "92019201"),
      },
    }
  );
  if (isGood) {
    return res.json({ ok: "not oke" });
  }
  res.json({ ok: "ok" });
});

exports.create = catchAsync(async (req, res) => {
  let { link } = req.body;
  if (link[link.length - 1] !== "/") {
    link = link + "/";
  }
  if (!link) {
    throw new ApiError(500, "Link không thể bỏ trống");
  }
  const isExisted = await AffiliatePublisherWebsite.findOne({
    where: {
      link,
    },
  });
  if (isExisted) {
    throw new ApiError(500, "Link này đã sử dụng vui lòng kiểm tra lại");
  }

  const data = await AffiliatePublisherWebsite.create({
    link,
    affiliateUserId: req?.user?.id || 8,
    isConnected: false,
  });
  res.json(data);
});

exports.image = catchAsync(async (req, res) => {
  const { width, height } = req.query;
  const { id } = req.params;
  const isValid = await AffiliatePublisherWebsite.findOne({
    where: {
      link: req.headers.referer || "",
      isConnected: true,
    },
  });
  if (Boolean(isValid)) {
    const data = await AppBinaryObject.findByPk(id);
    if (!data) throw new ApiError(404, "Image not found");

    let input = await Jimp.read(data.dataValues.Bytes);
    let logo = await Jimp.read(path.join(__dirname, "../default/Logo.png"));

    logo.resize(input.bitmap.width / 5, Jimp.AUTO);
    if (height !== "undefined" && width !== "undefined") {
      if (input.bitmap.height > input.bitmap.width) {
        input
          .composite(
            logo,
            input.bitmap.width - logo.bitmap.width,
            input.bitmap.height - logo.bitmap.height,
            {
              mode: Jimp.BLEND_SOURCE_OVER,
              opacitySource: 0.8,
            }
          )
          .resize(Jimp.AUTO, +height)
          .background(0xffffffff)
          .contain(+width, +height);
      } else {
        input
          .composite(
            logo,
            input.bitmap.width - logo.bitmap.width,
            input.bitmap.height - logo.bitmap.height,
            {
              mode: Jimp.BLEND_SOURCE_OVER,
              opacitySource: 0.8,
            }
          )
          .resize(+width, +height);
      }
    } else {
      input.composite(
        logo,
        input.bitmap.width - logo.bitmap.width,
        input.bitmap.height - logo.bitmap.height,
        {
          mode: Jimp.BLEND_SOURCE_OVER,
          opacitySource: 0.8,
        }
      );
    }
    const bufferStream = new stream.PassThrough();
    input.getBuffer(Jimp.MIME_JPEG, (error, buffer) => {
      if (error) {
        console.error(error);
        return;
      }
      return bufferStream.end(buffer).pipe(res);
    });
  } else {
    const defaut = fs.readFileSync(
      path.join(__dirname, "../default/default.png")
    );
    const bufferStream = new stream.PassThrough();
    return bufferStream.end(Buffer.from(defaut)).pipe(res);
  }
});

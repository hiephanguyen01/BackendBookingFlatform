const { PhotographerAlbum, MakeupAlbum, ModelAlbum } = require("../models");
const catchAsync = require("../middlewares/async");

exports.updateAlbumView = catchAsync(async (req, res) => {
  const { Id, Category } = req.body;
  let Album;

  switch (+Category) {
    case 2:
      Album = await PhotographerAlbum.findByPk(Id);
      await PhotographerAlbum.update(
        {
          View: Album.toJSON().View + 1,
        },
        { where: { Id } }
      );
      break;
    case 4:
      Album = await MakeupAlbum.findByPk(Id);
      await MakeupAlbum.update(
        {
          View: Album.toJSON().View + 1,
        },
        { where: { Id } }
      );
      break;
    case 6:
      Album = await ModelAlbum.findByPk(Id);
      await ModelAlbum.update(
        {
          View: Album.toJSON().View + 1,
        },
        { where: { Id } }
      );
      break;

    default:
      break;
  }

  res.status(200).json({
    success: true,
    message: "Success",
  });
});

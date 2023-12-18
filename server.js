require("dotenv").config();
const express = require("express");
const { sequelize } = require("./models");
const swaggerJsDOc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const cors = require("cors");
const catchError = require("./middlewares/error");
const { rootRouter } = require("./routes");
const postmanToOpenApi = require("postman-to-openapi");
const cookieParser = require("cookie-parser");
const stream = require("stream");
const { Server } = require("socket.io");
const sharp = require("sharp");
const MailSevice = require("./utils/MailService");
const { AppBinaryObject, CssFile } = require("./models");
const catchAsync = require("./middlewares/async");
const ApiError = require("./utils/ApiError");
const fs = require("fs");
var cron = require("node-cron");
const SyncStatistic = require("./utils/SyncStatistic");
const AffiliateSyncStatistic = require("./utils/SyncAffiliateStatistic");
const SyncBookingStatus = require("./utils/SyncBookingStatus");
// postman
const postmanCollection =
  "./apis/BOOKINGSTUDIO_BACKEND.postman_collection.json";
const outputFile = "./apis/collection.yml";
postmanToOpenApi(postmanCollection, outputFile, { defaultTag: "General" });
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//////////////////
const http = require("http");
const path = require("path");
const baseController = require("./utils/BaseController");
const { socketNotification } = require("./utils/socketNotification");
const SyncCancelBooking = require("./utils/SyncCancleBooking");
const syncKeyWordPost = require("./utils/SyncKeyWord");
const sendingNotificationTask = require("./utils/SyncNotification");
const upload = require("./middlewares/upload");
const server = http.createServer(app);
const io = new Server(server, {
  maxHttpBufferSize: 1e8,
  cors: {
    methods: ["GET", "POST"],
  },
});
MailSevice.init();

//////////////////////////////////
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Library API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3003",
      },
    ],
  },
  apis: ["./apis/collection.yml"],
};

const swaggerDocs = swaggerJsDOc(swaggerOptions);
app.use(express.static(path.join(__dirname, "dist")));
app.get(/^\/(?!.*api)/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use("/api", rootRouter);
app.get(
  "/api/image/:id",
  catchAsync(async (req, res) => {
    const { token1, token2, ts, width, height } = req.query;
    const isValid = baseController.tokenImage(
      {
        token1,
        token2,
        ts,
      },
      req.params.id
    );
    const bufferStream = new stream.PassThrough();
    if (isValid) {
      const data = await AppBinaryObject.findByPk(req.params.id);
      if (!data) throw new ApiError(404, "Image not found");
      if (height || width) {
        return sharp(data.dataValues.Bytes)
          .resize(Number(width), Number(height))
          .png()
          .toBuffer()
          .then((data) => {
            const bufferStream = new stream.PassThrough();
            bufferStream.end(Buffer.from(data)).pipe(res);
          })
          .catch((err) => console.log(err));
      }
      return bufferStream.end(Buffer.from(data.dataValues.Bytes)).pipe(res);
    } else {
      const defaut = fs.readFileSync("./default/default.png");
      return bufferStream.end(Buffer.from(defaut)).pipe(res);
    }
  })
);
app.get(
  "/api/image-email/:id",
  catchAsync(async (req, res) => {
    const bufferStream = new stream.PassThrough();
    const data = await AppBinaryObject.findByPk(req.params.id);
    if (!data) throw new ApiError(404, "Image not found");
    return bufferStream.end(Buffer.from(data.dataValues.Bytes)).pipe(res);
  })
);

app.get(
  "/api/css/:id",
  catchAsync(async (req, res) => {
    const data = await CssFile.findByPk(req.params.id);
    if (!data) {
      throw new ApiError(404, "Image not found");
    }
    const bufferStream = new stream.PassThrough();
    bufferStream.end(Buffer.from(data.dataValues.CssFile)).pipe(res);
  })
);

app.get(
  "/api/download/css/:id",
  catchAsync(async (req, res) => {
    const data = await CssFile.findByPk(req.params.id);
    if (!data) {
      throw new ApiError(404, "Image not found");
    }
    res.set(
      "Content-disposition",
      "attachment; filename=" + data.dataValues.Name
    );
    res.set("Content-Type", "text/plain");
    res.send(Buffer.from(data.dataValues.CssFile));
  })
);
app.post(
  "/api/image-upload",
  upload.single("image"),
  catchAsync(async (req, res) => {
    const image = req?.file ? req?.file : null;
    const imageRes = await AppBinaryObject.create({
      Bytes: image.buffer,
      Description: "image" + image.originalname,
    });
    res.send({
      cdnUrl: `https://am.bookingstudio.vn/api/image-email/${imageRes.Id}`,
    });
  })
);
app.use(catchError);

socketNotification(io);

server.listen(process.env.PORT || 3003, async () => {
  try {
    await sequelize.authenticate();
    cron.schedule(
      "45 23 * * *",
      async () => {
        await Promise.all([
          SyncBookingStatus(),
          SyncStatistic(),
          AffiliateSyncStatistic(),
          syncKeyWordPost(),
        ]);
        const ram = process.memoryUsage();
        console.log("🚀 ~ ram", ram);
      },
      {
        timezone: "Asia/Ho_Chi_Minh",
      }
    );
    cron.schedule(
      "* * * * *",
      async () => {
        await Promise.all([SyncCancelBooking(), sendingNotificationTask()]);
      },
      {
        timezone: "Asia/Ho_Chi_Minh",
      }
    );
    console.log("DB:connected");
  } catch (error) {
    console.log("Unable to connect to the database:", error);
  }
  console.log(`PORT:${process.env.PORT || 3003}`);
});

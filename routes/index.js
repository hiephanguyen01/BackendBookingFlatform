const express = require("express");
const { router: districtRouter } = require("./districtRoute");
const { router: bookingUserRouter } = require("./bookingUserRoute");
const { router: studioPostRouter } = require("./studioPostRoute");
const { router: registerPartnerRouter } = require("./registerPartnerRoute");
const { router: bookingRouter } = require("./bookingRoute");
const { router: filterRouter } = require("./filterRoute");
const { router: room } = require("./roomRoute");
const { router: postPostRoute } = require("./postRoute");
const { router: ratingReportRoute } = require("./RatingReportRoute");
const { router: adminNotificationRoute } = require("./adminNotificationRoute");
const { router: commentRoute } = require("./commentRoute");
const { router: likeRoute } = require("./likeRoute");
const { router: scheduleRoute } = require("./scheduleRoute");
const { router: authRoute } = require("./authRoute");
const { router: adminNotificationKey } = require("./adminNotificationKey");
const { router: chatRoute } = require("./chatRoute");
const { router: provincesRouter } = require("./provincesRoute");
const { router: wardsRouter } = require("./wardRoute");
const { router: cssFileRoute } = require("./cssFileRoute");
const { router: SMTPRoute } = require("./SMTPRoute");
const { router: webhookRoute } = require("./webhookRoute");
const { router: statistic } = require("./statisticRoute");
const { router: postReport } = require("./postReportRoute");
const { router: retrictedWord } = require("./retrictedWordRoute");
const { router: visitor } = require("./countVisitor");
const { router: savePost } = require("./savePostRoute");
const { router: promoCodeRoute } = require("./promoCodeRoute");
const { router: myRatings } = require("./myRatingsRoute");
const { router: PhotographerPostsRoute } = require("./PhotographerPostsRoute");
const { router: modelPostRoute } = require("./modelPostRoute");
const { router: MakeupPost } = require("./MakeupPostRoute");
const { router: DevicePosts } = require("./DevicePostsRoute");
const { router: ClothesPost } = require("./ClothesPostRoute");
const { router: AskedQuestion } = require("./askedQuestionRoute");
const { router: albumRoute } = require("./albumRoute");
const { router: daoReport } = require("./daoReport");
const { router: userComment } = require("./userCommentRoute");
const { router: bannerRoute } = require("./bannerRoute");
const { router: bankRoute } = require("./bankRoute");
const { router: flowWebhookRoute } = require("./FlowWebhookRoute");
const { router: adminAccountRoute } = require("./adminAccountRoute");
const { router: affiliateUserRoute } = require("./affiliateUserRoute");
const { router: shopRoute } = require("./shopRoute");
const { router: affiliatePaymentRoute } = require("./affiliatePaymentRoute");

const { router: hotKeyRoute } = require("./hotKeyRoute");
const { router: mailService } = require("./mailServiceRoute");
const { router: wordRoute } = require("./wordRoute");
const { router: cartRoute } = require("./cartRoute");
const { router: mailBoxRoute } = require("./mailBoxRoute");
const { router: partnerHubSupportRoute } = require("./partnerHubSupportRoute");
const {
  router: partnerHubSolutionRoute,
} = require("./partnerHubSolutionRoute");
const {
  router: partnerHubTrendNewsRoute,
} = require("./partnerHubTrendNewsRoute");
const {
  router: affiliateLinkConnectorRoute,
} = require("./affiliateLinkConnectorRoute");
const { sequelize, MakeupRating, StudioRating } = require("../models");
const rootRouter = express.Router();

rootRouter.get("/test-rating", async (req, res) => {
  const data = await MakeupRating.findAll();
  res.status(200).json({
    data,
  });
});
rootRouter.use("/booking-user", bookingUserRouter);
rootRouter.use("/studio-post", studioPostRouter);
rootRouter.use("/register-partner", registerPartnerRouter);
rootRouter.use("/booking", bookingRouter);
rootRouter.use("/filter", filterRouter);
rootRouter.use("/room", room);
rootRouter.use("/post-post", postPostRoute);
rootRouter.use("/rating&report", ratingReportRoute);
rootRouter.use("/notification", adminNotificationRoute);
rootRouter.use("/comment", commentRoute);
rootRouter.use("/like", likeRoute);
rootRouter.use("/schedule", scheduleRoute);
rootRouter.use("/notification-key", adminNotificationKey);
rootRouter.use("/auth", authRoute);
rootRouter.use("/chat", chatRoute);
rootRouter.use("/provinces", provincesRouter);
rootRouter.use("/districts", districtRouter);
rootRouter.use("/wards", wardsRouter);
rootRouter.use("/css-file", cssFileRoute);
rootRouter.use("/smtp", SMTPRoute);
rootRouter.use("/webhook", webhookRoute);
rootRouter.use("/statistic", statistic);
rootRouter.use("/post-report", postReport);
rootRouter.use("/restricted-word", retrictedWord);
rootRouter.use("/count-visitor", visitor);
rootRouter.use("/save-post", savePost);
rootRouter.use("/promo-code", promoCodeRoute);
rootRouter.use("/my-ratings", myRatings);
rootRouter.use("/photographer", PhotographerPostsRoute);
rootRouter.use("/model", modelPostRoute);
rootRouter.use("/makeup", MakeupPost);
rootRouter.use("/device", DevicePosts);
rootRouter.use("/clothes", ClothesPost);
rootRouter.use("/asked-question", AskedQuestion);
rootRouter.use("/album", albumRoute);
rootRouter.use("/dao-report", daoReport);
rootRouter.use("/user-comment", userComment);
rootRouter.use("/banner", bannerRoute);
rootRouter.use("/bank", bankRoute);
rootRouter.use("/flow-webhook", flowWebhookRoute);
rootRouter.use("/admin", adminAccountRoute);
rootRouter.use("/affiliate", affiliateUserRoute);
rootRouter.use("/hot-key", hotKeyRoute);
rootRouter.use("/affiliate-connect", affiliateLinkConnectorRoute);
rootRouter.use("/mail-service", mailService);
rootRouter.use("/shop", shopRoute);
rootRouter.use("/affiliate-payment", affiliatePaymentRoute);
rootRouter.use("/word", wordRoute);
rootRouter.use("/cart", cartRoute);
rootRouter.use("/mail", mailBoxRoute);
rootRouter.use("/partner-hub-support", partnerHubSupportRoute);
rootRouter.use("/partner-hub-solution", partnerHubSolutionRoute);
rootRouter.use("/partner-hub-trend-news", partnerHubTrendNewsRoute);

module.exports = {
  rootRouter,
};

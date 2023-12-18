const {
  Cart,
  BookingUser,
  CartItem,
  StudioPost,
  ClothesPost,
  ModelPost,
  StudioRoom,
  ScheduleAndPriceStudioByDate,
  ScheduleAndPricePhotographerByDate,
  ScheduleAndPriceClothesByDate,
  ScheduleAndPriceDeviceByDate,
  ScheduleAndPriceMakeupByDate,
  ScheduleAndPriceModelByDate,
  RegisterPartner,
  PhotographerPost,
  PhotographerServicePackage,
  ModelServicePackage,
  MakeupPost,
  MakeupServicePackage,
} = require("../models");
const catchAsync = require("../middlewares/async");
const moment = require("moment");
const baseController = require("../utils/BaseController");
const { ImageListDestructure } = require("../utils/ListWithImageDestructure");
const { Op } = require("sequelize");
const ApiError = require("../utils/ApiError");

const changeIdtoidKeyInObject = (obj) => {
  obj["id"] = obj["Id"];
  delete obj["Id"];
  return obj;
};

exports.addServiceToCart = catchAsync(async (req, res) => {
  /**  Adds a service to the cart.

  * Args:
  *  req.body:
  *   category: The category of the service.
  *   category_post_id: The ID of the category post.
  *   service_id: The ID of the service.
  *   order_by_time: Whether to order by time.
  *   order_by_time_from: The start time of the order.
  *   order_by_time_to: The end time of the order.
  *   order_by_date_from: The start date of the order.
  *   order_by_date_to: The end date of the order.
  *   Size: Clothes size
  *   Amount: Clothes/Device AMount
  *   Color: Clothes color

  * Returns:
  *   A boolean indicating whether the service was added to the cart successfully.
  */
  const {
    category,
    CategoryPostId,
    serviceId,
    OrderByTime,
    OrderByTimeFrom,
    OrderByTimeTo,
    OrderByDateFrom,
    OrderByDateTo,
  } = req.body;

  const user = req.user;
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  let cart = await Cart.findOne({ where: { BookingUserId: user?.id } });
  if (!cart) {
    cart = await Cart.create({ BookingUserId: user?.id });
    await BookingUser.update(
      { CartId: cart?.dataValues?.id },
      { where: { Id: user?.id } }
    );
  }

  let cartItem = {
    CartId: cart?.dataValues?.id,
    Category: +category,
    OrderByTime,
    OrderByTimeFrom,
    OrderByTimeTo,
    OrderByDateFrom,
    OrderByDateTo,
  };
  let newCartItem, findCartItem;
  switch (+category) {
    case 1:
      findCartItem = await CartItem.findOne({
        where: {
          ...(OrderByTime
            ? { OrderByTimeFrom, OrderByTimeTo }
            : { OrderByDateFrom, OrderByDateTo }),
          RoomId: serviceId,
          StudioPostId: CategoryPostId,
        },
      });
      if (!findCartItem) {
        cartItem = {
          ...cartItem,
          RoomId: serviceId,
          StudioPostId: CategoryPostId,
        };
        newCartItem = await CartItem.create(cartItem);
      }

      break;
    case 2:
      findCartItem = await CartItem.findOne({
        where: {
          ...(OrderByTime
            ? { OrderByTimeFrom, OrderByTimeTo }
            : { OrderByDateFrom, OrderByDateTo }),
          ServiceId: serviceId,
          PhotographerPostId: CategoryPostId,
        },
      });
      if (!findCartItem) {
        cartItem = {
          ...cartItem,
          ServiceId: serviceId,
          PhotographerPostId: CategoryPostId,
        };
        newCartItem = await CartItem.create(cartItem);
      }

      break;
    case 3:
      findCartItem = await CartItem.findOne({
        where: {
          ...(OrderByTime
            ? { OrderByTimeFrom, OrderByTimeTo }
            : { OrderByDateFrom, OrderByDateTo }),
          ServiceId: serviceId,
          ClothesPostId: CategoryPostId,
        },
      });
      if (!findCartItem) {
        cartItem = {
          ...cartItem,
          Size: req.body.Size,
          Color: req.body.Color,
          Amount: req.body.Amount,
          ServiceId: serviceId,
          ClothesPostId: CategoryPostId,
        };
        newCartItem = await CartItem.create(cartItem);
      }
      break;
    case 4:
      findCartItem = await CartItem.findOne({
        where: {
          ...(OrderByTime
            ? { OrderByTimeFrom, OrderByTimeTo }
            : { OrderByDateFrom, OrderByDateTo }),
          ServiceId: serviceId,
          MakeupPostId: CategoryPostId,
        },
      });
      if (!findCartItem) {
        cartItem = {
          ...cartItem,
          ServiceId: serviceId,
          MakeupPostId: CategoryPostId,
        };
        newCartItem = await CartItem.create(cartItem);
      }
      break;
    case 5:
      findCartItem = await CartItem.findOne({
        where: {
          ...(OrderByTime
            ? { OrderByTimeFrom, OrderByTimeTo }
            : { OrderByDateFrom, OrderByDateTo }),
          ServiceId: serviceId,
          DevicePostId: CategoryPostId,
        },
      });
      if (!findCartItem) {
        cartItem = {
          ...cartItem,
          ServiceId: serviceId,
          DevicePostId: CategoryPostId,
        };
        newCartItem = await CartItem.create(cartItem);
      }
      break;
    case 6:
      findCartItem = await CartItem.findOne({
        where: {
          ...(OrderByTime
            ? { OrderByTimeFrom, OrderByTimeTo }
            : { OrderByDateFrom, OrderByDateTo }),
          ServiceId: serviceId,
          ModelPostId: CategoryPostId,
        },
      });
      if (!findCartItem) {
        cartItem = {
          ...cartItem,
          ServiceId: serviceId,
          ModelPostId: CategoryPostId,
        };
        newCartItem = await CartItem.create(cartItem);
      }
      break;

    default:
      break;
  }
  res.status(200).send({
    success: true,
    ...(newCartItem
      ? {
          message: "Thêm vào giỏ hàng thành công!",
          data: { cartItemId: newCartItem?.dataValues?.id },
        }
      : {
          message: "Dịch vụ đã có trong giỏ hàng!",
          data: { cartItemId: findCartItem?.dataValues?.id },
        }),
  });
});

exports.removeServiceFromCart = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  let cart = await Cart.findOne({ where: { BookingUserId: user?.id } });
  await CartItem.destroy({ where: { CartId: cart?.dataValues?.id, id: id } });
  res.status(200).send({ success: true });
});

exports.getCartItemByCategory = catchAsync(async (req, res) => {
  const { category } = req.query;
  const user = req.user;
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  let cart = await Cart.findOne({ where: { BookingUserId: user?.id } });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }
  let cartItemByCategory, results;
  switch (+category) {
    case 1:
      cartItemByCategory = await CartItem.findAll({
        where: { CartId: cart?.dataValues?.id, Category: +category },
        include: [
          {
            model: StudioPost,
            attributes: ["Id", "Name"],
            include: [{ model: RegisterPartner, attributes: ["id"] }],
          },
          {
            model: StudioRoom,
            attributes: [
              "Id",
              "Name",
              "PriceByDate",
              "PriceByHour",
              "Image1",
              "FreeCancelByDate",
              "FreeCancelByHour",
              "AffiliateCommissionByHour",
              "AffiliateCommissionByDate",
            ],
          },
        ],
      });
      results = await Promise.all(
        cartItemByCategory.map(async (item) => {
          const cartItem = item?.dataValues;
          const dates = Boolean(cartItem?.OrderByTime)
            ? [
                moment(cartItem?.OrderByTimeFrom).format(),
                moment(cartItem?.OrderByTimeTo).format(),
              ]
            : [
                moment(cartItem?.OrderByDateFrom).format(),
                moment(cartItem?.OrderByDateTo).format(),
              ];
          const rs = await ScheduleAndPriceStudioByDate.findAll({
            where: {
              DateTime: { [Op.between]: dates },
              RoomId: cartItem.RoomId,
            },
          });

          let price = 0;
          if (rs.length === 0) {
            price = cartItem?.OrderByTime
              ? cartItem?.StudioRoom?.dataValues?.PriceByHour *
                (moment(cartItem?.OrderByTimeTo).utc().hour() -
                  moment(cartItem?.OrderByTimeFrom).utc().hour())
              : cartItem?.StudioRoom?.dataValues?.PriceByDate *
                (moment(cartItem?.OrderByDateTo).utc().date() -
                  moment(cartItem?.OrderByDateFrom).utc().date() +
                  1);
          } else {
            if (cartItem?.OrderByTime) {
              price =
                rs[0]?.dataValues?.PriceByHour *
                (moment(cartItem?.OrderByTimeTo).utc().hour() -
                  moment(cartItem?.OrderByTimeFrom).utc().hour());
            } else {
              price = rs.reduce(
                (total, r) => total + r?.dataValues?.PriceByDate,
                0
              );
              price +=
                cartItem?.StudioRoom?.dataValues?.PriceByDate *
                (moment(cartItem?.OrderByDateTo).utc().date() -
                  moment(cartItem?.OrderByDateFrom).utc().date() +
                  1 -
                  rs.length);
            }
          }
          return { ...cartItem, price: price };
        })
      );

      results = results.reduce((acc, item) => {
        const studioPost = item.StudioPost.dataValues;
        // Kiểm tra xem studioId đã tồn tại trong kết quả chưa
        const existingItem = acc.find((i) => i.Id === studioPost.Id);

        if (existingItem) {
          // Nếu studioId đã tồn tại, thêm thông tin phòng vào mảng 'Room'
          existingItem.Services.push(item);
        } else {
          // Nếu studioId chưa tồn tại, tạo một mục mới với thông tin Studio và Room đầu tiên
          acc.push({
            ...studioPost,
            Services: [item],
          });
        }
        delete item.StudioPost;
        return acc;
      }, []);
      break;
    case 2:
      cartItemByCategory = await CartItem.findAll({
        where: { CartId: cart?.dataValues?.id, Category: +category },
        include: [
          {
            model: PhotographerPost,
            attributes: ["Id", "Name"],
            include: [{ model: RegisterPartner, attributes: ["id"] }],
          },
          {
            model: PhotographerServicePackage,
            attributes: [
              "Id",
              "Name",
              "PriceByDate",
              "PriceByHour",
              "Image1",
              "FreeCancelByDate",
              "FreeCancelByHour",
              "AffiliateCommissionByHour",
              "AffiliateCommissionByDate",
            ],
          },
        ],
      });
      results = await Promise.all(
        cartItemByCategory.map(async (item) => {
          const cartItem = item?.dataValues;
          const dates = Boolean(cartItem?.OrderByTime)
            ? [
                moment(cartItem?.OrderByTimeFrom).format(),
                moment(cartItem?.OrderByTimeTo).format(),
              ]
            : [
                moment(cartItem?.OrderByDateFrom).format(),
                moment(cartItem?.OrderByDateTo).format(),
              ];
          const rs = await ScheduleAndPricePhotographerByDate.findAll({
            where: {
              DateTime: { [Op.between]: dates },
              ServiceId: cartItem.ServiceId,
            },
          });

          let price = 0;
          if (rs.length === 0) {
            price = cartItem?.OrderByTime
              ? cartItem?.PhotographerServicePackage?.dataValues?.PriceByHour *
                (moment(cartItem?.OrderByTimeTo).utc().hour() -
                  moment(cartItem?.OrderByTimeFrom).utc().hour())
              : cartItem?.StudioRoom?.dataValues?.PriceByDate *
                (moment(cartItem?.OrderByDateTo).utc().date() -
                  moment(cartItem?.OrderByDateFrom).utc().date() +
                  1);
          } else {
            if (cartItem?.OrderByTime) {
              price =
                rs[0]?.dataValues?.PriceByHour *
                (moment(cartItem?.OrderByTimeTo).utc().hour() -
                  moment(cartItem?.OrderByTimeFrom).utc().hour());
            } else {
              price = rs.reduce(
                (total, r) => total + r?.dataValues?.PriceByDate,
                0
              );
              price +=
                cartItem?.PhotographerServicePackage?.dataValues?.PriceByDate *
                (dates.length - rs.length);
            }
          }
          return { ...cartItem, price: price };
        })
      );

      results = results.reduce((acc, item) => {
        let photographerPost = item.PhotographerPost.dataValues;
        // Kiểm tra xem studioId đã tồn tại trong kết quả chưa
        const existingItem = acc.find((i) => i.Id === photographerPost.Id);

        if (existingItem) {
          // Nếu studioId đã tồn tại, thêm thông tin phòng vào mảng 'Room'
          existingItem.Services.push(item);
        } else {
          // Nếu studioId chưa tồn tại, tạo một mục mới với thông tin Studio và Room đầu tiên
          photographerPost = changeIdtoidKeyInObject(photographerPost);
          acc.push({
            ...photographerPost,
            Services: [item],
          });
        }
        delete item.PhotographerPost;
        return acc;
      }, []);
      break;
    case 3:
      cartItemByCategory = await CartItem.findAll({
        where: { CartId: cart?.dataValues?.id, Category: +category },
        include: [
          {
            model: ClothesPost,
            attributes: ["Id", "Name", "PriceByHour", "PriceByDate", "Image1"],
            include: [{ model: RegisterPartner, attributes: ["id"] }],
          },
        ],
      });
      results = await Promise.all(
        cartItemByCategory.map(async (item) => {
          const cartItem = item?.dataValues;
          const dates = Boolean(cartItem?.OrderByTime)
            ? [
                moment(cartItem?.OrderByTimeFrom).format(),
                moment(cartItem?.OrderByTimeTo).format(),
              ]
            : [
                moment(cartItem?.OrderByDateFrom).format(),
                moment(cartItem?.OrderByDateTo).format(),
              ];
          const rs = await ScheduleAndPriceClothesByDate.findAll({
            where: {
              DateTime: { [Op.between]: dates },
              ServiceId: cartItem.ServiceId,
            },
          });

          let price = 0;
          if (rs.length === 0) {
            price = cartItem?.OrderByTime
              ? cartItem?.ClothesPost?.dataValues?.PriceByHour *
                (moment(cartItem?.OrderByTimeTo).utc().hour() -
                  moment(cartItem?.OrderByTimeFrom).utc().hour())
              : cartItem?.ClothesPost?.dataValues?.PriceByDate *
                (moment(cartItem?.OrderByDateTo).utc().date() -
                  moment(cartItem?.OrderByDateFrom).utc().date() +
                  1);
          } else {
            if (cartItem?.OrderByTime) {
              price =
                rs[0]?.dataValues?.PriceByHour *
                (moment(cartItem?.OrderByTimeTo).utc().hour() -
                  moment(cartItem?.OrderByTimeFrom).utc().hour());
            } else {
              price = rs.reduce(
                (total, r) => total + r?.dataValues?.PriceByDate,
                0
              );
              price +=
                cartItem?.ClothesPost?.dataValues?.PriceByDate *
                (dates.length - rs.length);
            }
          }
          return { ...cartItem, price: price };
        })
      );
      results = results.reduce((acc, item) => {
        let clothesPost = item.ClothesPost.dataValues;
        // Kiểm tra xem studioId đã tồn tại trong kết quả chưa
        const existingItem = acc.find((i) => i.Id === clothesPost.Id);

        if (existingItem) {
          // Nếu studioId đã tồn tại, thêm thông tin phòng vào mảng 'Room'
          existingItem.Services.push(item);
        } else {
          // Nếu studioId chưa tồn tại, tạo một mục mới với thông tin Studio và Room đầu tiên
          clothesPost = changeIdtoidKeyInObject(clothesPost);
          acc.push({
            ...clothesPost,
            Services: [item],
          });
        }
        delete item.ClothesPost;
        return acc;
      }, []);
      break;
    case 4:
      cartItemByCategory = await CartItem.findAll({
        where: { CartId: cart?.dataValues?.id, Category: +category },
        include: [
          {
            model: MakeupPost,
            attributes: ["Id", "Name", ["Image1", "Image"]],
            include: [{ model: RegisterPartner, attributes: ["id"] }],
          },
          {
            model: MakeupServicePackage,
            attributes: [
              "Id",
              "Name",
              "PriceByDate",
              "PriceByHour",
              "Image1",
              "FreeCancelByDate",
              "FreeCancelByHour",
              "AffiliateCommissionByHour",
              "AffiliateCommissionByDate",
            ],
          },
        ],
      });
      results = await Promise.all(
        cartItemByCategory.map(async (item) => {
          const cartItem = item?.dataValues;
          const dates = Boolean(cartItem?.OrderByTime)
            ? [
                moment(cartItem?.OrderByTimeFrom).format(),
                moment(cartItem?.OrderByTimeTo).format(),
              ]
            : [
                moment(cartItem?.OrderByDateFrom).format(),
                moment(cartItem?.OrderByDateTo).format(),
              ];
          const rs = await ScheduleAndPriceModelByDate.findAll({
            where: {
              DateTime: { [Op.between]: dates },
              ServiceId: cartItem.ServiceId,
            },
          });

          let price = 0;
          if (rs.length === 0) {
            price = cartItem?.OrderByTime
              ? cartItem?.MakeupServicePackage?.dataValues?.PriceByHour *
                (moment(cartItem?.OrderByTimeTo).utc().hour() -
                  moment(cartItem?.OrderByTimeFrom).utc().hour())
              : cartItem?.MakeupServicePackage?.dataValues?.PriceByDate *
                (moment(cartItem?.OrderByDateTo).utc().date() -
                  moment(cartItem?.OrderByDateFrom).utc().date() +
                  1);
          } else {
            if (cartItem?.OrderByTime) {
              price =
                rs[0]?.dataValues?.PriceByHour *
                (moment(cartItem?.OrderByTimeTo).utc().hour() -
                  moment(cartItem?.OrderByTimeFrom).utc().hour());
            } else {
              price = rs.reduce(
                (total, r) => total + r?.dataValues?.PriceByDate,
                0
              );
              price +=
                cartItem?.MakeupServicePackage?.dataValues?.PriceByDate *
                (dates.length - rs.length);
            }
          }
          return { ...cartItem, price: price };
        })
      );

      results = results.reduce((acc, item) => {
        const makeupPost = item.MakeupPost.dataValues;
        // Kiểm tra xem studioId đã tồn tại trong kết quả chưa
        const existingItem = acc.find((i) => i.Id === makeupPost.Id);

        if (existingItem) {
          // Nếu studioId đã tồn tại, thêm thông tin phòng vào mảng 'Room'
          existingItem.Services.push(item);
        } else {
          // Nếu studioId chưa tồn tại, tạo một mục mới với thông tin Studio và Room đầu tiên
          acc.push({
            ...makeupPost,
            Services: [item],
          });
        }
        delete item.makeupPost;
        return acc;
      }, []);

      break;
    case 5:
      break;
    case 6:
      cartItemByCategory = await CartItem.findAll({
        where: { CartId: cart?.dataValues?.id, Category: +category },
        include: [
          {
            model: ModelPost,
            attributes: ["Id", "Name", ["Image1", "Image"]],
            include: [{ model: RegisterPartner, attributes: ["id"] }],
          },
          {
            model: ModelServicePackage,
            attributes: [
              "Id",
              "Name",
              "PriceByDate",
              "PriceByHour",
              "Image1",
              "FreeCancelByDate",
              "FreeCancelByHour",
              "AffiliateCommissionByHour",
              "AffiliateCommissionByDate",
            ],
          },
        ],
      });
      results = await Promise.all(
        cartItemByCategory.map(async (item) => {
          const cartItem = item?.dataValues;
          const dates = Boolean(cartItem?.OrderByTime)
            ? [
                moment(cartItem?.OrderByTimeFrom).format(),
                moment(cartItem?.OrderByTimeTo).format(),
              ]
            : [
                moment(cartItem?.OrderByDateFrom).format(),
                moment(cartItem?.OrderByDateTo).format(),
              ];
          const rs = await ScheduleAndPriceModelByDate.findAll({
            where: {
              DateTime: { [Op.between]: dates },
              ServiceId: cartItem.ServiceId,
            },
          });

          let price = 0;
          if (rs.length === 0) {
            price = cartItem?.OrderByTime
              ? cartItem?.ModelServicePackage?.dataValues?.PriceByHour *
                (moment(cartItem?.OrderByTimeTo).utc().hour() -
                  moment(cartItem?.OrderByTimeFrom).utc().hour())
              : cartItem?.ModelServicePackage?.dataValues?.PriceByDate *
                (moment(cartItem?.OrderByDateTo).utc().date() -
                  moment(cartItem?.OrderByDateFrom).utc().date() +
                  1);
          } else {
            if (cartItem?.OrderByTime) {
              price =
                rs[0]?.dataValues?.PriceByHour *
                (moment(cartItem?.OrderByTimeTo).utc().hour() -
                  moment(cartItem?.OrderByTimeFrom).utc().hour());
            } else {
              price = rs.reduce(
                (total, r) => total + r?.dataValues?.PriceByDate,
                0
              );
              price +=
                cartItem?.ModelServicePackage?.dataValues?.PriceByDate *
                (dates.length - rs.length);
            }
          }
          return { ...cartItem, price: price };
        })
      );

      results = results.reduce((acc, item) => {
        const modelPost = item.ModelPost.dataValues;
        // Kiểm tra xem studioId đã tồn tại trong kết quả chưa
        const existingItem = acc.find((i) => i.Id === modelPost.Id);

        if (existingItem) {
          // Nếu studioId đã tồn tại, thêm thông tin phòng vào mảng 'Room'
          existingItem.Services.push(item);
        } else {
          // Nếu studioId chưa tồn tại, tạo một mục mới với thông tin Studio và Room đầu tiên
          acc.push({
            ...modelPost,
            Services: [item],
          });
        }
        delete item.ModelPost;
        return acc;
      }, []);

      break;

    default:
      break;
  }
  res.status(200).send({ success: true, data: results });
});

exports.getCartItemCheckout = catchAsync(async (req, res) => {
  const cartItems = JSON.parse(req.query.cartItems);
  console.log(cartItems);
  const user = req.user;
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  let cart = await Cart.findOne({ where: { BookingUserId: user?.id } });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }
  let allCartItemChoose, results;
  allCartItemChoose = await Promise.all(
    cartItems.map(async (item) => {
      switch (+item?.category) {
        case 1:
          return await CartItem.findOne({
            where: {
              CartId: cart?.dataValues?.id,
              id: item?.id,
            },
            include: [
              {
                model: StudioPost,
                attributes: ["Id", "Name"],
                include: [{ model: RegisterPartner, attributes: ["id"] }],
              },
              {
                model: StudioRoom,
                attributes: [
                  "Id",
                  "Name",
                  "PriceByDate",
                  "PriceByHour",
                  "Image1",
                  "FreeCancelByDate",
                  "FreeCancelByHour",
                  "AffiliateCommissionByHour",
                  "AffiliateCommissionByDate",
                ],
              },
            ],
          });
        case 2:
          return await CartItem.findOne({
            where: {
              CartId: cart?.dataValues?.id,
              id: item?.id,
            },
            include: [
              {
                model: PhotographerPost,
                attributes: ["Id", "Name"],
                include: [{ model: RegisterPartner, attributes: ["id"] }],
              },
              {
                model: PhotographerServicePackage,
                attributes: [
                  "Id",
                  "Name",
                  "PriceByDate",
                  "PriceByHour",
                  "Image1",
                  "FreeCancelByDate",
                  "FreeCancelByHour",
                  "AffiliateCommissionByHour",
                  "AffiliateCommissionByDate",
                ],
              },
            ],
          });
        case 3:
          break;
        case 4:
          break;
        case 5:
          break;
        case 6:
          return await CartItem.findOne({
            where: {
              CartId: cart?.dataValues?.id,
              id: item?.id,
            },
            include: [
              {
                model: ModelPost,
                attributes: ["Id", "Name"],
                include: [{ model: RegisterPartner, attributes: ["id"] }],
              },
              {
                model: StudioRoom,
                attributes: [
                  "Id",
                  "Name",
                  "PriceByDate",
                  "PriceByHour",
                  "Image1",
                  "FreeCancelByDate",
                  "FreeCancelByHour",
                  "AffiliateCommissionByHour",
                  "AffiliateCommissionByDate",
                ],
              },
            ],
          });

        default:
          break;
      }
    })
  );

  results = await Promise.all(
    allCartItemChoose.map(async (item) => {
      const cartItem = item?.dataValues;
      const dates = cartItem?.OrderByTime
        ? [
            moment(cartItem?.OrderByTimeFrom).format(),
            moment(cartItem?.OrderByTimeTo).format(),
          ]
        : [
            moment(cartItem?.OrderByDateFrom).format(),
            moment(cartItem?.OrderByDateTo).format(),
          ];
      let rs;

      switch (cartItem?.Category) {
        case 1:
          rs = await ScheduleAndPriceStudioByDate.findAll({
            where: {
              DateTime: { [Op.between]: dates },
              RoomId: cartItem.RoomId,
            },
          });
          break;
        case 2:
          rs = await ScheduleAndPricePhotographerByDate.findAll({
            where: {
              DateTime: { [Op.between]: dates },
              ServiceId: cartItem.ServiceId,
            },
          });
          break;
        case 3:
          rs = await ScheduleAndPriceClothesByDate.findAll({
            where: {
              DateTime: { [Op.between]: dates },
              ServiceId: cartItem.ServiceId,
            },
          });
          break;
        case 4:
          rs = await ScheduleAndPriceMakeupByDate.findAll({
            where: {
              DateTime: { [Op.between]: dates },
              ServiceId: cartItem.ServiceId,
            },
          });
          break;
        case 5:
          rs = await ScheduleAndPriceDeviceByDate.findAll({
            where: {
              DateTime: { [Op.between]: dates },
              ServiceId: cartItem.ServiceId,
            },
          });
          break;
        case 6:
          rs = await ScheduleAndPriceModelByDate.findAll({
            where: {
              DateTime: { [Op.between]: dates },
              ServiceId: cartItem.ServiceId,
            },
          });
          break;

        default:
          break;
      }

      let price = 0;
      if (rs.length === 0) {
        price = cartItem?.OrderByTime
          ? cartItem?.StudioRoom?.dataValues?.PriceByHour *
            (moment(cartItem?.OrderByTimeTo).utc().hour() -
              moment(cartItem?.OrderByTimeFrom).utc().hour())
          : cartItem?.StudioRoom?.dataValues?.PriceByDate *
            (moment(cartItem?.OrderByDateTo).utc().date() -
              moment(cartItem?.OrderByDateFrom).utc().date() +
              1);
      } else {
        if (cartItem?.OrderByTime) {
          price =
            rs[0]?.dataValues?.PriceByHour *
            (moment(cartItem?.OrderByTimeTo).utc().hour() -
              moment(cartItem?.OrderByTimeFrom).utc().hour());
        } else {
          price = rs.reduce(
            (total, r) => total + r?.dataValues?.PriceByDate,
            0
          );
          price +=
            cartItem?.StudioRoom?.dataValues?.PriceByDate *
            (dates.length - rs.length);
        }
      }
      return { ...cartItem, price: price };
    })
  );

  res.status(200).send({ success: true, data: results || [] });
});

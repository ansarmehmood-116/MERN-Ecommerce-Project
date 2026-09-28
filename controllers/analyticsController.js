import visitModel from "../models/visitModel.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import paymentAttemptModel from "../models/paymentAttemptModel.js";

/*
|--------------------------------------------------------------------------
| VISIT TRACKING
|--------------------------------------------------------------------------
*/

export const trackVisitController = async (req, res) => {
  try {
    const { visitorId, path } = req.body;

    if (!visitorId) {
      return res.status(400).json({
        success: false,
        message: "visitorId is required",
      });
    }

    const forwarded = req.headers["x-forwarded-for"];

    const ip = forwarded
      ? forwarded.split(",")[0].trim()
      : req.socket.remoteAddress;

    const visit = await visitModel.create({
      visitorId,
      ip,
      user: req.user?._id || null,
      userAgent: req.headers["user-agent"] || null,
      path: path || null,
    });

    return res.status(201).json({
      success: true,
      message: "Visit tracked successfully",
      visit,
    });
  } catch (error) {
    console.error("TRACK VISIT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Error while tracking visit",
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| ANALYTICS
|--------------------------------------------------------------------------
*/

export const getAnalyticsController = async (req, res) => {
  try {
    /*
    |--------------------------------------------------------------------------
    | PERIOD
    |--------------------------------------------------------------------------
    */

    const period = req.query.period || "30days";

    const now = new Date();

    let periodStart;

    if (period === "7days") {
      periodStart = new Date(now);
      periodStart.setDate(periodStart.getDate() - 6);
      periodStart.setHours(0, 0, 0, 0);
    } else if (period === "30days") {
      periodStart = new Date(now);
      periodStart.setDate(periodStart.getDate() - 29);
      periodStart.setHours(0, 0, 0, 0);
    } else if (period === "thisMonth") {
      periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid period. Use 7days, 30days, or thisMonth.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | TODAY
    |--------------------------------------------------------------------------
    */

    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    /*
    |--------------------------------------------------------------------------
    | WEEK
    |--------------------------------------------------------------------------
    */

    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    /*
    |--------------------------------------------------------------------------
    | MONTH
    |--------------------------------------------------------------------------
    */

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    /*
    |--------------------------------------------------------------------------
    | SUCCESSFUL ORDER FILTER
    |--------------------------------------------------------------------------
    |
    | Cancelled orders are NOT revenue.
    |
    */

    const successfulOrderMatch = {
      "payment.success": true,
      status: { $ne: "cancel" },
    };

    /*
    |--------------------------------------------------------------------------
    | TOTAL SALES
    |--------------------------------------------------------------------------
    */

    const totalSalesResult = await orderModel.aggregate([
      {
        $match: successfulOrderMatch,
      },
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: null,
          totalSales: {
            $sum: {
              $multiply: ["$products.price", "$products.quantity"],
            },
          },
        },
      },
    ]);

    const totalSales = totalSalesResult[0]?.totalSales || 0;

    /*
    |--------------------------------------------------------------------------
    | TODAY'S SALES
    |--------------------------------------------------------------------------
    */

    const todaySalesResult = await orderModel.aggregate([
      {
        $match: {
          ...successfulOrderMatch,
          createdAt: {
            $gte: todayStart,
            $lt: tomorrowStart,
          },
        },
      },
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: null,
          sales: {
            $sum: {
              $multiply: ["$products.price", "$products.quantity"],
            },
          },
        },
      },
    ]);

    const todaySales = todaySalesResult[0]?.sales || 0;

    /*
    |--------------------------------------------------------------------------
    | WEEKLY SALES
    |--------------------------------------------------------------------------
    */

    const weeklySalesResult = await orderModel.aggregate([
      {
        $match: {
          ...successfulOrderMatch,
          createdAt: {
            $gte: weekStart,
            $lt: tomorrowStart,
          },
        },
      },
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: null,
          sales: {
            $sum: {
              $multiply: ["$products.price", "$products.quantity"],
            },
          },
        },
      },
    ]);

    const weeklySales = weeklySalesResult[0]?.sales || 0;

    /*
    |--------------------------------------------------------------------------
    | MONTHLY SALES
    |--------------------------------------------------------------------------
    */

    const monthlySalesResult = await orderModel.aggregate([
      {
        $match: {
          ...successfulOrderMatch,
          createdAt: {
            $gte: monthStart,
            $lt: tomorrowStart,
          },
        },
      },
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: null,
          sales: {
            $sum: {
              $multiply: ["$products.price", "$products.quantity"],
            },
          },
        },
      },
    ]);

    const monthlySales = monthlySalesResult[0]?.sales || 0;

    /*
    |--------------------------------------------------------------------------
    | SUCCESSFUL ORDER COUNT
    |--------------------------------------------------------------------------
    */

    const successfulOrderCount =
      await orderModel.countDocuments(successfulOrderMatch);

    /*
    |--------------------------------------------------------------------------
    | AVERAGE ORDER VALUE
    |--------------------------------------------------------------------------
    */

    const averageOrderValue =
      successfulOrderCount > 0 ? totalSales / successfulOrderCount : 0;

    /*
    |--------------------------------------------------------------------------
    | ORDER STATUS COUNTS
    |--------------------------------------------------------------------------
    */

    const orderStatusResult = await orderModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const orderStatuses = {
      notProcess: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    orderStatusResult.forEach((item) => {
      if (item._id === "Not Process") {
        orderStatuses.notProcess = item.count;
      }

      if (item._id === "Processing") {
        orderStatuses.processing = item.count;
      }

      if (item._id === "Shipped") {
        orderStatuses.shipped = item.count;
      }

      if (item._id === "delivered") {
        orderStatuses.delivered = item.count;
      }

      if (item._id === "cancel") {
        orderStatuses.cancelled = item.count;
      }
    });

    /*
    |--------------------------------------------------------------------------
    | TOTAL ORDERS
    |--------------------------------------------------------------------------
    */

    const totalOrders = await orderModel.countDocuments();

    /*
    |--------------------------------------------------------------------------
    | CUSTOMERS
    |--------------------------------------------------------------------------
    */

    const totalCustomers = await userModel.countDocuments();

    /*
    |--------------------------------------------------------------------------
    | NEW CUSTOMERS
    |--------------------------------------------------------------------------
    |
    | Customers created during selected period.
    |
    */

    const newCustomers = await userModel.countDocuments({
      createdAt: {
        $gte: periodStart,
        $lte: now,
      },
    });

    /*
    |--------------------------------------------------------------------------
    | CUSTOMERS WITH ORDERS
    |--------------------------------------------------------------------------
    */

    const customersWithOrdersResult = await orderModel.distinct("buyer");

    const customersWithOrders = customersWithOrdersResult.filter(
      (id) => id != null,
    ).length;

    /*
    |--------------------------------------------------------------------------
    | PRODUCTS
    |--------------------------------------------------------------------------
    */

    const totalProducts = await productModel.countDocuments();

    const outOfStock = await productModel.countDocuments({
      quantity: 0,
    });

    const lowStock = await productModel.countDocuments({
      quantity: {
        $gt: 0,
        $lte: 5,
      },
    });

    // -----------------------------------------------------------------------
    // ___________________TOTAL STOCK VALUE_____________________
    // _______________________________________________________________________

    const stockValueResult = await productModel.aggregate([
      {
        $match: {
          quantity: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: null,
          totalStockValue: {
            $sum: {
              $multiply: ["$quantity", "$price"],
            },
          },
        },
      },
    ]);

    const totalStockValue = stockValueResult[0]?.totalStockValue || 0;

    /*
    |--------------------------------------------------------------------------
    | BEST SELLING PRODUCTS
    |--------------------------------------------------------------------------
    |
    | Only successful and non-cancelled orders.
    |
    */

    const bestSellingProducts = await orderModel.aggregate([
      {
        $match: successfulOrderMatch,
      },

      {
        $unwind: "$products",
      },

      {
        $group: {
          _id: "$products.product",

          soldQuantity: {
            $sum: "$products.quantity",
          },

          revenue: {
            $sum: {
              $multiply: ["$products.price", "$products.quantity"],
            },
          },
        },
      },

      {
        $sort: {
          soldQuantity: -1,
        },
      },

      {
        $limit: 10,
      },

      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },

      {
        $unwind: {
          path: "$product",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 1,

          name: {
            $ifNull: ["$product.name", "Deleted Product"],
          },

          soldQuantity: 1,
          revenue: 1,

          currentStock: {
            $ifNull: ["$product.quantity", 0],
          },
        },
      },
    ]);

    /*
    |--------------------------------------------------------------------------
    | SUCCESSFUL PAYMENTS
    |--------------------------------------------------------------------------
    */

    const successfulPayments = await paymentAttemptModel.countDocuments({
      success: true,
    });

    /*
    |--------------------------------------------------------------------------
    | FAILED PAYMENTS
    |--------------------------------------------------------------------------
    */

    const failedPayments = await paymentAttemptModel.countDocuments({
      success: false,
    });

    /*
    |--------------------------------------------------------------------------
    | VISITS - TOTAL
    |--------------------------------------------------------------------------
    */

    const totalVisits = await visitModel.countDocuments();

    /*
    |--------------------------------------------------------------------------
    | VISITS - TODAY
    |--------------------------------------------------------------------------
    */

    const todayVisits = await visitModel.countDocuments({
      createdAt: {
        $gte: todayStart,
        $lt: tomorrowStart,
      },
    });

    /*
    |--------------------------------------------------------------------------
    | UNIQUE VISITORS
    |--------------------------------------------------------------------------
    */

    const uniqueVisitorsResult = await visitModel.distinct("visitorId");

    const uniqueVisitors = uniqueVisitorsResult.length;

    /*
    |--------------------------------------------------------------------------
    | VISITS OVER TIME
    |--------------------------------------------------------------------------
    */

    const visitsOverTime = await visitModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: periodStart,
            $lte: now,
          },
        },
      },

      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },

          visits: {
            $sum: 1,
          },

          uniqueVisitors: {
            $addToSet: "$visitorId",
          },
        },
      },

      {
        $project: {
          _id: 0,

          date: "$_id",

          visits: 1,

          uniqueVisitors: {
            $size: "$uniqueVisitors",
          },
        },
      },

      {
        $sort: {
          date: 1,
        },
      },
    ]);

    /*
    |--------------------------------------------------------------------------
    | SALES OVER TIME
    |--------------------------------------------------------------------------
    */

    const salesOverTime = await orderModel.aggregate([
      {
        $match: {
          ...successfulOrderMatch,

          createdAt: {
            $gte: periodStart,
            $lte: now,
          },
        },
      },

      {
        $unwind: "$products",
      },

      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },

          sales: {
            $sum: {
              $multiply: ["$products.price", "$products.quantity"],
            },
          },

          orders: {
            $addToSet: "$_id",
          },
        },
      },

      {
        $project: {
          _id: 0,

          date: "$_id",

          sales: 1,

          orders: {
            $size: "$orders",
          },
        },
      },

      {
        $sort: {
          date: 1,
        },
      },
    ]);

    /*
    |--------------------------------------------------------------------------
    | RECENT ORDERS
    |--------------------------------------------------------------------------
    */

    const recentOrders = await orderModel
      .find({})
      .populate("buyer", "name email phone")
      .populate("products.product", "name price")
      .sort({
        createdAt: -1,
      })
      .limit(10)
      .lean();

    /*
    |--------------------------------------------------------------------------
    | PAYMENT REVENUE
    |--------------------------------------------------------------------------
    */

    const paymentRevenue = totalSales;

    /*
    |--------------------------------------------------------------------------
    | FINAL RESPONSE
    |--------------------------------------------------------------------------
    */

    return res.status(200).json({
      success: true,
      period,

      sales: {
        total: Number(totalSales.toFixed(2)),
        today: Number(todaySales.toFixed(2)),
        weekly: Number(weeklySales.toFixed(2)),
        monthly: Number(monthlySales.toFixed(2)),
        averageOrderValue: Number(averageOrderValue.toFixed(2)),
      },

      orders: {
        total: totalOrders,
        processing: orderStatuses.processing,
        shipped: orderStatuses.shipped,
        delivered: orderStatuses.delivered,
        cancelled: orderStatuses.cancelled,
        notProcess: orderStatuses.notProcess,
      },

      customers: {
        total: totalCustomers,
        new: newCustomers,
        withOrders: customersWithOrders,
      },

      products: {
        total: totalProducts,
        outOfStock,
        lowStock,
        totalStockValue: Number(totalStockValue.toFixed(2)),
        bestSelling: bestSellingProducts,
      },

      payments: {
        successful: successfulPayments,
        failed: failedPayments,
        revenue: Number(paymentRevenue.toFixed(2)),
      },

      visits: {
        total: totalVisits,
        today: todayVisits,
        unique: uniqueVisitors,
        overTime: visitsOverTime,
      },
      salesOverTime,
      recentOrders,
    });
  } catch (error) {
    console.error("GET ANALYTICS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Error while fetching analytics",
      error: error.message,
    });
  }
};

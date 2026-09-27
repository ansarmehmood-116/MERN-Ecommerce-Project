import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";

//_____user orders__without_Pagination_____
// export const getOrdersController = async (req, res) => {
//   try {
//     const orders = await orderModel
//       .find({ buyer: req.user._id })
//       .populate("products.product", "-photo")
//       .populate("buyer", "name")
//       .sort({ createdAt: -1 });
//     res.json(orders);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error WHile Geting Orders",
//       error,
//     });
//   }
// };//_________________________________________________________
// _____user orders_with_pagination_____During my own updates better and "has more" function from database no separate product count needed like productList paging
export const getOrdersController = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);

    const skip = (page - 1) * limit;
    const [orders, totalOrders] = await Promise.all([
      orderModel
        .find({ buyer: req.user._id })
        .populate("products.product", "-photo")
        .populate("buyer", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      orderModel.countDocuments({ //count buyer specific orders
        buyer: req.user._id,  
      }),
    ]);

    res.status(200).json({
      success: true,
      orders,
      totalOrders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      hasMore: skip + orders.length < totalOrders,
    });
  } catch (error) {
    console.error("USER ORDERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Error while fetching orders",
      error: error.message,
    });
  }
};
//________________________________________________________________________

//_____All orders for Admin__without_Pagination_____
// export const getAllOrdersController = async (req, res) => {
//   try {
//     const orders = await orderModel
//       .find({})
//       //.populate("products", "-photo") //old Version orderModel
//       .populate("products.product", "-photo") //New Version orderModel
//       .populate("buyer", "name")
//       .sort({ createdAt: -1 }); //it will show all latest orders
//     res.json(orders);
//   } catch (error) {
//     console.log("ADMIN ORDERS ERROR:",error);
//     res.status(500).send({
//       success: false,
//       message: "Error WHile Getting Orders",
//       error,
//     });
//   }
// };
//______________________________________________________________
//_____Admin orders_with_pagination_____During my own updates better and "has more" function from database no separate product count needed like productList paging
export const getAllOrdersController = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page)||1, 1); //Number parse string to num
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const skip = (page - 1) * limit;
    const [orders, totalOrders] = await Promise.all([
      orderModel
        .find({})
        .populate("buyer", "name email phone address")
        //.populate("products", "-photo") //old Version orderModel
        .populate("products.product", "-photo") //New Version orderModel
        .populate("buyer", "name")
        .sort({ createdAt: -1 }) //it will show all latest orders
        .skip(skip)
        .limit(limit),
      orderModel.countDocuments({}),
    ]);

    //__This is also perfect instead of above array [orders, totalOrders]_but it is sequential while above promise.all is concurrent and best for performance
    // const orders = await orderModel
    //   .find({})
    //   .skip((page - 1) * perPage)
    //   .limit(perPage);
    // const totalOrders = await orderModel.countDocuments({});

    res.status(200).json({
      success: true,
      orders,
      totalOrders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      hasMore: skip + orders.length < totalOrders,
    });
  } catch (error) {
    console.error("ADMIN ORDERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Error while Getting orders",
      error: error.message,
    });
  }
};
//________________________________________________________________________

//_____USER DASHBOARD STATS LIGHT WEIGHT CONTROLLER_____
export const getUserDashboardStatsController = async (req, res) => {
  try {
    const [totalOrders, activeOrders] = await Promise.all([ 
      //promise get both requests concurrent i.e totalOrders and activeOrders other wise it would be sequential and slow respons like const totalOrders= await orderModel.countDocuments({...}) and const activeOrders=await orderModel.countDocuments({...})
      orderModel.countDocuments({
        buyer: req.user._id,
      }),

      orderModel.countDocuments({
        buyer: req.user._id,
        status: { $in: ["Processing", "Shipped"] },
      }),
    ]);

    res.status(200).json({
      success: true,
      totalOrders,
      activeOrders,
    });
  } catch (error) {
    console.error("DASHBOARD STATS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Error while fetching dashboard stats",
      error: error.message,
    });
  }
};
//________________________________________________________________________

//Single Order Controller for admin
export const getSingleOrderController = async (req, res) => {
  try {
    const order = await orderModel
      .findById(req.params.orderId)
      .populate("buyer", "-password")
      // .populate("products"); //used will old version orderModel
      .populate("products.product", "-photo");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("SINGLE ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: error.message,
    });
  }
};
//________________________________________________________________________

//__user_order_Invoice__
export const getUserSingleOrderController = async (req, res) => {
  try {
    const order = await orderModel
      .findById(req.params.orderId)
      .populate("buyer", "-password")
      .populate("products.product", "-photo");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    // Normal user can view only their own order
    if (order.buyer?._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this order",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("USER SINGLE ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: error.message,
    });
  }
};
// _______________________________________________________________________

//__________order status old version__________
// it was not handling business logic like cancel order restore quantity etc.
// export const orderStatusController = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body;
//     const orders = await orderModel.findByIdAndUpdate(
//       orderId,
//       { status },
//       { new: true },
//       // { new: true } ke sath: Variable mein update hone ke baad wala naya data aata hai.
//       // { new: true } ke bagair (Default): Variable mein update hone se pehle wala purana data aata hai (bhale hi database update ho gaya ho).
//     );
//     res.json(orders);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error While Updateing Order",
//       error,
//     });
//   }
// };

//_______New Version______
// Business Logic Safe Hai: Cancelled order par stock restore karne aur validation checks lagane ke liye yeh Naya Tareeqa hi best practice hai, es mai {new: true} ki zaroorat nahi: Kyunki aap findByIdAndUpdate use hi nahi kar rahe, Aapne nayi logic mein findByIdAndUpdate ki jagah direct Document Save pattern (order.status = status; await order.save();) istemaal kiya hai:
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Find order
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // PAYMENT CHECK
    // Processing, Shipped and delivered require successful payment
    if (
      ["Processing", "Shipped", "delivered"].includes(status) &&
      order.payment?.success !== true
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot update order because payment was not successful.",
      });
    }

    // STATUS PROGRESSION
    // Prevent backward status transition
    // Example:
    // delivered -> shipped ❌
    // shipped -> processing ❌
    const statusOrder = {
      "Not Process": 0,
      Processing: 1,
      Shipped: 2,
      delivered: 3,
    };

    // Prevent moving order backwards
    if (
      status !== "cancel" &&
      statusOrder[status] < statusOrder[order.status]
    ) {
      return res.status(400).json({
        success: false,
        message: `Cannot move order from ${order.status} back to ${status}.`,
      });
    }
    // CANCELLATION
    // Already cancelled
    if (status === "cancel" && order.status === "cancel") {
      return res.status(400).json({
        success: false,
        message: "Order is already cancelled.",
      });
    }
    // Delivered orders cannot be cancelled
    if (status === "cancel" && order.status === "delivered") {
      return res.status(400).json({
        success: false,
        message: "Delivered orders cannot be cancelled.",
      });
    }
    // Failed-payment orders cannot be cancelled
    // because no stock was reserved/reduced for them
    if (status === "cancel" && order.payment?.success !== true) {
      return res.status(400).json({
        success: false,
        message:
          "This order cannot be cancelled because payment was not successful.",
      });
    }
    // RESTORE STOCK WHEN CANCELLED
    // Order Schema V2 already stores quantity.
    //
    // Example:
    // {
    //   product: ABC,
    //   quantity: 3,
    //   price: 20
    // }
    //
    // Cancellation:
    // ABC stock +3
    if (status === "cancel") {
      // Count duplicate product IDs this was in V1 orderModel
      // const productCounts = {};
      // order.products.forEach((productId) => {
      //   const id = productId.toString();
      //   if (productCounts[id]) {
      //     productCounts[id] += 1;
      //   } else {
      //     productCounts[id] = 1;
      //   }
      // });
      // // Restore stock
      // for (const productId in productCounts) {
      //   const quantity = productCounts[productId];
      //   await productModel.findByIdAndUpdate(
      //     productId,
      for (const item of order.products) {
        await productModel.findByIdAndUpdate(
          item.product,
          {
            $inc: {
              quantity: item.quantity,
            },
          },
          { new: true },
        );
      }
    }
    // UPDATE ORDER STATUS
    order.status = status;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("ORDER STATUS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Error while updating order",
      error: error.message,
    });
  }
};
//_____________________________________________________________________

//__Correct__Order__Status__Controller
export const correctOrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, reason } = req.body;

    // ------------------------------------------------
    // 1. Find order
    // ------------------------------------------------

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ------------------------------------------------
    // 2. Validate correction reason
    // ------------------------------------------------
    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Correction reason is required",
      });
    }

    // ------------------------------------------------
    // 3. Validate status
    // ------------------------------------------------
    const allowedStatuses = [
      "Not Process",
      "Processing",
      "Shipped",
      "delivered",
      "cancel",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    // ------------------------------------------------
    // 4. Failed payment orders cannot become active
    // ------------------------------------------------
    if (
      ["Not Process", "Processing", "Shipped", "delivered"].includes(status) &&
      order.payment?.success !== true
    ) {
      return res.status(400).json({
        success: false,
        message: "Failed-payment orders cannot be reopened.",
      });
    }

    // ------------------------------------------------
    // 5. CANCELLED → ACTIVE
    // ------------------------------------------------
    // Stock was restored when order was cancelled.
    // If we reopen it, we need to take that stock back.
    // ------------------------------------------------

    if (order.status === "cancel" && status !== "cancel") {
      // Count duplicate product IDs this was in V1 orderModel
      // const productCounts = {};
      // order.products.forEach((productId) => {
      //   const id = productId.toString();
      //   productCounts[id] = (productCounts[id] || 0) + 1;
      // });
      // for (const productId in productCounts) {
      //   const quantity = productCounts[productId];
      //   const product = await productModel.findOneAndUpdate(
      //     {
      //       _id: productId,

      for (const item of order.products) {
        const product = await productModel.findOneAndUpdate(
          {
            _id: item.product,
            quantity: { $gte: item.quantity },
          },
          {
            $inc: {
              quantity: -item.quantity,
            },
          },
          {
            new: true,
          },
        );

        // If stock is insufficient, stop reopening
        if (!product) {
          return res.status(400).json({
            success: false,
            message: "Insufficient stock to reopen this order.",
          });
        }
      }
    }

    // ------------------------------------------------
    // 6. ACTIVE → CANCELLED
    // ------------------------------------------------
    // Restore the complete ordered quantity back to stock.
    // ------------------------------------------------
    if (order.status !== "cancel" && status === "cancel") {
      // Count duplicate product IDs this was in V1 orderModel
      // const productCounts = {};
      // order.products.forEach((productId) => {
      //   const id = productId.toString();
      //   productCounts[id] = (productCounts[id] || 0) + 1;
      // });
      // for (const productId in productCounts) {
      //   const quantity = productCounts[productId];
      //   await productModel.findByIdAndUpdate(productId, {

      for (const item of order.products) {
        await productModel.findByIdAndUpdate(item.product, {
          $inc: {
            quantity: item.quantity,
          },
        });
      }
    }

    // ------------------------------------------------
    // 7. Save status
    // ------------------------------------------------
    const oldStatus = order.status;
    order.status = status;
    await order.save();

    // ------------------------------------------------
    // 8. Response
    // ------------------------------------------------
    res.status(200).json({
      success: true,
      message: "Order status corrected successfully",
      oldStatus,
      newStatus: status,
      reason,
      order,
    });
  } catch (error) {
    console.error("CORRECT ORDER STATUS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Error while correcting order status",
      error: error.message,
    });
  }
};
//_____________________________________________________________________

// _____delete order controller for admin____it can used for delete oredr
// export const deleteOrderController = async (req, res) => {
//   try {
//     // Delete the order directly without storing it in a variable
//     await orderModel.findByIdAndDelete(req.params.oid);
//     res.status(200).send({
//       success: true,
//       message: "Order deleted successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error while deleting order",
//       error,
//     });
//   }
// };
//______________________________________________________________________

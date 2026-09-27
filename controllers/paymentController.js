import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";
import paymentAttemptModel from "../models/paymentAttemptModel.js";

import braintree from "braintree";
import dotenv from "dotenv";

dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});
//________________________________________________________________________________

//payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
  try {
    //getway is defined in start.
    //this code is availabale in documentation of braintree in npm js
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
//________________________________________________________________________________

//______PYMENT_New_Version_orderModel_Compatible_Payment_Controller__see details in orderModel complete document_______
export const brainTreePaymentController = async (req, res) => {
  let reservedProducts = [];

  try {
    const { nonce, cart } = req.body;

    // 1. Validate payment/cart data
    if (!nonce) {
      return res.status(400).json({
        success: false,
        message: "Payment method is required",
      });
    }

    if (!cart || cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // 2. Group duplicate products
    const groupedProducts = cart.reduce((acc, item) => {
      const productId = item._id.toString();

      const existing = acc.find((product) => product.productId === productId);

      if (existing) {
        existing.quantity += 1;
      } else {
        acc.push({
          productId,
          quantity: 1,
        });
      }

      return acc;
    }, []);

    // 3. Get products from database
    //    This gives us the REAL current price.
    const productsFromDB = [];

    for (const item of groupedProducts) {
      const product = await productModel.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "One or more products no longer exist",
        });
      }

      productsFromDB.push({
        product,
        quantity: item.quantity,
      });
    }

    // 4. Check stock and reserve it
    for (const item of productsFromDB) {
      const reservedProduct = await productModel.findOneAndUpdate(
        {
          _id: item.product._id,
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

      if (!reservedProduct) {
        // Restore anything already reserved
        for (const reserved of reservedProducts) {
          await productModel.findByIdAndUpdate(reserved.productId, {
            $inc: {
              quantity: reserved.quantity,
            },
          });
        }

        return res.status(400).json({
          success: false,
          message: "Insufficient stock for one or more products",
        });
      }

      reservedProducts.push({
        productId: item.product._id,
        quantity: item.quantity,
      });
    }

    // 5. Create purchase-time price snapshot
    const orderProducts = productsFromDB.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    // 6. Calculate total using database prices
    const total = orderProducts.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    // 7. Process Braintree payment
    gateway.transaction.sale(
      {
        amount: total.toFixed(2),
        paymentMethodNonce: nonce, //When a user submits their payment details (like credit card information) on the frontend (often through a payment form), Braintree tokenizes this sensitive information.This tokenization process generates a nonce, which is a short-lived, one-time-use identifier.The nonce is then sent to your backend server, where it is used to initiate a transaction.
        options: {
          submitForSettlement: true,
        },
      },

      // function (error, result) {
      async (error, result) => {
        //The result argument in the callback function of
        //gateway.transaction.sale is provided by the Braintree
        //payment gateway when a transaction is processed.

        // 8. Braintree/API error
        if (error) {
          console.log("Braintree error:", error);
          //________________________________________________

          // Record failed payment attempt for ANALYTICS only we can remove this if not needed
          try {
            await paymentAttemptModel.create({
              buyer: req.user?._id || null,
              amount: total,
              success: false,
              transactionId: null,
              message: error.message,
              paymentGateway: "braintree",
            });
          } catch (paymentAttemptError) {
            console.log("Payment attempt logging error:", paymentAttemptError);
          }
          //________________________________________________

          // Restore reserved stock
          for (const item of reservedProducts) {
            await productModel.findByIdAndUpdate(item.productId, {
              $inc: {
                quantity: item.quantity,
              },
            });
          }

          return res.status(500).json({
            success: false,
            message: "Payment gateway error",
            error: error.message,
          });
        }

        // 9. Payment failed
        if (!result || !result.success) {
          console.log("Payment failed:", result);
          //___________________________________________________________

          // Record failed payment attempt for ANALYTICS only we can remove this if not needed
          try {
            await paymentAttemptModel.create({
              buyer: req.user?._id || null,
              amount: total,
              success: false,
              transactionId: result?.transaction?.id || null,
              message: result?.message || "Transaction was unsuccessful",
              paymentGateway: "braintree",
            });
          } catch (paymentAttemptError) {
            console.log("Payment attempt logging error:", paymentAttemptError);
          }
          //___________________________________________________________

          // Restore reserved stock
          for (const item of reservedProducts) {
            await productModel.findByIdAndUpdate(item.productId, {
              $inc: {
                quantity: item.quantity,
              },
            });
          }

          return res.status(400).json({
            success: false,
            message: "Payment failed",
            error: result?.message || "Transaction was unsuccessful",
          });
        }
        //_____________________________________________________________

        // 10. Payment successful → record successful payment attempt for ANALYTICS only we can remove this if not needed
        try {
          await paymentAttemptModel.create({
            buyer: req.user?._id || null,
            amount: total,
            success: true,
            transactionId: result.transaction?.id || null,
            message: "Payment completed successfully",
            paymentGateway: "braintree",
          });
        } catch (paymentAttemptError) {
          console.log("Payment attempt logging error:", paymentAttemptError);
        }
        //______________________________________________________________

        // 11. Payment successful → create order
        try {
          const order = await new orderModel({
            products: orderProducts,
            payment: result,
            buyer: req.user._id,
            status: "Not Process",
          }).save();

          // Clear reservation tracking because
          // payment + order were successful
          reservedProducts = [];

          return res.status(200).json({
            success: true,
            message: "Payment completed successfully",
            order,
          });
        } catch (orderError) {
          console.log("Order creation failed:", orderError);

          // Payment succeeded but order failed
          // IMPORTANT:
          // We need to refund/void the Braintree transaction
          // and restore inventory.
          // ------------------------------------------------
          // Refund Braintree transaction.
          try {
            if (result.transaction?.id) {
              await new Promise((resolve) => {
                gateway.transaction.refund(result.transaction.id, () =>
                  resolve(),
                );
              });
            }
          } catch (refundError) {
            console.log("Refund error:", refundError);
          }

          // Restore stock
          for (const item of reservedProducts) {
            await productModel.findByIdAndUpdate(item.productId, {
              $inc: {
                quantity: item.quantity,
              },
            });
          }

          return res.status(500).json({
            success: false,
            message:
              "Payment succeeded but order creation failed. Payment will be refunded.",
          });
        }
      },
    );
  } catch (error) {
    console.log("Payment controller error:", error);

    // Restore stock if something failed before Braintree
    for (const item of reservedProducts) {
      try {
        await productModel.findByIdAndUpdate(item.productId, {
          $inc: {
            quantity: item.quantity,
          },
        });
      } catch (restoreError) {
        console.log("Error restoring product:", restoreError);
      }
    }

    return res.status(500).json({
      success: false,
      message: "Error while processing payment",
      error: error.message,
    });
  }
};

//_____________Current__Payment__Flow__________
// Cart
//  ↓
// Group products
//  ↓
// Database se actual products
//  ↓
// Database se actual price
//  ↓
// Stock reserve
//  ↓
// Braintree payment
//  ↓
// FAILED ──→ Stock restore
//  ↓
// SUCCESS
//  ↓
// Order create
//  ├── product ID
//  ├── quantity
//  └── purchase-time price
//  ↓
// Done

//________________OLD___Version___oredrModel___Compatible___Payment_Controller__When there was no purchase time price and payment record saved and changed on new price see details in orderModel________________
// export const brainTreePaymentController = async (req, res) => {
//   let reservedProducts = [];
//   try {
//     const { nonce, cart } = req.body;

//     // 1. Validate payment/cart data
//     if (!nonce) {
//       return res.status(400).json({
//         success: false,
//         message: "Payment method is required",
//       });
//     }

//     if (!cart || cart.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Cart is empty",
//       });
//     }

//     // 2. Group duplicate products
//     const groupedProducts = cart.reduce((acc, item) => {
//       const productId = item._id.toString();

//       const existing = acc.find(
//         (product) => product.productId === productId
//       );

//       if (existing) {
//         existing.quantity += 1;
//       } else {
//         acc.push({
//           productId,
//           quantity: 1,
//         });
//       }

//       return acc;
//     }, []);

//     // 3. Check stock and reserve it
//     for (const item of groupedProducts) {
//       const product = await productModel.findOneAndUpdate(
//         {
//           _id: item.productId,
//           quantity: { $gte: item.quantity },
//         },
//         {
//           $inc: {
//             quantity: -item.quantity,
//           },
//         },
//         {
//           new: true,
//         }
//       );

//       if (!product) {
//         // Restore anything already reserved
//         for (const reserved of reservedProducts) {
//           await productModel.findByIdAndUpdate(
//             reserved.productId,
//             {
//               $inc: {
//                 quantity: reserved.quantity,
//               },
//             }
//           );
//         }

//         return res.status(400).json({
//           success: false,
//           message: "Insufficient stock for one or more products",
//         });
//       }

//       reservedProducts.push({
//         productId: item.productId,
//         quantity: item.quantity,
//       });
//     }

//     // 4. Get actual prices from database
//        let total = 0;
//     for (const item of groupedProducts) {
//       const product = await productModel.findById(item.productId);
//       if (!product) {
//         throw new Error("Product no longer exists");
//       }
//       total += product.price * item.quantity;
//     }

//     // 5. Process Braintree payment
//       gateway.transaction.sale(
//       {
//         amount: total.toFixed(2),
//         paymentMethodNonce: nonce,
//         options: {
//           submitForSettlement: true,
//         },
//       },

//       // function (error, result) {
//       async (error, result) => {
//         //The result argument in the callback function of
//         //gateway.transaction.sale is provided by the Braintree
//         //payment gateway when a transaction is processed.

//         //  6.  Braintree/API error
//           if (error) {
//           console.log("Braintree error:", error);
//           // Restore reserved stock
//           for (const item of reservedProducts) {
//             await productModel.findByIdAndUpdate(
//               item.productId,
//               {
//                 $inc: {
//                   quantity: item.quantity,
//                 },
//               }
//             );
//           }
//           return res.status(500).json({
//             success: false,
//             message: "Payment gateway error",
//             error: error.message,
//           });
//         }

//         // 7. Payment failed
//         if (!result || !result.success) {
//           console.log("Payment failed:", result);
//           // Restore stock
//           for (const item of reservedProducts) {
//             await productModel.findByIdAndUpdate(
//               item.productId,
//               {
//                 $inc: {
//                   quantity: item.quantity,
//                 },
//               }
//             );
//           }
//           return res.status(400).json({
//             success: false,
//             message: "Payment failed",
//             error: result?.message || "Transaction was unsuccessful",
//           });
//         }

//         // 8. Payment successful → create order
//         try {
//           const order = await new orderModel({
//             products: cart.map((item) => item._id),
//             payment: result,
//             buyer: req.user._id,
//             status: "Not Process",
//           }).save();

//           // Clear reservation tracking because
//           // payment + order were successful
//           reservedProducts = [];
//           return res.status(200).json({
//             success: true,
//             message: "Payment completed successfully",
//             order,
//           });
//         } catch (orderError) {
//           console.log("Order creation failed:", orderError);
//           try {
//             if (result.transaction?.id) {
//               await new Promise((resolve) => {
//                 gateway.transaction.refund(
//                   result.transaction.id,
//                   () => resolve()
//                 );
//               });
//             }
//           } catch (refundError) {
//             console.log("Refund error:", refundError);
//           }
//           // Restore stock
//           for (const item of reservedProducts) {
//             await productModel.findByIdAndUpdate(
//               item.productId,
//               {
//                 $inc: {
//                   quantity: item.quantity,
//                 },
//               }
//             );
//           }
//           return res.status(500).json({
//             success: false,
//             message:
//               "Payment succeeded but order creation failed. Payment will be refunded.",
//           });
//         }
//       }
//     );
//   } catch (error) {
//     console.log("Payment controller error:", error);

//     // Restore stock if something failed before Braintree
//     for (const item of reservedProducts) {
//       try {
//         await productModel.findByIdAndUpdate(
//           item.productId,
//           {
//             $inc: {
//               quantity: item.quantity,
//             },
//           }
//         );
//       } catch (restoreError) {
//         console.log(
//           "Error restoring product:",
//           restoreError
//         );
//       }
//     }
//     return res.status(500).json({
//       success: false,
//       message: "Error while processing payment",
//       error: error.message,
//     });
//   }
// };
//________________________________________________________________________________

//_______________TRANSACTION_HISTORY______________
export const getTransactionHistoryController = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 6, 1), 50);
    const skip = (page - 1) * limit;

    //____this can be used before res.status(200).json({ block and below try{ block if no paging is needed/used
    // try {
    //   const orders = await orderModel
    //     .find({})
    //     .populate("buyer", "-password")
    //     .populate("products.product", "-photo") //New Version
    //     // .populate("products", "-photo")//This was in older version when there was no purchase time price and payment see details in orderModel
    //     .sort({ createdAt: -1 });

    const [orders, totalOrders] = await Promise.all([
      //used for concurrent fetching i.e orders and totalOrders
      orderModel
        .find({})
        .populate("buyer", "name email phone address")
        .populate("products.product", "-photo")
        .sort({ createdAt: -1 })
        //__For Paging_Purpose__
        .skip(skip)
        .limit(limit),

      orderModel.countDocuments({}), //used for all orders not user specific
    ]);

    //__This is also perfect instead of above array [orders, totalOrders]_but it is sequential while above promise.all is concurrent and that is best for performance
    // const orders = await orderModel
    //   .find({})
    //   .skip((page - 1) * perPage)
    //   .limit(perPage);
    // const totalOrders = await orderModel.countDocuments({});

    res.status(200).json({
      success: true,
      message: "Transaction history fetched successfully",
      orders,
      //__for paging_Purpose__
      totalOrders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      hasMore: skip + orders.length < totalOrders,
    });
  } catch (error) {
    console.error("TRANSACTION HISTORY ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Error while fetching transaction history",
      error: error.message,
    });
  }
};
//____________________________________________________________________________

//____reduced-quantity Controller____//it is already handled in brainTreePaymentController____
// export const reducedQuantityController = async (req, res) => {
//   const { productId, quantity } = req.body;
//   //here we have used req.body because quantity exist in body not in params
//   // Validate request inputs

//   if (!productId || !quantity || quantity <= 0) {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid product ID or quantity provided.",
//     });
//   }

//   try {
//     // Atomic update: only decrement if available quantity is >= requested quantity
//     const product = await productModel
//       .findOneAndUpdate(
//         {
//           _id: productId,
//           quantity: { $gte: quantity }, // Guard against negative inventory
//         },
//         {
//           $inc: { quantity: -quantity }, // Atomically decrement stock
//         },
//         { new: true },
//       )
//       .select("-photo");

//     if (!product) {
//       // Check if product exists at all to return a specific error message
//       const existingProduct = await productModel
//         .findById(productId)
//         .select("-photo");

//       if (!existingProduct) {
//         return res.status(404).json({
//           success: false,
//           message: "Product not found",
//         });
//       }

//       // If product exists but findOneAndUpdate failed, stock was insufficient
//       return res.status(400).json({
//         success: false,
//         message: `Insufficient stock. Only ${existingProduct.quantity} units available.`,
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Stock updated successfully",
//       product,
//     });
//   } catch (error) {
//     console.error("Error reducing quantity:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };
//________________________________________________________________________________

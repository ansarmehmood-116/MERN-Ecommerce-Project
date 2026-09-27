// NOTE:___________OLD_ORDER_SCHEMA____VS____NEW__ORDER__SCHEMA___________
// 1___In this schema orders were stored with order id so same product with multipple quantities would stored with repeated same product id's not like one product with multipple quantities so that was a separate total count required in backend or frontend.
// 2___Payment or price problem when order placed and payed but not yed delivered or even delivered and have saved invoces/transaction-history but after updating product new price at run time or later when admin changed the price of product it would display new total_payment and product_price on older invoice and order_history which was bad business logic and order so i have updated to new version below from commented below code.
// Isse:
// ✅ purchase-time price permanently save
// ✅ quantity directly save
// ✅ old invoice future price changes se unaffected
// ✅ Transaction History correct
// ✅ Admin Orders simpler
// ✅ cancellation stock restore reliable
// ✅ analytics mein sold quantity/revenue calculate easy

// The architecture is given as:

//  NEW VERSION                        |         OLD VERSION
//  products                           |  products: [ID, ID, ID, ID]
//  ├── product: ABC                   |
//  │   quantity: 3                    |
//  │   price: 20                      |
//  │                                  | 
//  └── product: XYZ                   |  
//      quantity: 2                    |
//      price: 50                      |
// e.g                                 |
// 3 × $20 = $60                       |
// 2 × $50 = $100                      |
// Total = $160                        |
// ⭐ Ab original problem solve
// Aaj:
// iPhone = $500
// Customer order karta hai.
// Order mein:
// price: 500
// save ho gaya.
// Kal admin price change karta hai:
// iPhone = $650
// Product collection mein ab:
// price: 650
// lekin old order mein ab bhi:
// price: 500
// rahega. ❤️
// So:
// Old Invoice
// iPhone
// Qty: 2
// Price: $500
// Total: $1000
// New Order
// iPhone
// Qty: 1
// Price: $650
// Total: $650
// Old invoice/order kabhi new product price nahi uthayega.
// ⚠️ Ek aur important change
// Ab Order schema V2 ke baad tumhara current Transaction History controller:
// .populate("products", "-photo")
// sahi nahi rahega, because products ab direct ObjectIds nahi hain.
// Ab structure hai:
// products: [
//   {
//     product: ObjectId,
//     quantity: Number,
//     price: Number
//   }
// ]
// Isliye controller mein:
// .populate("products.product", "-photo")
// hona chahiye.
//____________________________________________________________________________

//______Order__Schema__(V2)__New_Version
import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.ObjectId,
          ref: "Products",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    payment: {},

    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
      required: true,
    },

    status: {
      type: String,
      default: "Not Process",
      enum: [
        "Not Process",
        "Processing",
        "Shipped",
        "delivered",
        "cancel",
      ],
    },
  },
  { timestamps: true }
);
//for database Queries optimization
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ buyer: 1 });
export default mongoose.model("Order", orderSchema);
// ____________________________________________________________________________

//_________OLD__VERSION__SCHEMA_____
// const orderSchema = new mongoose.Schema(
//   {
//     products: [   //all the objects will exists in array from so we have used []
//       {
//         type: mongoose.ObjectId,
//         ref: "Products",
//         required: true,
//       },
//     ],

//     payment: {},

//     buyer: {
//       type: mongoose.ObjectId,
//       ref: "users",
//       required: true,
//     },

//     status: {
//       type: String,
//       default: "Not Process",
//       enum: [
//         "Not Process",
//         "Processing",
//         "Shipped",
//         "delivered",
//         "cancel",
//       ],
//     },
//   },

//   { timestamps: true }
// );

// export default mongoose.model("Order", orderSchema);

// New updates testing
// ✓ Single product
// ✓ Multiple quantity
// ✓ Multiple products
// ✓ Successful payment
// ✓ Failed payment
// ✓ Insufficient stock
// ✓ Payment amount
// ✓ Stock reduction
// ✓ Cancel
// ✓ Stock restore
// ✓ Reopen
// ✓ Insufficient stock on reopen
// ✓ Status progression
// ✓ Invoice
// ✓ Transaction History
// ✓ Product price update
// ✓ Old invoice remains old price

// ______________Architecture_______________
//                          E-COMMERCE
//                               │
//              ┌────────────────┴────────────────┐
//              │                                 │
//           CUSTOMER                            ADMIN
//              │                                 │
//             Cart                           Dashboard
//              │                                 │
//          Braintree                     ┌───────┴────────┐
//              │                         │                │
//        ┌─────┴─────┐              Orders           Analytics
//        │           │                 │                │
//      FAILED      SUCCESS             │          ┌─────┼─────┐
//        │           │                 │          │     │     │
//  Restore Stock     │             Status       Sales Visits Customers
//  No Order          │             Cancel       │     │     │
//                    │             Correct      │     │     │
//                    ▼             Invoice      │     │ Products
//                  ORDER                        │     │ Payments
//                    │                          │
//           ┌────────┼────────┐                 │
//           │        │        │                 │
//        Product   Qty     Price Snapshot ──────┘
//                               │
//                               ▼
//                     TRANSACTION HISTORY
//                               │
//                               ▼
//                            INVOICE
//                               │
//                          Print / PDF
//______________________________________________________________________________

// Final Payment Flow

// Ab tumhara complete flow:

//                      CART
//                        │
//                        ▼
//                 Check Stock
//                        │
//                        ▼
//                Reserve Stock
//                        │
//                        ▼
//                 Braintree Sale
//                        │
//               ┌────────┴────────┐
//               │                 │
//            FAILED             SUCCESS
//               │                 │
//               ▼                 ▼
//       PaymentAttempt       PaymentAttempt
//        success:false        success:true
//               │                 │
//               ▼                 ▼
//         Restore Stock       Create Order
//               │                 │
//               ▼                 ▼
//           No Order          Order V2
//                                 │
//                                 ▼
//                          Clear Reservation
//_____________________________________________________________________________

//     CUSTOMER
//                        │
//                        ▼
//                      CART
//                        │
//                        ▼
//                    BRAINTREE
//                        │
//              ┌─────────┴─────────┐
//              │                   │
//           SUCCESS              FAILED
//              │                   │
//              ▼                   ▼
//       PaymentAttempt        PaymentAttempt
//        success:true          success:false
//              │                   │
//              ▼                   ▼
//           ORDER               NO ORDER
//              │
//              ▼
//        Order V2
//              │
//        ┌─────┴──────┐
//        │            │
//     price        quantity
//    snapshot
//        │            │
//        └─────┬──────┘
//              ▼
//           ANALYTICS
//              │
//  ┌───────────┼────────────────┐
//  │           │                │
// Sales      Orders         Products
//  │           │                │
//  │           │                │
//  └───────────┼────────────────┘
//              │
//           Customers
//              │
//            Visits
//              │
//         PaymentAttempts
//              │
//              ▼
//       Analytics API
//              │
//              ▼
//       ADMIN DASHBOARD
//_______________________________________________________________________

//🔎 Index hota kya hai?

// MongoDB mein agar tumhare paas 100,000 orders hain aur tum query karo:
// orderModel.find({ status: "Processing" })
// Without index, MongoDB ko potentially bahut saare documents check karne pad sakte hain:

// Order 1 → Processing? ❌
// Order 2 → Processing? ❌
// Order 3 → Processing? ✅
// Order 4 → Processing? ❌
// ...
// Order 100,000 → Processing? ❌

// Yani collection scan.

// Index lagane ke baad MongoDB ke paas ek separate optimized structure hota hai jo us field ko quickly locate karta hai:

// Index
// Processing → [IDs of matching orders]
// Shipped    → [IDs of matching orders]
// delivered  → [IDs of matching orders]
// cancel     → [IDs of matching orders]

// Phir MongoDB directly relevant records tak ja sakta hai. 🚀
// ____________________________________________________________


// ____________REVIEW___STRUCTURE___________
//FRONTEND
// Home
//  └── ProductCard
//       └── ReviewSummary

// Search
//  └── ProductCard
//       └── ReviewSummary

// Category
//  └── ProductCard
//       └── ReviewSummary

// Related Products
//  └── ProductCard
//       └── ReviewSummary

// Product Details
//  └── ReviewsSection
//       ├── ReviewSummary
//       ├── ReviewForm
//       └── ReviewList

// FRONTEND
// │
// ├── components/
// │   └── Reviews/
// │       ├── ReviewSummary.jsx   ← reusable everywhere
// │       ├── ReviewForm.jsx      ← reusable review form
// │       ├── ReviewList.jsx      ← reusable review list
// │       └── ReviewsSection.jsx  ← complete ProductDetails section
// │
// └── styles/
//     └── Reviews.css
//_____________________

// BACKEND
// │
// ├── models/
// │   ├── productModel.js
// │   ├── orderModel.js
// │   ├── reviewModel.js          ← NEW
// │   └── paymentAttemptModel.js
// │
// ├── controllers/
// │   └── reviewController.js     ← NEW
// │
// └── routes/
//     └── reviewRoute.js          ← NEW
//__________________________________________________________________________

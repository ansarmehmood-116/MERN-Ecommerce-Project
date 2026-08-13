import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";

import fs from "fs";
import slugify from "slugify";
import braintree from "braintree";
import dotenv from "dotenv";

//for photo we have to install 'express-formidable' package so it will store in database
//other wise to add directly it will get the photo as a string.And we have to use 'fs module'
//i.e file system with it also so that is come with node by default we don't need to install it.
//now we will use req.fields instead of req.body beacuse of uploading file.

dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});
//_________________________________________________________________________________

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields; //as we are using formidable so req.field not req.body because it works
    //file i.e photo
    const { photo } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      //we donot add slug as it convert name by default
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    //three dots(...) are spread operators they will select all the input related field of
    //the request parameter to get all the properties
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating product",
    });
  }
};
//__________________________________________________________________________________

//get all products
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category") //the "category" name must be matched with the parameter of product
      //model i.e "category:" otherwise it will give error
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      counTotal: products.length,
      message: "Al-products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in getting products",
      error: error.message,
    });
  }
};
//____________________________________________________________________________________

//get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({
        slug: req.params.slug,
        // here we have used slug because we are finding product by name not by id so in name
        //we use slug to avoid spacing or null values
      })
      .select("-photo")
      .populate("category"); //the "category" name must be matched with the parameter of product
    //model i.e "category:" otherwise it will give error
    res.status(200).send({
      success: true,
      message: "single product fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while getting single product",
    });
  }
};
//______________________________________________________________________________

//get photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    } else {
      return res.status(404).send({
        success: false,
        message: "Photo not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};
//_______________________________________________________________________________

//delete controller
export const deleteProductController = async (req, res) => {
  try {
    // for delete we will use directly await no need to stire in a variable.
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
      // product, if we want to show the product deleted but for this we will then store
      //above await in product variable.
    });
  }
};
//___________________________________________________________________________

//upate products
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Updte product",
    });
  }
};
//________________________________________________________________________________

// filters
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    //here we are getting checked and radio variables objects from front end req.body arguments
    //we have stored objects in both arguments in Homepage

    let args = {};
    //here we also could write direct filter query but we have first stored the queries in
    //variable i.e args variable and stored both queries in object form because user can find
    //either product based on one or both filters category and price so we have stored both
    //inside object and then stored that object in args variable and then passed this
    //args variable inside .find(args) function so it is an efficient way.

    if (checked.length > 0) {
      args.category = checked; //query1
    }
    //here we are checking the length of checked because initially checked value is 0 and after
    //select it is 1 so to fulfill the condition we use length>0

    if (radio.length) {
      args.price = { $gte: radio[0], $lte: radio[1] }; //query2
    }
    //in radio button there is no indexing as we can select one radio button at time so we donot checked length>0
    //mogodb query $gte greater than equalto $lte less than equalto this is because
    //we have put two indexes in front end array i.e search by price so we have set two
    //prices in each array so we are getting both category and price from front end req.body
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
};
//______________________________________________________________________________________

// product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    //here find({}) means all products and estimatedDocumentCount() will give all counts
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};
//______________________________________________________________________________

// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 6; //we will show 6 products per page
    const page = req.params.page ? req.params.page : 1;
    //it will get page dynamically so if we click on a page it will give us page other wise
    //default it will give page 1.It is ternary condition
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      //it is mongoose function see details and documentation on google
      //The Formula: (page - 1) * perPage
      // page - 1: This gives the zero-based index of the page. For example, if page is 1
      //(the first page), page - 1 is 0. If page is 2 (the second page), page - 1 is 1.Multiply
      //by perPage: This calculates how many items to skip. For Example:
      // If page is 1 and perPage is 6, the calculation is (1 - 1) * 6 = 0. So, skip 0 items
      //(start from the first item).If page is 2 and perPage is 6, the calculation is
      //(2 - 1) * 6 = 6. So, skip the first 10 items (start from the 11th item).

      .limit(perPage) //limit will be 6
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};
//___________________________________________________________________________________

// search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } }, //$options:"i" means it will be case
          //insensitive.
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};
//_____________________________________________________________________________________

// similar products
export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid }, //$ne is a function used for not include
      })
      .select("-photo")
      .limit(3) //to show 3 products based on category
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};
//_______________________________________________________________________________

// get prdocyst by catgory
export const productCategoryController = async (req, res) => {
  //  const catName = req.params.slug; //we also could assign req.params like this.
  // const category = await categoryModel.findOne({ slug: catName}); //but we have used direct queries
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug }); //query 1
    const products = await productModel.find({ category }).populate("category"); //query 2
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};
//___________________________________________________________________________________

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
//____________________________________________________________________________________

//payment
export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      //in map the argument i will get all the values and we can get further
      //value from i then.
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce, //When a user submits their payment details (like credit
        // card information) on the frontend (often through a payment
        //form), Braintree tokenizes this sensitive information.
        //This tokenization process generates a nonce, which is a
        //short-lived, one-time-use identifier.The nonce is then
        //sent to your backend server, where it is used to initiate a
        //transaction.
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        //The result argument in the callback function of
        //gateway.transaction.sale is provided by the Braintree
        //payment gateway when a transaction is processed.
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id, //as we have added requireSignIn middleware in productRoutes
            //-->payment i.e /braintree/payment so it will get user from
            //there and the ._id will be extract from it.
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
//__________________________________________________________________________________________
export const carouselController=async(req,res)=>{
    
}
//__________________________________________________________________________________________
//reduced-quantity Controller
export const reducedQuantityController = async (req, res) => {
  const { productId, quantity } = req.body;
  //here we have used req.body because quantity exist in body not in params
  try {
    const product = await productModel.findById(productId).select("-photo");
    if (product) {
      product.quantity -= quantity;
      await product.save();
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ success: false, message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};
//____________________________OR 2ndway_______________________________

// export const reducedQuantityController= async (req, res) => {
//   const { productId, quantity } = req.body;
//   try {
//     // Use findByIdAndUpdate with $inc to atomically update the stock
//     const result = await productModel.findByIdAndUpdate(
//       productId,
//       { $inc: { quantity: -quantity } }, // Decrease stock by the specified quantity
//       { new: true }                   // Return the updated document
//     );

//     if (result) {
//       res.status(200).json({ success: true });
//     } else {
//       res.status(404).json({ success: false, message: "Product not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server error", error });
//   }
// };
//_____________________________________________________________________________________

// The difference between res.json() and res.send() in Express.js is subtle:

// res.json() automatically converts the response to a JSON string and sets the Content-Type
// header to application/json.res.send() can send a variety of types (strings, buffers, JSON, etc.) and
// doesn't automatically set the Content-Type unless the content is JSON. res.json() is specifically
// for sending JSON responses, while res.send() is more general-purpose.Both methods work
// similarly when sending JSON, but res.json() is slightly more explicit for JSON data.For
// consistency in API responses, res.json() is often preferred for sending JSON objects.
//______________________________________________________________________________________

// 1. JSON String:
// JSON (JavaScript Object Notation) is a lightweight data-interchange format that's easy for
// humans to read and write, and easy for machines to parse and generate.A JSON string is a
// text representation of data in JSON format. For example, in JavaScript, an object like
// { "name": "Ansar", "age": 25 } would be converted to a JSON string as {"name":"Ansar","age":25}.
// When sending data in HTTP responses, JSON strings are commonly used to ensure the data is
// formatted correctly and can be interpreted by the client.

// 2. Content-Type Header:
// The Content-Type header in an HTTP response tells the client what type of data is being
// sent by the server.It ensures that the client knows how to properly parse and display the
// content. For example, if you're sending JSON data, the Content-Type should be application/json.

// 3. application/json:
// application/json is a specific value for the Content-Type header that indicates the data 
// being sent is in JSON format.When a server responds with application/json, it tells the 
// client that the body of the response contains JSON data, and the client should parse it 
// accordingly.So, when you use res.json(), Express automatically converts your data to a 
// JSON string, and sets the Content-Type header to application/json, making it clear to the 
// client that the data is in JSON format.

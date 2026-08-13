import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react"; //see 0-Notes folder for details
// import { AiFillWarning } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartStyles.css";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState(""); //with braintree API
  const [instance, setInstance] = useState(""); //with braintree API
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
// ____________________________________________________________________________

// if someone add items to cart but not logged in and click on cart so it will make the cart empty dircetly untill you are not logged in but i have diabbled this part because if someone guest add items and want to buy that so it should available in their cart to remember upon login he will directed to this cart again and can check out but if he logged out without checkout then cart will be set to empty
  // useEffect(() => {
  //   if (!auth?.token) {
  //     setCart([]); // Clear cart in state
  //     localStorage.removeItem("cart"); // Clear cart from localStorage
  //   }
  // }, [auth?.token]);
  // __________________________________________________________________________

  //__See details about this function in 0-Notes.js
  const groupCartItems = (cart) => {
    return cart.reduce((acc, item) => {
      const foundItem = acc.find((cartItem) => cartItem._id === item._id);
      if (foundItem) {
        foundItem.quantity += 1;
      } else {
        acc.push({ ...item, quantity: 1 });
      }
      return acc;
    }, []);
  };

  const groupedCartItems = groupCartItems(cart);

  //total price
  const totalPrice = () => {
    try {
      let total = 0;
      // cart?.map((item) => {
      //   total = total + item.price;
      // });
      groupedCartItems.map((item) => {
        total += item.price * item.quantity;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
    }
  };
  //_________________________________________________________________________________

  //detele item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart); //to update the cart after deletion
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };
  //________________________________________________________________________________

  //get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/braintree/token");
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getToken();
  }, [auth?.token]);

  //   handle payments
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post("/api/v1/product/braintree/payment", {
        nonce,
        cart,
      });

      // Reduce quantity in database this is also best to use but i am using
      await Promise.all(
        //Parallel Execution: Promise.all allows multiple asynchronous
        //tasks to run in parallel rather than sequentially. This improves
        //performance, especially when sending multiple HTTP requests, as
        //they are all initiated simultaneously.
        groupedCartItems.map(async (item) => {
          try {
            await axios.post(`/api/v1/product/reduce-quantity`, {
              productId: item._id,
              quantity: item.quantity,
            });
          } catch (error) {
            console.error(
              `Failed to reduce quantity for product ${item._id}:`,
              error
            );
          }
        })
      );

      //If you don't use Promise.all, you would need to handle each asynchronous operation
      //individually,which can lead to several issues.Sequential Execution: Without Promise.all,
      //you would typically handle each asynchronous request one after the other, leading to
      //slower execution.
      // for (const item of groupedCartItems) {
      //   await axios.post(`/api/v1/product/reduce-quantity`, {
      //     productId: item._id,
      //     quantity: item.quantity,
      //   });
      // }

      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully ");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <Layout>
      <div className=" cart-page">
        <div className="row">
          <div className="col-md-12 cartHead">
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user
                ? "Hello Guest"
                : `Hello  ${auth?.token && auth?.user?.name}`}

              <p className="text-center">
                {/* {cart?.length */}
                {groupedCartItems.length
                  ? // ? `You Have ${cart.length} items in your cart ${
                    `You Have ${groupedCartItems.length} items in your cart ${
                      auth?.token ? "" : "please login to checkout !"
                    }`
                  : " Your Cart 🛒 Is Empty"}
              </p>
            </h1>
          </div>
        </div>
        <div className="container ">
          <div className="row ">
            <div className="col-md-7  p-0 m-0">
              {/* {cart?.map((p) => ( */}
              {groupedCartItems.map((p) => (
                <div className="row card flex-row" key={p._id}>
                  <div className="col-md-4">
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                      width="100%"
                      height={"130px"}
                    />
                  </div>
                  <div className="col-md-4">
                    <p>{p.name}</p>
                    <p>{p.description.substring(0, 30)}</p>
                    <p>Price : {p.price}$</p>
                    <p>Quantity : {p.quantity}</p>
                    {/* the cart is populated with products when users add items to it. Each
                     product object in the cart array includes properties like name, description
                     ,and price. When calculating the total price, the totalPrice function iterates
                    over the cart array, sums up the price of each product, and returns the total in
                     a formatted currency string. The product's price is accessed directly using item.price within the map function. */}
                  </div>
                  <div className="col-md-4 cart-remove-btn">
                    <button
                      className="btn btn-danger"
                      onClick={() => removeCartItem(p._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-md-4 ms-5 cart-summary ">
              <h2>Cart Summary</h2>
              <p>Total | Checkout | Payment</p>
              <hr />
              <h4>Total : {totalPrice()} </h4>
              {auth?.user?.address ? (
                <>
                  <div className="mb-3">
                    <h4>Current Address</h4>
                    <h5>{auth?.user?.address}</h5>
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  </div>
                </>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() =>
                        navigate("/login", {
                          state: "/cart",
                        })
                      }
                    >
                      Plase Login to checkout
                    </button>
                  )}
                </div>
              )}
              <div className="mt-2">
                {/* {!clientToken || !auth?.token || !cart?.length ? ( */}
                {!clientToken || !auth?.token || !groupedCartItems.length ? (
                  ""
                ) : (
                  <>
                    <DropIn
                      //we can add this API from npm js braintree-web-drop-in-react
                      options={{
                        authorization: clientToken,
                        paypal: {
                          flow: "vault",
                        },
                      }}
                      onInstance={(instance) => setInstance(instance)}
                    />

                    <button
                      className="btn btn-primary mb-2 mt-2"
                      onClick={handlePayment}
                      disabled={loading || !instance || !auth?.user?.address}
                    >
                      {loading ? "Processing ...." : "Make Payment"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;

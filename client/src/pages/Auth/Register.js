import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import toast from "react-hot-toast";
//here we have removed ",{Toaster}" no need of it
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/AuthStyles.css";
//this our own css so we have imported it.

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();

  //form handle function to evolve each time refresh behavior of form
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(name,email,password,phone,address);
    try {
      const res = await axios.post(
        // `${process.env.REACT_APP_API}/api/v1/auth/register`, we will use env later as we have already added proxy
        "/api/v1/auth/register",
        { name, email, password, phone, address, answer }
      );
      ///api/v1/auth/register this path is added from server.js
      //and register is API from authRoute.js
      if (res && res.data.success) {
        toast.success(res && res.data.message);
        navigate("/login");
      } else {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Register - Ecommerce App"}>
      <div className="form-container" style={{ minHeight: "90vh" }}>
        <form onSubmit={handleSubmit}>
          <h4 className="title">REGISTER FORM</h4>
          <div className="mb-3">
            {/* <label htmlFor="exampleInputName" className="form-label">
              Name
            </label> */}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Name"
              required
            />
          </div>
          <div className="mb-3">
            {/* <label htmlFor="exampleInputName" className="form-label">
              Email
            </label> */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Email"
              required
              // aria-describedby="emailHelp"
            />
            {/* <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div> */}
          </div>
          <div className="mb-3">
            {/* <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label> */}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Enter Your Password"
              required
            />
          </div>
          <div className="mb-3">
            {/* <label htmlFor="exampleInputName" className="form-label">
              phone
            </label> */}
            <input
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Phone"
              required
            />
          </div>
          <div className="mb-3">
            {/* <label htmlFor="exampleInputName" className="form-label">
              Address
            </label> */}
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Address"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="What Is Your Favourite Sports"
              required
            />
          </div>
          {/* <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="exampleCheck1"
            />
            <label className="form-check-label" htmlFor="exampleCheck1">
              Check me out
            </label>
          </div> */}
          <button type="submit" className="btn btn-primary">
            REGISTER
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Register;

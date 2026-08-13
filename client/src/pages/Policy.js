// rafc for shortcuts
import React from "react";
import Layout from "../components/Layout/Layout";

const Policy = () => {
  return (
    <Layout title={"Privacy Policy"}>
      {/* <h1>Privacy Policy Page</h1> */}
      <div className="container-fluid policy">
        <div className="row">
          <div className="col-md-6 ">
            <img
              src="/images/contactus.jpeg"
              alt="contactus"
              style={{ width: "100%" }}
            />
          </div>
          <div className="col-md-6">
            <p>add privacy policy</p>
            <p>add privacy policy</p>
            <p>add privacy policy</p>
            <p>add privacy policy</p>
            <p>add privacy policy</p>
            <p>add privacy policy</p>
            <p>add privacy policy</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;

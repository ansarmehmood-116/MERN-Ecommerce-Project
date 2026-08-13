import React from "react";
import Layout from "../components/Layout/Layout";

const About = () => {
  return (
    <Layout title={"About us - Ecommerce app"}>
        {/* we have enclosed all our pages in <Layout></Layout> page tags so all pages will
        consists of headers and footers */}
      {/* <h1>About-page</h1> */}

      <div className="row contactus">
        <div className="col-md-6 about-img">
          <img
            src="/images/about.jpeg"
            alt="contactus"
            style={{ width: "90%", height:"50vh"}}
          />
        </div>
        <div className="col-md-4 ContactDetails">
          <p className="text-justify mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
            officiis obcaecati esse tempore unde ratione, eveniet mollitia,
            perferendis eius temporibus dicta blanditiis doloremque explicabo
            quasi sunt vero optio cum aperiam vel consectetur! Laborum enim
            accusantium atque, excepturi sapiente amet! Tenetur ducimus aut
            commodi illum quidem neque tempora nam.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;

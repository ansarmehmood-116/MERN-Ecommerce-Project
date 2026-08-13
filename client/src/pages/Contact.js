import React from 'react'
import Layout from '../components/Layout/Layout'
import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";
// here we have imported all contact icons from react icons and used their names

const contact = () => {
  return (
   <Layout title={"Contact us"}>
      {/* <h1>Contact-page</h1> */}
      <div className="container-fluid row contactus">
        <div className="col-md-6 ">
          <img
            src="/images/contactus.jpeg"
            // note here we have added image directly in this page without importing the images
            // this is because images folder is in public directory and it donot need to import
            //anything from public directory
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4 ContactDetails">
          <h1 className="bg-dark p-2 text-white text-center">CONTACT US</h1>
          <p className="text-justify mt-2">
            any query and info about prodduct feel free to call anytime we 24X7
            vaialible
          </p>
          <p className="mt-3">
            <BiMailSend /> : www.help@ecommerceapp.com
          </p>
          <p className="mt-3">
            <BiPhoneCall /> : 012-3456789
          </p>
          <p className="mt-3">
            <BiSupport /> : 1800-0000-0000 (toll free)
          </p>
        </div>
      </div>
   </Layout>
  )
}

export default contact

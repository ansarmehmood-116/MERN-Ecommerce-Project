// use rafce for shorcuts of react to get the function directly
import React, { Children } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet";
import { Toaster } from 'react-hot-toast';
import { useTheme } from "../../context/themeContext";
import Theme from "./Themes/Theme";
import ScrollToTop from "react-scroll-to-top";

// const Layout = (props,{title,description,keywords,author}) => {
//in this case these objects were not working as they works with children-pages but in this
//case childen is defined inside main which can't communicates with these properties
const Layout = ({ children, title, description, keywords, author }) => {
  const[theme]=useTheme()
  return (
    <div>
      {/* <h1>Layout</h1> */}

      <Helmet>
        <meta charSet="utf-8" />

        {/* copied html meta-tags and convert to jsx and changed the content value to our own
        dynamically that's why we are passing object parameters in value to trace every-page 
        wrapped in layout otherwise we will have to add in every-page statically*/}
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />

        <title>{title}</title>
        {/* by default it will now showing E-commerce Application because we have added this in
        index.html title*/}
      </Helmet>


      <Header />
      {/* this is header page we imported here */}
       
      <Theme/>
      <main style={{ minHeight: "80vh"}}>
       <Toaster />
        {/* {props.children} */}
        {children}
        {/* using props to display the child contents wrapped in <Layout></Layout> tags in app.js */}
        {/* we also can use {children} above as parameter instead of props and here directly use {children} output will be same */}

        <ScrollToTop
          smooth
          top={10}  // Adjust top position as needed
          color="#f29f67"
          style={{
            backgroundColor: "#1e1e2c",
            borderRadius: "80px",
            zIndex: 1000,
            position: "fixed",
            bottom: "40px",
            right: "20px",
            // border: "2px solid red",
          }}
        />
      </main>
      <Footer />
      {/* this is Footer page we imported here */}
    </div>
  );
};

// below details will show by default for the pages for which we have not set title and other
// details, if we set title for that pages then that title will show while rest details will
// be default untill we have not set remaining details in that pages like description,author
// keywords in each page. and if we hide these details then index.html title name will show
// by default only.
Layout.defaultProps = {
  title: "E-commerce app - shop now",
  description: "mern stack project",
  keywords: "mern,react,node,mongodb",
  author: "Ansar Mehmood",
};

export default Layout;

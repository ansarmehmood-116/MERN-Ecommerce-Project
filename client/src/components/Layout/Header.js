// rafce for function shortcut
import React, { useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
// import { GiShoppingBag, GiShoppingCart } from "react-icons/gi";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import { Badge } from "antd"; //it is very best in antd design see for details ant design
//use for notification view
import { useTheme } from "../../context/themeContext";
import SizeContext from "antd/es/config-provider/SizeContext";
import AOS from "aos";
import "aos/dist/aos.css";

const Header = () => {
  const [theme] = useTheme();
  const [auth, setAuth] = useAuth(); //it is context global
  const [cart, setCart] = useCart(); //it is context global

  const categories = useCategory(); //it is hook i.e hooks-->useCategory also imported above

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    }); //here we have set this auth because if we clear the user data from page statetment
    //then we will not need to refresh the page to clear the local storage on simple click
    //on Logout other wise if we use below option only then on each time we have to
    //refresh the page to clear local storage.
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");

    // Clear the cart
    setCart([]);
    localStorage.removeItem("cart");
  };

  //useEffect for AOS Animation Effect
  useEffect(() => {
    AOS.init({ duration: 600 });
  });
  return (
    // <div>
    //   <h1>Header Comp</h1>
    // </div>

    <>
      {/* select all html tag which we have copied from bootsrap and right click on it and
    select convert html to js6 so error will be erased */}

      {/* 2ndly as all links are put in anker tags so it is also error not working in react
    so simply click on one a of any anker tag and press ctrl+d so all will be selected so
    remove that and write above imported link NavLink and also at start of each NavLink
    write to='/' later we will add the path also remove all href="#"*/}

      <nav
        className="navbar navbar-expand-lg bg-body-tertiary fixed-top"
        id={theme}
      >
        <div className="container-fluid">
          {/* Mobile-only brand */}
          <div className="mobile-brand">
            <Link to="/" className="navbar-brand">
              🛒ECOMMERCE APP
            </Link>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <div className="desktop-brand" data-aos="flip-right">
              <Link to="/" className="navbar-brand">
                {/* <GiShoppingBag/> */}
                🛒ECOMMERCE APP
              </Link>
            </div>
            {/* here we have imported link above and chnage NavLink to Link because navLink is linked 
            with style css class while we donot want to apply active-class on brand so we have changed
            it to Link which has no style css class and act as a single (anchor tag) and also write
            E-commerce Name as brand, secondly we want to add icon with brand name so simply goto
            react icons-->package:npm install react-icons --save and install it in cd client terminal.
            It is for modern standard projects,now import it from react-icons see above */}
            {/* we also have installed :emojisense extension in vs code now put icons every
             where we want to insert simply press ctrl+i */}
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {/* here we have change me to ms-auto it will move margin from start to end */}
              <div className="desktop-search">
                <SearchInput />
              </div>
              <li className="nav-item">
                <NavLink
                  to="/"
                  className="nav-link"
                  aria-current="page"
                  //this will refer to default home page
                >
                  Home
                </NavLink>
              </li>
              {/* __________________________________________________________________ */}

              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to={"/categories"}
                  //here the /categories are above imported hook i.e useCategory hook from hooks folder
                  data-bs-toggle="dropdown"
                >
                  Categories
                </Link>
                <ul className="dropdown-menu">
                  <li>
                    <Link
                      className="dropdown-item categoriesDropdown"
                      to={"/categories"}
                    >
                      {/*here the /categories are above imported hook i.e useCategory hook from hooks folder */}
                      All Categories
                    </Link>
                  </li>
                  {categories?.map((c) => (
                    <li>
                      <Link
                        className="dropdown-item categoriesDropdown"
                        to={`/category/${c.slug}`}
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              {/* ____________________________________________________________________ */}

              {!auth.user ? (
                <>
                  <li className="nav-item">
                    <NavLink to="/register" className="nav-link">
                      Register
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/login" className="nav-link">
                      Login
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item dropdown">
                    <NavLink
                      className="nav-link dropdown-toggle"
                      role="button"
                      data-bs-toggle="dropdown"
                      // aria-expanded="false"
                      style={{ border: "none" }}
                    >
                      {auth?.user?.name}
                    </NavLink>
                    <ul className="dropdown-menu">
                      <li>
                        <NavLink
                          to={`/dashboard/${
                            auth?.user?.role === 1 ? "admin" : "user"
                          }`}
                          className="dropdown-item"
                        >
                          Dashboard
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink
                          onClick={handleLogout}
                          to="/login"
                          className="dropdown-item"
                        >
                          Logout
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                </>
              )}
              <li className="nav-item">
                <NavLink to="/cart" className="nav-link">
                  {/* as cart is array that's why we are using .length */}
                  <Badge
                    count={cart?.length}
                    showZero
                    offset={[10, -5]}
                    className="cart"
                  >
                    {/* Cart (0) */}
                    Cart
                    {/* <GiShoppingCart/> */}
                  </Badge>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;

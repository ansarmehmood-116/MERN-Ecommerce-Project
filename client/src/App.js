// import './App.css'; //no need of it
// import Layout from './components/Layout/Layout';
import { Routes, Route } from "react-router-dom";
// here Routes will act as a container we will put each Route
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Policy from "./pages/Policy";
import Pagenotfound from "./pages/Pagenotfound";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/user/Dashboard";
import PrivateRoute from "./components/Routes/Private";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import AdminRoute from "./components/Routes/AdminRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateCategory from "./pages/Admin/CreateCategory";
import CreateProduct from "./pages/Admin/CreateProduct";
import Users from "./pages/Admin/Users";
import Orders from "./pages/user/Orders";
import Profile from "./pages/user/Profile";
import Products from "./pages/Admin/Products";
import UpdateProduct from "./pages/Admin/UpdateProduct";
import Search from "./pages/Search";
import ProductDetails from "./pages/ProductDetails";
import Categories from "./pages/Categories";
import CategoryProduct from "./pages/CategoryProduct";
import CartPage from "./pages/CartPage";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminUsers from "./pages/Admin/AdminUsers";
import { useTheme } from "./context/themeContext";
import ScrollToTop from "react-scroll-to-top";
import "./App.css";

function App() {
  const [theme] = useTheme();
  return (
    <>
      {/* <Layout>
      <h1>E-commerce App</h1>
    </Layout>  now it is not needed we have used it just for testing*/}

      {/* as react is not SEO (search engine optimization) friendly so it is not showing the
     page title in server bar on which are currently at so we will work also on it,as much it
     is optimized our website will be of high ranking display first for search for this we 
     will add and find some keywords to be high ranked */}

      <div id={theme}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/category/:slug" element={<CategoryProduct />} />
          <Route path="/search" element={<Search />} />
          {/* private routes, now first of all here the private route will check then inside
      the dashboard we will access other pages which are nested inside dashboard which is
      wrapped in private route */}
          {/* USER PANNEL */}
          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route path="user" element={<Dashboard />} />
            <Route path="user/orders" element={<Orders />} />
            <Route path="user/profile" element={<Profile />} />
            {/* this is nested route */}
          </Route>

          {/* ADMIN PANNEL*/}
          <Route path="/dashboard" element={<AdminRoute />}>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/create-category" element={<CreateCategory />} />
            <Route path="admin/create-product" element={<CreateProduct />} />
            <Route path="admin/product/:slug" element={<UpdateProduct />} />
            <Route path="admin/Products" element={<Products />} />
            <Route path="admin/adminUsers" element={<AdminUsers />} />
            <Route path="admin/users" element={<Users />} />
            <Route path="admin/orders" element={<AdminOrders />} />
          </Route>

          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="*" element={<Pagenotfound />} />
          {/* here we have used a trick i.e '*' so it will be global for all the above rest pages if any one not found it will give pagenot  found error */}
        </Routes>
      </div>
    </>
  );
}

export default App;

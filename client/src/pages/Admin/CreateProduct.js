import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
const { Option } = Select; //destructured from antd for dropdown menu

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");

  //get all category
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting catgeory");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);
  //____________________________________________________________________________

  //create product function
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      //1-we are using form data because we have photo so browser have default form we can 
      //use it
      //2- if we donot want to use formData then wrap all the input anmd select tags within
      //form tag and add handle create function on form on submit event.
      const productData = new FormData();//it is created with new keywor
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("photo", photo);
      productData.append("category", category);
      const { data } = axios.post(
        "/api/v1/product/create-product",
        productData //instead of passing one by one parameter it is good to pass productData
      );
      if (data?.success) {
        toast.error(data?.message); //instead of optional Chaining we also can use
                                    //data && data.message
      } else {
        toast.success("Product Created Successfully");
        navigate("/dashboard/admin/products");
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };
  //_____________________________________________________________________________

  return (
    <Layout title={"Dashboard - Create Product"}>
      <div className="container-fluid p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center productsHeading">Create Product</h1>
            <div className="ms-5 w-75">
              <Select
                bordered={false} //to make border hidden
                placeholder="Select a category"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => {
                  //in antd css library we get by default the "(value)" props in functions
                  //we donot need to set explicitly it takes the value from select option itself
                  setCategory(value);
                }}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
              <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12 productPhoto">
                  {photo ? photo.name : "Upload Photo"}
                  {/* here we have used ternary operator if photo exits it will show photo name 
                  //other wise say upload photo */}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*" //the accept property will only accept image and image/* means
                    //any type of image png,jpg etc
                    onChange={(e) => setPhoto(e.target.files[0])}
                    //in above we have used antd design Select box that's why we have used default value
                    //here we are using other framworks boxes i.e div so we use (e) event and file exist
                    //in array form that's why i have used [0] index 0.
                    hidden
                  />
                </label>
              </div>
              <div className="mb-3">
                {/* this div will show the uploaded image */}
                {photo && ( //this line means if photo exists the return
                  <div className="text-center">
                    <img
                      //as we havn't direct photo and niether we can get direct image so we use the
                      //url parameters of browser and can get photo i.e when we select image in above
                      //label so the brwoser has some properties to get that image and can access to the
                      //the address of that photo so we will use this property and display image
                      //we also can add some package from npm js to show photo preview check a good
                      //documented package and use but we can use browser property which is best
                      src={URL.createObjectURL(photo)}
                      alt="product_photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={name}
                  placeholder="write a name"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <textarea
                  type="text"
                  value={description}
                  placeholder="write a description"
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <input
                  type="number"
                  value={price}
                  placeholder="write a Price"
                  className="form-control"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={quantity}
                  placeholder="write a quantity"
                  className="form-control"
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <Select
                  bordered={false}
                  placeholder="Select Shipping "
                  size="large"
                  showSearch
                  className="form-select mb-3"
                  onChange={(value) => {
                    setShipping(value);
                  }}
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </div>
              <div className="mb-3">
                <button className="btn btn-primary" onClick={handleCreate}>
                  CREATE PRODUCT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;

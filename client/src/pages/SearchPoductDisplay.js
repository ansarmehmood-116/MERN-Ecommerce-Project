import React from "react";
import Layout from "../components/Layout/Layout";
import { useSearch } from "../context/search";
import { useCart } from "../context/cart"; // Added for Cart functionality
import { useNavigate } from "react-router-dom"; // Added for navigation
import toast from "react-hot-toast"; // Added for notifications
import "../styles/SearchProductDisplay.css";
import FavouriteButton from "../components/FavouriteButton";
import ReviewSummary from "../components/Reviews/ReviewSummary";

const Search = () => {
  const [values] = useSearch();
  const [cart, setCart] = useCart(); // Initialize Cart state
  const navigate = useNavigate(); // Initialize Navigate hook

  return (
    <Layout title={"Search results"}>
      <div className="search-page">
        <div className="Searchcontainer">
          <div className="text-center searchData m-0">
            <h1 className="searchResult mt-3">Search Results</h1>
            <h6 className="searchResult mb-4">
              {values?.results.length < 1
                ? "No Products Found"
                : `Found ${values?.results.length}`}
            </h6>
            {values.results && values.results.length < 1 ?
               (
                  <div className="text-center my-5 p-4 border rounded bg-white shadow-sm">
                    <i className="bi bi-exclamation-circle text-warning fs-1 d-block mb-2"></i>
                    <h4 className="fw-bold text-secondary">
                      No Products Found
                    </h4>
                    <p className="text-muted mb-0">
                      {values.keyword
                        ? `No results match your search "${values.keyword}". Try searching with a different name or category.`
                        : "No products available in the inventory."}
                    </p>
                  </div>
                ):(
            <div className="d-flex flex-wrap justify-content-center SearchProductContainer">
              {values?.results.map((p) => (
                <div
                  className="card m-2 productBox position-relative"
                  key={p._id}
                >
                  <div className="card-image-wrapper">
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                    />
                  </div>
                  <div className="position-absolute top-0 end-0 m-2">
                    <FavouriteButton productId={p?._id} />
                  </div>

                  <div className="card-body">
                    <div className="card-name-price">
                      <h5 className="card-title">{p.name}</h5>
                      <h5 className="card-title card-price">
                        {p.quantity > 0 ? (
                          p.price.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })
                        ) : (
                          <span className="out-stock">*Out Of Stock</span>
                        )}
                      </h5>
                    </div>
                       <ReviewSummary
                        rating={p.averageRating}
                        count={p.reviewCount}
                      />
                    <p className="card-text">
                      {p.description.substring(0, 35)}...
                    </p>

                    <div className="card-name-price">
                      <button
                        className="btn btn-info ms-1 productbtn"
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        More Details
                      </button>
                      <button
                        className="btn btn-dark ms-1 cartBtn productbtn"
                        onClick={() => {
                          setCart([...cart, p]);
                          localStorage.setItem(
                            "cart",
                            JSON.stringify([...cart, p]),
                          );
                          toast.success("Item Added to cart Successfully");
                        }}
                        disabled={p?.quantity <= 0}
                      >
                        🛒
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;

// import React from "react";
// import Layout from "./../components/Layout/Layout";
// import { useSearch } from "../context/search";
// const Search = () => {
//   const [values, setValues] = useSearch();
//   return (
//     <Layout title={"Search results"}>
//       <div className="container">
//         <div className="text-center">
//           <h1>Search Resuts</h1>
//           <h6>
//             {values?.results.length < 1
//               ? "No Products Found"
//               : `Found ${values?.results.length}`}
//           </h6>
//           <div className="d-flex flex-wrap mt-4">
//             {values?.results.map((p) => (
//               <div className="card m-2" style={{ width: "18rem" }}>
//                 <img
//                   src={`/api/v1/product/product-photo/${p._id}`}
//                   className="card-img-top"
//                   alt={p.name}
//                 />
//                 <div className="card-body">
//                   <h5 className="card-title">{p.name}</h5>
//                   <p className="card-text">
//                     {p.description.substring(0, 30)}...
//                   </p>
//                   <p className="card-text"> $ {p.price}</p>
//                   <button class="btn btn-primary ms-1">More Details</button>
//                   <button class="btn btn-secondary ms-1">ADD TO CART</button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Search;

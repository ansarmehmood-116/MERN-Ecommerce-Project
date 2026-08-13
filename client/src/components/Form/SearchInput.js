import React from "react";
import { useSearch } from "../../context/search";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchInput = () => {
  const [values, setValues] = useSearch(); 
  //here the useSearch state will provide object to values
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `/api/v1/product/search/${values.keyword}` //it will search the keyword in database
      );
      setValues({ ...values, results: data, keyword: ""});//here results Array from search.js in context
                                              // will be fill with :data
                                              // Preserve Existing Properties: When you use { ...values, keyword: e.target.value }, you're creating a new object that includes all the properties of the existing values object. This ensures that any other properties in values are not lost when you update the keyword.
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };


  return (
    // copied this search div from bootstrap navbar only search component converted to
    <div>
      <form
        className="d-flex search-form"
        role="search"
        onSubmit={handleSubmit}
      >
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={values.keyword}  //values.keyword from useSearch will assign to value
          onChange={(e) => setValues({ ...values, keyword:e.target.value })}
                                                  //keyword will get e.target.value and sent
                                                  //request to server
        />
        <button className="btn btn-outline-success" type="submit">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchInput;
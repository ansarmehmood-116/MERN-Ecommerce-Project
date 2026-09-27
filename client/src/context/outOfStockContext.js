import React, { useState, useContext, useEffect } from "react";
import axios from "axios";

const OutOfStockContext = React.createContext();

const OutOfStockProvider = ({ children }) => {
  const [outOfStockProducts, setOutOfStockProducts] = useState([]);
  const [outOfStockCount, setOutOfStockCount] = useState(0);

  const getOutOfStockProducts = async () => {
    try {
      const { data } = await axios.get(
        "/api/v1/product/out-of-stock"
      );

      if (data?.success) {
        setOutOfStockProducts(data.products);
        setOutOfStockCount(data.count);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOutOfStockProducts();
  }, []);

  return (
    <OutOfStockContext.Provider
      value={{
        outOfStockProducts,
        outOfStockCount,
        getOutOfStockProducts,
      }}
    >
      {children}
    </OutOfStockContext.Provider>
  );
};

// Custom hook
const useOutOfStock = () => useContext(OutOfStockContext);

export { OutOfStockProvider, useOutOfStock };
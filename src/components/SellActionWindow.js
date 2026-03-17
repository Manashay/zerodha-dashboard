import React, { useState, useEffect, useContext } from "react"; // Use useEffect instead of useState for API
import { Link } from "react-router-dom";
import axios, { Axios } from "axios";
import GeneralContext from "./GeneralContext";
import "./SellActionWindow.css";

const SellActionWindow = ({ uid }) => {
  const [allHoldings, setHoldings] = useState([]);
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);

  const { closeSellWindow } = useContext(GeneralContext);

  // Use useEffect for data fetching
  useEffect(() => {
    axios.get("http://localhost:3002/allHoldings").then((res) => {
      setHoldings(res.data);
      // Initialize price based on the current stock's market price
      const currentStock = res.data.find((s) => s.name === uid);
      if (currentStock) {
        setStockPrice(currentStock.price);
      }
    });
  }, [uid]);

  const handleSellClick = (id, currentStock) => {
    axios.post("http://localhost:3002/newOrder", {
      name: uid,
      qty: Number(stockQuantity),
      price: Number(stockPrice),
      mode: "SELL",
    });

    const updatedQty = currentStock - Number(stockQuantity);
    if(updatedQty > 0){
        axios.put(`http://localhost:3002/upadateHolding/${id}`, {
          qty: updatedQty,
        }).then(() => {
          closeSellWindow();
          window.location.reload();
        });
    }
  };

  const handleCancelClick = () => {
    closeSellWindow();
  };

  return (
    <>
      {allHoldings
        .filter((stock) => stock.name === uid)
        .map((stock, index) => {
          // This calculates the total value based on the user's input quantity
          const totalValue = (stock.price * stockQuantity).toFixed(2);

          return (
            <div className="container" id="buy-window" draggable="true" key={index}>
              <div className="regular-order">
                <span>Stock: {stock.name}</span>
                <div className="inputs">
                  <fieldset>
                    <legend>Qty.</legend>
                    <input
                      type="number"
                      name="qty"
                      id="qty"
                      min="1"
                      max={stock.qty}
                      onChange={(e) => setStockQuantity(Number(e.target.value))}
                      value={stockQuantity}
                    />
                  </fieldset>
                  <fieldset>
                    <legend>Total Price</legend>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      step="0.05"
                      // We show the calculated total value here
                      value={totalValue} 
                      readOnly // Usually total is read-only if based on market price
                    />
                  </fieldset>
                </div>
              </div>
              <div className="buttons">
                <span>Available: {stock.qty}</span>
                <span>Market Price: {stock.price}</span>
                <div>
                  <Link className="btn btn-red" onClick={() => handleSellClick(stock._id, stock.qty)}>
                    Sell
                  </Link>
                  <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
                    Cancel
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default SellActionWindow;
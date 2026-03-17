import axios from "axios";
import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";

const Orders = () => {

  const [allOrders, setOrders] = useState([]);

  useState(() => {
    axios.get("https://zerodha-clone-backend-wzd3.onrender.com/allOrders").then((res)=> {
      console.log(res.data);
      setOrders(res.data);
    });
  }, []);


  return (
    <>
      <h3 className="title">Orders ({allOrders.length})</h3>

      <div className="order-table">
        <table>
          <tr>
            <th>Name</th>
            <th>Qty.</th>
            <th>Price</th>
            <th>Mode</th>
          </tr>
          
          {allOrders.map((stock, index) => {
            return(
              <tr key={index}>
                <td>{stock.name}</td>
                <td>{stock.qty}</td>
                <td>{stock.price}</td>
                <td>{stock.mode}</td>
              </tr>
            );
          })}
        </table>
      </div>
    </>
  );
};

export default Orders;

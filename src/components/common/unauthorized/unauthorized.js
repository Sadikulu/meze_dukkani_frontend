import React from "react";
import "./unauthorized.scss";

const Unauthorized = () => {
  return (
    <div className="unauthorized">
      <h2>Opps! Bir şeyler ters gitti</h2>
      <p>Bu sayfaya girmeye izniniz yoktur</p>
    </div>
  );
};

export default Unauthorized;

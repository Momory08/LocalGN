import React from "react";
import { FaStar } from "react-icons/fa";

const StaticStar = ({ value }) => (
  <span style={{ color: "#fbbf24", fontSize: 18, marginRight: 2 }}>
    {Array.from({ length: 5 }, (_, i) => (
      <FaStar key={i} color={i < value ? "#fbbf24" : "#e4e5e9"} />
    ))}
  </span>
);

export default StaticStar;

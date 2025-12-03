import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const StarRating = ({ rating, onRate, disabled }) => {
  const [hover, setHover] = useState(null);
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={24}
          color={star <= (hover || rating) ? "#fbbf24" : "#e4e5e9"}
          style={{ cursor: disabled ? "default" : "pointer", transition: "color 0.2s" }}
          onClick={() => !disabled && onRate(star)}
          onMouseEnter={() => !disabled && setHover(star)}
          onMouseLeave={() => setHover(null)}
        />
      ))}
    </div>
  );
};

export default StarRating;

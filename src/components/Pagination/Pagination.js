import React from "react";
import "./Pagination.css";

export default function Pagination({
  currentNumber,
  itemsPerPage,
  totalItems,
  paginate,
}) {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <div className="pagination">
      {pageNumbers.map((number) => {
        return (
          <a
            className={currentNumber == number ? "active" : ""}
            key={number}
            onClick={() => paginate(number)}
            href="#"
          >
            {number}
          </a>
        );
      })}
    </div>
  );
}

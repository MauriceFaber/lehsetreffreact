import React from "react";
import "./Pagination.css";

/**
 * Legt die Seitenanzahl fest.
 * @param {number} currentNumber
 * Aktuelle Seitenzahl.
 * @param {number} itemsPerPage 
 * Anzahl der Items pro Seite.
 * @param {number} totalItems 
 * Anzahl der gesamten Items.
 * @param {index} paginate
 * Die Nummerierung.
 * @returns 
 * die Seitenanzahl.
 */
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

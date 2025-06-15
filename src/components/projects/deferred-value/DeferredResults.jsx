import { useState, useDeferredValue, useMemo } from "react";
import { largeProductDataset, expensiveSearchFilter } from "./productDataset"; // Assuming this is the path to your dataset
import styles from "./DeferredResults.module.css"; // Assuming you have some styles defined

const DeferredResults = (props) => {
  const [searchTerm, setSearchTerm] = useState("");

  // 1️⃣ Defer for UI render updates. Filter/sort data already loaded. (local)
  const deferredSearchTerm = useDeferredValue(searchTerm);

  // 🏠 LOCAL: Filter products already in memory
  const filteredProducts = useMemo(() => {
    // Return first 50 products if search term is empty
    if (deferredSearchTerm.trim() === "")
      return largeProductDataset.slice(0, 50);
    // Else return filtered all products based on the search term
    return expensiveSearchFilter(largeProductDataset, deferredSearchTerm);
  }, [deferredSearchTerm]);

  return (
    <div>
      <p>useDeferredValue for local (cached) data filtering</p>
      <div className={styles["search__input"]}>
        <label htmlFor="">Search products</label>
        <input
          type="search"
          value={searchTerm}
          placeholder="Search 2000 products"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles["results__container"]}>
        <span className={styles["results__feedback"]}>
          Showing {filteredProducts.length} products
        </span>
        <ul className={styles["results__list"]}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((result) => (
              <li key={result.id}>
                <span>
                  {result.name} - {result.brand}
                </span>
              </li>
            ))
          ) : (
            <li>No results found</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DeferredResults;

import { useState, useMemo, useTransition } from "react";
import { largeProductDataset, expensiveSearchFilter } from "./productDataset"; // Assuming this is the path to your dataset
import styles from "./UseTransitionHook.module.css"; // As
import Spinner from "../../ui/spinner/Spinner";

const UseTransitionHook = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();
  const [deferredSearchTerm, setDeferredSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    // Return first 50 products if search term is empty
    if (deferredSearchTerm.trim() === "")
      return largeProductDataset.slice(0, 50);
    // Else return filtered all products based on the search term
    return expensiveSearchFilter(largeProductDataset, deferredSearchTerm);
  }, [deferredSearchTerm]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    // Start a transition to update the deferred search term
    startTransition(() => {
      setDeferredSearchTerm(value);
    });
  };

  return (
    <main>
      <div className={styles["search__input"]}>
        <label htmlFor="">Search products</label>
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>
      <div className={styles["results__container"]}>
        <span className={styles["results__feedback"]}>
          Showing {filteredProducts.length} products
        </span>
        {isPending && <Spinner />}
        <ul
          className={`${styles["results__list"]} ${
            isPending ? styles["opacity-50"] : ""
          }`}
        >
          {filteredProducts.length > 0 && !isPending ? (
            filteredProducts.map((product) => (
              <li key={product.id} className={styles["results__item"]}>
                {product.name}
              </li>
            ))
          ) : (
            <li>No results found</li>
          )}
        </ul>
      </div>
    </main>
  );
};

export default UseTransitionHook;
0;

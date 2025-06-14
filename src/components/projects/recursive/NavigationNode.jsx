import styles from "./recursive.module.css";

const NavigationNode = ({ data, level = 0 }) => {
  // Handle array of items
  if (Array.isArray(data)) {
    return (
      <ul className={styles["tree-list"]} role={level === 0 ? "tree" : "group"}>
        {data.map((item) => (
          <NavigationNode key={item.id} data={item} level={level} />
        ))}
      </ul>
    );
  }

  //  Handle single object with children
  const hasChildren = data.children && data.children.length > 0;

  return (
    <li
      className="tree-item"
      role="menuitem"
      aria-expanded={hasChildren ? undefined : null}
    >
      {hasChildren ? (
        <details className={styles["item-details"]}>
          <summary className={styles["item-summary"]}>
            {/* 
              // Parent items can still be clickable links 
              // This allows clicking the parent to navigate AND expand
            <a
              href={data.href}
              className={styles["parent-link"]}
            >
              {data.label}
            </a>
            */}
            <span className={styles["parent-link"]}>{data.label}</span>
            <span aria-hidden="true">+</span>
          </summary>
          <NavigationNode data={data.children} level={level + 1} />
        </details>
      ) : (
        <a
          className={`${styles["nav-link"]} ${styles["item-summary"]}`}
          href={data.href}
        >
          <span aria-hidden="true">🔗</span>
          {}
          <span>{data.label}</span>
          <span>{data.text}</span>
        </a>
      )}
    </li>
  );
};

export default NavigationNode;
